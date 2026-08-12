import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Truck, Megaphone, Clock, MapPin, Eye, Bell, Volume2, ShieldCheck, ArrowUpRight, ClipboardList } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0, pending_credits: 0 });
  const [orders, setOrders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active tracking order popup state
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const resMe = await api.get('/auth/me');
      setProfile(resMe.data.user);
      setWallet(resMe.data.wallet);

      const resOrders = await api.get('/orders');
      setOrders(resOrders.data.orders);

      const resCampaigns = await api.get('/campaigns');
      setCampaigns(resCampaigns.data.campaigns);

      const resNotifications = await api.get('/notifications');
      setNotifications(resNotifications.data.notifications);

      const resAnn = await api.get('/notifications/announcements');
      setAnnouncements(resAnn.data.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <span className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const activeOrdersCount = orders.filter(o => !['DELIVERED', 'DELIVERY_FAILED', 'CANCELLED', 'REFUNDED'].includes(o.status)).length;
  const completedOrdersCount = orders.filter(o => o.status === 'DELIVERED').length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_40%)]"></div>
        <div className="relative space-y-1">
          <span className="px-2.5 py-1 bg-violet-600/30 text-violet-400 border border-violet-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider">Customer Portal</span>
          <h1 className="text-2xl md:text-3xl font-black">Welcome Back, {profile?.name}</h1>
          <p className="text-xs text-slate-400">Review your package deliveries, social advertising setups, and prepaid coin balances</p>
        </div>
        <div className="relative flex gap-3">
          <Link to="/shop" className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 font-bold rounded-xl text-xs transition">BUY MARKETPLACE</Link>
          <Link to="/campaigns" className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold border border-slate-700 rounded-xl text-xs transition">CREATE AD</Link>
        </div>
      </div>

      {/* Announcements Broadcast Card */}
      {announcements.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-2xl flex items-start gap-3">
          <Volume2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Announcement: {announcements[0].title}</span>
            <p className="text-xs leading-relaxed">{announcements[0].message}</p>
          </div>
        </div>
      )}

      {/* Aggregate Balance & Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl shrink-0"><Wallet className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Wallet balance</span>
            <div className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{wallet.balance.toLocaleString()} COINS</div>
            <span className="text-[10px] text-slate-400 font-medium">Pending credits: {wallet.pending_credits.toLocaleString()} COINS</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl shrink-0"><Truck className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Active Deliveries</span>
            <div className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{activeOrdersCount} packages</div>
            <span className="text-[10px] text-slate-400 font-medium">Delivered: {completedOrdersCount} packages</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl shrink-0"><Megaphone className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Active campaigns</span>
            <div className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{activeCampaignsCount} campaigns</div>
            <span className="text-[10px] text-slate-400 font-medium">Total: {campaigns.length} campaigns</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-500/10 text-slate-500 rounded-2xl shrink-0"><Clock className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Registration date</span>
            <div className="text-sm font-black text-slate-800 dark:text-white mt-1">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Status: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Orders & Campaigns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Orders Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-500" /> Recent Forwarding Packages
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs text-slate-400">
                No package orders yet. Check the <Link to="/shop" className="text-violet-500 font-bold hover:underline">Marketplace</Link>.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col justify-between gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{order.order_number}</strong>
                        <span className="text-slate-400 font-mono text-[10px] block mt-0.5">Track: {order.tracking_number}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : order.status === 'CANCELLED' || order.status === 'REFUNDED'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-500" />
                        <span>To: {order.delivery_address.recipient_name} ({order.delivery_address.country})</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveTrackingOrder(order)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> TRACK SHIPMENT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaigns Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-violet-500" /> Recent Advertising Campaigns
            </h3>

            {campaigns.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs text-slate-400">
                No campaigns submitted yet. Launch your first ad placement.
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((cam) => (
                  <div key={cam._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col gap-4 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{cam.name}</strong>
                        <span className="text-slate-400 block text-[10px] mt-0.5">Platform: {cam.platform?.name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        cam.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : cam.status === 'REJECTED' || cam.status === 'CANCELLED'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {cam.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-t border-slate-200/50 dark:border-slate-800/50 pt-2 text-slate-400">
                      <span>Budget: {cam.platform_budget_coins.toLocaleString()} COINS</span>
                      <span>Agency Fee: {cam.management_fee_coins.toLocaleString()} COINS</span>
                      <span>Total Paid: {cam.total_cost_coins.toLocaleString()} COINS</span>
                    </div>

                    {cam.posting_url && (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold">Campaign is active on the social network. Click link:</span>
                        <a href={cam.posting_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center gap-1">
                          OPEN POST LINK <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: In-App Notifications */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-violet-500" /> Notifications inbox
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Inbox is empty</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.read && markNotificationRead(n._id)}
                    className={`p-3 border rounded-2xl text-xs space-y-1 transition cursor-pointer ${
                      n.read
                        ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800/50 opacity-60'
                        : 'bg-violet-500/5 border-violet-500/20 text-violet-600 dark:text-violet-400 font-semibold'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span>{n.title}</span>
                      {!n.read && <span className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400 rounded-full"></span>}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-normal">{n.message}</p>
                    <span className="text-[8px] text-slate-400 block font-normal mt-1">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Public/Active Shipment tracking details timeline MODAL */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-lg relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveTrackingOrder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>
            
            <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">Logistics dispatch history</span>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Tracking ID: {activeTrackingOrder.tracking_number}</h3>
              <p className="text-xs text-slate-400">Order: {activeTrackingOrder.order_number} to {activeTrackingOrder.delivery_address.recipient_name} ({activeTrackingOrder.delivery_address.country})</p>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-violet-500/20 pl-6 ml-3 space-y-6 text-xs">
              {activeTrackingOrder.tracking_events.length === 0 ? (
                <div className="text-slate-400 italic">No tracking updates recorded.</div>
              ) : (
                activeTrackingOrder.tracking_events.map((evt, idx) => (
                  <div key={evt._id || idx} className="relative">
                    {/* Node circle */}
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-violet-600 border-4 border-slate-50 dark:border-slate-900 animate-ping"></span>
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-violet-600 border-4 border-slate-50 dark:border-slate-900"></span>
                    
                    <div className="space-y-1 bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200 uppercase text-[10px]">{evt.status.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] text-slate-400">{new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-normal">{evt.message}</p>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-1">Location: {evt.location}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
