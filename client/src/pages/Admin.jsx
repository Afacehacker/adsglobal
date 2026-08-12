import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CreditCard, Ship, Megaphone, Settings, ArrowUpRight, ArrowDownLeft, ShieldAlert, CheckCircle, AlertCircle, Eye, ShieldCheck, X } from 'lucide-react';
import api from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Master Data
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [settings, setSettings] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected Detail views (for modals)
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Administrative adjustment states
  const [adjustType, setAdjustType] = useState('ADMIN_CREDIT');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  // Deposit reject reason state
  const [rejectReason, setRejectReason] = useState('');

  // Order status update state
  const [orderStatus, setOrderStatus] = useState('PAID');
  const [courierProvider, setCourierProvider] = useState('');
  const [courierRef, setCourierRef] = useState('');
  const [courierUrl, setCourierUrl] = useState('');
  const [trackingMsg, setTrackingMsg] = useState('');

  // Campaign execution url & metrics state
  const [postingUrl, setPostingUrl] = useState('');
  const [executionNotes, setExecutionNotes] = useState('');
  const [viewsCount, setViewsCount] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [campaignStatus, setCampaignStatus] = useState('SUBMITTED');

  // System settings states
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const resAna = await api.get('/admin/analytics');
      setAnalytics(resAna.data.summary);

      const resUsers = await api.get('/admin/users');
      setUsers(resUsers.data.users);

      const resDeps = await api.get('/admin/deposits');
      setDeposits(resDeps.data.deposits);

      const resOrders = await api.get('/admin/orders');
      setOrders(resOrders.data.orders);

      const resCams = await api.get('/admin/campaigns');
      setCampaigns(resCams.data.campaigns);

      const resSet = await api.get('/admin/settings');
      setSettings(resSet.data.settings);

      // Populate settings fields
      resSet.data.settings.forEach(s => {
        if (s.key === 'bank_name') setBankName(s.value);
        if (s.key === 'account_name') setAccountName(s.value);
        if (s.key === 'account_number') setAccountNumber(s.value);
        if (s.key === 'deposit_instructions') setInstructions(s.value);
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load administrative modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const handleUserStatusToggle = async (userId, currentStatus) => {
    setActionLoading(true);
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setSuccess(`User status changed successfully to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      setError('Failed to toggle user status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWalletAdjust = async (e) => {
    e.preventDefault();
    if (!adjustAmount || adjustAmount <= 0) return;
    setActionLoading(true);
    try {
      await api.post(`/admin/users/${selectedUser.user._id}/adjust-wallet`, {
        type: adjustType,
        amount: parseFloat(adjustAmount),
        description: adjustReason || 'Admin adjustment'
      });
      setSuccess('User balance adjusted successfully');
      setAdjustAmount('');
      setAdjustReason('');
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to adjust wallet');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDepositReview = async (depId, approvalStatus) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/deposits/${depId}/review`, {
        status: approvalStatus,
        rejection_reason: rejectReason
      });
      setSuccess(`Deposit request reviewed: ${approvalStatus}`);
      setRejectReason('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to review deposit');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOrderUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/admin/orders/${selectedOrder._id}/status`, {
        status: orderStatus,
        provider: courierProvider,
        reference: courierRef,
        tracking_url: courierUrl,
        message: trackingMsg
      });
      setSuccess('Shipment details updated successfully');
      setTrackingMsg('');
      setSelectedOrder(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCampaignReview = async (camId, status) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/campaigns/${camId}/review`, { status, moderation_notes: 'Compliance reviewed.' });
      setSuccess(`Campaign updated to ${status}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to review campaign');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCampaignExecution = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/admin/campaigns/${selectedCampaign._id}/execution`, {
        posting_url: postingUrl,
        external_campaign_id: selectedCampaign.external_campaign_id || ('EXT-AD-' + Date.now()),
        execution_notes: executionNotes,
        impressions_views: Number(viewsCount) || 0,
        clicks: Number(clicksCount) || 0,
        status: campaignStatus
      });
      setSuccess('Campaign metrics & status updated successfully');
      setPostingUrl('');
      setExecutionNotes('');
      setSelectedCampaign(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update campaign metrics');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/admin/settings', { key: 'bank_name', value: bankName });
      await api.post('/admin/settings', { key: 'account_name', value: accountName });
      await api.post('/admin/settings', { key: 'account_number', value: accountNumber });
      await api.post('/admin/settings', { key: 'deposit_instructions', value: instructions });
      setSuccess('Designated bank details updated successfully');
    } catch (err) {
      setError('Failed to update configurations');
    } finally {
      setActionLoading(false);
    }
  };

  const viewUserProfile = async (userId) => {
    try {
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            Operations SaaS Center
          </h1>
          <p className="text-xs text-slate-500">Corporate administrative control center panel</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-xl flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Analytics Summary
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Users Management
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition relative ${
              activeTab === 'deposits' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Bank Deposit Reviews
            {deposits.filter(d => d.status === 'PENDING').length > 0 && (
              <span className="absolute right-3 top-3.5 bg-red-500 text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                {deposits.filter(d => d.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'orders' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Ship className="w-4 h-4" /> Shipments Forwarding
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'campaigns' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4" /> Campaign Compliance
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'settings' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" /> System Settings
          </button>
        </div>

        {/* Tab Contents Panels */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Prepaid Sum</span>
                  <div className="text-xl font-black text-slate-850 dark:text-white mt-1">{analytics.totalWalletBalance?.toLocaleString()} COINS</div>
                  <span className="text-[9px] text-slate-400">Total floating coins across wallets</span>
                </div>
                <div className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Logistics revenue</span>
                  <div className="text-xl font-black text-slate-850 dark:text-white mt-1">{(analytics.productRevenue + analytics.deliveryRevenue)?.toLocaleString()} COINS</div>
                  <span className="text-[9px] text-slate-400">Items subtotal + Surcharges + base</span>
                </div>
                <div className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Campaigns Revenue</span>
                  <div className="text-xl font-black text-slate-850 dark:text-white mt-1">{analytics.campaignRevenue?.toLocaleString()} COINS</div>
                  <span className="text-[9px] text-slate-400">Management + Budget placements</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Authoritative Net Profit</span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{analytics.netRevenue?.toLocaleString()} COINS</div>
                </div>
                <div className="text-right text-[10px] text-slate-400 space-y-0.5">
                  <div>Approved Deposits: {analytics.totalDepositsRevenue?.toLocaleString()} COINS</div>
                  <div>Total Refunds Deducted: {analytics.totalRefunds?.toLocaleString()} COINS</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGER */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Platform Registered Customers</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {users.map(u => (
                      <tr key={u._id} className="py-3">
                        <td className="py-3 font-semibold">{u.name}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3">{u.country}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                            u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>{u.status}</span>
                        </td>
                        <td className="py-3 text-right flex justify-end gap-2">
                          <button
                            onClick={() => viewUserProfile(u._id)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 rounded-lg font-bold text-[10px]"
                          >
                            Adjust Balance
                          </button>
                          <button
                            onClick={() => handleUserStatusToggle(u._id, u.status)}
                            disabled={actionLoading}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                              u.status === 'ACTIVE' ? 'bg-red-500/10 text-red-500 hover:bg-red-500' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DEPOSITS REVIEWER */}
          {activeTab === 'deposits' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pending Deposit Requests</h3>

              {deposits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No deposit requests submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {deposits.map(dep => (
                    <div key={dep._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col gap-4">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <strong className="text-sm font-black text-slate-800 dark:text-slate-100">₦{dep.amount_naira.toLocaleString()} ({dep.amount_coins.toLocaleString()} COINS)</strong>
                          <div className="text-[10px] text-slate-400 mt-1">Sender Name: {dep.sender_name} | Reference ID: {dep.transfer_reference}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">User: {dep.user?.name} ({dep.user?.email})</div>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border ${
                          dep.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : dep.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>{dep.status}</span>
                      </div>

                      {/* Display Uploaded Proof screenshot if available */}
                      {dep.proof_image && (
                        <div className="max-w-[200px] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                          <span className="text-[9px] text-slate-400 font-bold block p-1.5 border-b uppercase">Screenshot Proof:</span>
                          <img src={dep.proof_image} alt="Proof" className="w-full h-auto" />
                        </div>
                      )}

                      {dep.status === 'PENDING' && (
                        <div className="flex gap-2 items-center border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                          <input
                            type="text"
                            placeholder="Rejection reason details..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="flex-grow px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-[10px] focus:outline-none"
                          />
                          <button
                            onClick={() => handleDepositReview(dep._id, 'APPROVED')}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDepositReview(dep._id, 'REJECTED')}
                            className="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHIPMENTS MODERATOR */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Package Deliveries</h3>

              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{o.order_number}</strong>
                        <span className="text-[10px] text-slate-400 block mt-0.5">User: {o.user?.name} | Destination: {o.delivery_address.country}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${
                        o.status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : o.status === 'CANCELLED' || o.status === 'REFUNDED'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>{o.status}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                      <span>Total Value: {o.total_coins.toLocaleString()} COINS</span>
                      <span>Weight: {o.items.reduce((sum, i) => sum + (i.weight_kg * i.quantity), 0)} kg</span>
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setOrderStatus(o.status);
                        }}
                        className="px-2.5 py-1 bg-violet-600 text-white font-bold rounded-lg text-[9px]"
                      >
                        Update Courier Logs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CAMPAIGNS COMPLIANCE */}
          {activeTab === 'campaigns' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Social Placements Audit</h3>

              <div className="space-y-4">
                {campaigns.map(cam => (
                  <div key={cam._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col gap-4 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{cam.name} ({cam.campaign_number})</strong>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Platform: {cam.platform?.name} | Brand: {cam.business_name}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${
                        cam.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>{cam.status}</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-xl space-y-3">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold">Copywriting text copy:</span>
                        <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-300 font-normal mt-0.5">{cam.creative?.copy}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[9px] text-slate-400">
                        <div>Headline: <strong className="text-slate-500">{cam.creative?.headline}</strong></div>
                        <div>Landing: <a href={cam.creative?.destination_url} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">{cam.creative?.destination_url}</a></div>
                      </div>

                      {/* UPLOADED PICTURES & VIDEOS FOR SUPERADMIN REVIEW */}
                      {cam.media_files && cam.media_files.length > 0 && (
                        <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
                          <span className="text-[9px] text-violet-500 uppercase font-bold">Uploaded Ad Creatives ({cam.media_files.length} files):</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {cam.media_files.map((file, fIdx) => (
                              <div key={fIdx} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
                                {file.file_type === 'video' ? (
                                  <video src={file.url} controls className="w-full h-full object-cover" />
                                ) : (
                                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    <img src={file.url} alt={file.original_name || 'Creative'} className="w-full h-full object-cover hover:scale-105 transition" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 text-[10px] pt-1 text-slate-500 font-mono">
                        <span>👁 Views: <strong className="text-emerald-500 font-bold">{(cam.impressions_views || 0).toLocaleString()}</strong></span>
                        <span>🖱 Clicks: <strong className="text-violet-500 font-bold">{(cam.clicks || 0).toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                      {cam.status === 'SUBMITTED' && (
                        <>
                          <button
                            onClick={() => handleCampaignReview(cam._id, 'APPROVED')}
                            className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-lg text-[9px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleCampaignReview(cam._id, 'REJECTED')}
                            className="px-2.5 py-1 bg-red-500 text-white font-bold rounded-lg text-[9px]"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedCampaign(cam);
                          setPostingUrl(cam.posting_url || '');
                          setExecutionNotes(cam.execution_notes || '');
                          setViewsCount(cam.impressions_views || 0);
                          setClicksCount(cam.clicks || 0);
                          setCampaignStatus(cam.status || 'SUBMITTED');
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold rounded-lg text-[9px]"
                      >
                        Edit Status & Metrics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM SETTINGS EDITOR */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Designated Bank Accounts</h3>
              
              <form onSubmit={handleSettingsSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Account Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Deposit Instructions</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none h-20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl"
                >
                  {actionLoading ? 'Saving...' : 'Update Configs'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* USER WALLET OVERRIDE MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-lg relative space-y-6">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-bold">✕</button>
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Adjust Wallet: {selectedUser.user.name}</h3>
              <p className="text-[10px] text-slate-400">Current Balance: {selectedUser.wallet?.balance?.toLocaleString()} COINS</p>
            </div>
            
            <form onSubmit={handleWalletAdjust} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Adjustment Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none text-slate-500"
                  >
                    <option value="ADMIN_CREDIT">Credit Coins</option>
                    <option value="ADMIN_DEBIT">Debit Coins</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Amount (COINS) *</label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Reason / Reference *</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Manual deposit compensation"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl shadow-md">
                EXECUTE LEDGER ENTRY
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COURIER LOGS MODIFIER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-lg relative space-y-6">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-bold">✕</button>
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Courier Logs: {selectedOrder.order_number}</h3>
              <p className="text-[10px] text-slate-400">Recipient: {selectedOrder.delivery_address.recipient_name} ({selectedOrder.delivery_address.country})</p>
            </div>
            
            <form onSubmit={handleOrderUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Logistics Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none text-slate-500"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="PACKED">PACKED</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="IN_TRANSIT">IN TRANSIT</option>
                    <option value="CUSTOMS">CUSTOMS AUDIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Courier Provider</label>
                  <input
                    type="text"
                    value={courierProvider}
                    onChange={(e) => setCourierProvider(e.target.value)}
                    placeholder="e.g. DHL Express"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">External Tracking Link URL</label>
                  <input
                    type="url"
                    value={courierUrl}
                    onChange={(e) => setCourierUrl(e.target.value)}
                    placeholder="https://dhl.com/track..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Public tracking message details</label>
                <input
                  type="text"
                  value={trackingMsg}
                  onChange={(e) => setTrackingMsg(e.target.value)}
                  placeholder="e.g. Parcel has arrived at Sorting Hub in London"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl shadow-md">
                UPDATE TIMELINE LOG
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CAMPAIGN METRICS & EXECUTION EDITOR MODAL */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-lg relative space-y-6">
            <button onClick={() => setSelectedCampaign(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-bold">✕</button>
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Edit Campaign: {selectedCampaign.campaign_number}</h3>
              <p className="text-[10px] text-slate-400">Platform: {selectedCampaign.platform?.name} | Goal: {selectedCampaign.objective}</p>
            </div>
            
            <form onSubmit={handleCampaignExecution} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Campaign Status *</label>
                <select
                  value={campaignStatus}
                  onChange={(e) => setCampaignStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none text-slate-700 dark:text-slate-300 font-bold"
                >
                  <option value="SUBMITTED">SUBMITTED (Pending Review)</option>
                  <option value="ACTIVE">ACTIVE (Live / Successful)</option>
                  <option value="COMPLETED">COMPLETED (Finished)</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="NEEDS_CHANGES">NEEDS CHANGES</option>
                  <option value="PAUSED">PAUSED</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Views Generated 👁</label>
                  <input
                    type="number"
                    min={0}
                    value={viewsCount}
                    onChange={(e) => setViewsCount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none font-bold text-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Clicks Generated 🖱</label>
                  <input
                    type="number"
                    min={0}
                    value={clicksCount}
                    onChange={(e) => setClicksCount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none font-bold text-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Live Post URL Link</label>
                <input
                  type="url"
                  value={postingUrl}
                  onChange={(e) => setPostingUrl(e.target.value)}
                  placeholder="https://tiktok.com/ad-post-link"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Internal Execution & Moderation Notes</label>
                <textarea
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  placeholder="Paste external campaign ID, notes, or execution comments..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none h-16"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl shadow-md uppercase tracking-wider">
                SAVE METRICS & STATUS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
