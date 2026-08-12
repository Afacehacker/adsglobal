import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, ShoppingBag, Plus, Minus, Home, PlusCircle, AlertCircle, Coins, CreditCard, ChevronRight, Check } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, selectedAddress, setSelectedAddress, deliveryMethod, setDeliveryMethod } = useCartStore();
  const navigate = useNavigate();

  // Saved Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient_name: '',
    recipient_phone: '',
    recipient_email: '',
    country: 'United Kingdom',
    state: '',
    city: '',
    zip: '',
    street_address: '',
    apartment: '',
    landmark: '',
    instructions: '',
    isDefault: false
  });

  // Billing & Estimate State
  const [walletBalance, setWalletBalance] = useState(0);
  const [estimate, setEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.addresses);
      // Select default address if none selected
      if (res.data.addresses.length > 0 && !selectedAddress) {
        const def = res.data.addresses.find(a => a.isDefault) || res.data.addresses[0];
        setSelectedAddress(def);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await api.get('/auth/me');
      setWalletBalance(res.data.wallet.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateEstimate = async () => {
    if (cart.length === 0 || !selectedAddress) {
      setEstimate(null);
      return;
    }
    setEstimateLoading(true);
    setError('');

    try {
      const res = await api.post('/products/estimate', {
        items: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
        country: selectedAddress.country,
        state: selectedAddress.state,
        delivery_method: deliveryMethod
      });
      setEstimate(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to calculate delivery fee');
    } finally {
      setEstimateLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchWallet();
  }, []);

  useEffect(() => {
    calculateEstimate();
  }, [cart, selectedAddress, deliveryMethod]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', newAddress);
      setAddresses([...addresses, res.data.address]);
      setSelectedAddress(res.data.address);
      setShowAddressForm(false);
      setNewAddress({
        recipient_name: '',
        recipient_phone: '',
        recipient_email: '',
        country: 'United Kingdom',
        state: '',
        city: '',
        zip: '',
        street_address: '',
        apartment: '',
        landmark: '',
        instructions: '',
        isDefault: false
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save address');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (!confirmDetails) {
      setError('Please check the confirmation box');
      return;
    }

    setCheckoutLoading(true);
    setError('');

    try {
      await api.post('/orders', {
        items: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
        delivery_address: selectedAddress,
        delivery_method: deliveryMethod,
        notes: 'Checkout order'
      });
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">You have not added any product packages to forward yet. Browse our marketplace catalog.</p>
        <Link to="/shop" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition inline-block">
          BROWSE MARKETPLACE
        </Link>
      </div>
    );
  }

  const shortfall = estimate ? Math.max(0, estimate.total_coins - walletBalance) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Shopping Cart & Checkout</h1>
        <p className="text-xs text-slate-500">Configure recipient locations and confirm payment details in COINS</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Cart Items & Addresses */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cart Items Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Marketplace Items</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map((item) => (
                <div key={item.product._id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      <img src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.product.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{item.product.weight_kg} kg | {item.product.price_coins.toLocaleString()} COINS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 px-2 py-1">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1 text-slate-500 hover:text-slate-800"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1 text-slate-500 hover:text-slate-800" disabled={item.quantity >= item.product.stock}><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    {/* Trash */}
                    <button onClick={() => removeFromCart(item.product._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Shipping Address Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Home className="w-4 h-4 text-violet-500" /> Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-violet-500 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" /> Add Address
              </button>
            </div>

            {/* Inline Address Creation Form */}
            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Recipient Name *</label>
                    <input
                      type="text"
                      value={newAddress.recipient_name}
                      onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                      placeholder="e.g. John Doe Jr"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Recipient Phone *</label>
                    <input
                      type="text"
                      value={newAddress.recipient_phone}
                      onChange={(e) => setNewAddress({ ...newAddress, recipient_phone: e.target.value })}
                      placeholder="+44..."
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Country *</label>
                    <select
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">State / Region *</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      placeholder="e.g. London"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">City *</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="e.g. London"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Street Address *</label>
                  <input
                    type="text"
                    value={newAddress.street_address}
                    placeholder="10 Downing St"
                    onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-xl font-bold text-xs">Save Address</button>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs">Cancel</button>
                </div>
              </form>
            )}

            {/* Address Selection List */}
            {addresses.length === 0 ? (
              <p className="text-xs text-slate-400">No saved addresses found. Add a recipient address to calculate delivery fee.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`border p-4 rounded-2xl cursor-pointer transition relative flex flex-col justify-between ${
                      selectedAddress?._id === addr._id
                        ? 'border-violet-500 bg-violet-500/5'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{addr.recipient_name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {addr.street_address}, {addr.city}, {addr.state}, {addr.country}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">{addr.recipient_phone}</p>
                    </div>
                    {selectedAddress?._id === addr._id && (
                      <span className="absolute top-2 right-2 p-1 bg-violet-500 text-white rounded-full"><Check className="w-3 h-3" /></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Pricing Summary Panel */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Payment Summary</h3>

            {/* Delivery Method Selection */}
            {selectedAddress && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Delivery Speed</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryMethod('STANDARD')}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      deliveryMethod === 'STANDARD'
                        ? 'bg-slate-900 text-white dark:bg-violet-600'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-600'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('EXPRESS')}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      deliveryMethod === 'EXPRESS'
                        ? 'bg-slate-900 text-white dark:bg-violet-600'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-600'
                    }`}
                  >
                    Express Priority
                  </button>
                </div>
              </div>
            )}

            {/* Pricing breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs">
              {estimateLoading ? (
                <div className="text-center py-4 text-slate-400">Recalculating totals...</div>
              ) : estimate ? (
                <>
                  <div className="flex justify-between text-slate-500">
                    <span>Products Subtotal</span>
                    <span>{estimate.subtotal_coins.toLocaleString()} COINS</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Logistics Delivery fee</span>
                    <span>{estimate.delivery_fee_coins.toLocaleString()} COINS</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Handling & Packaging</span>
                    <span>{estimate.handling_fee_coins.toLocaleString()} COINS</span>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-black text-sm text-slate-800 dark:text-white">
                    <span> Authoritative Total</span>
                    <span className="text-emerald-500">{estimate.total_coins.toLocaleString()} COINS</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-slate-400 italic">Select address to calculate delivery fee.</div>
              )}
            </div>

            {/* User Wallet Balance Readout */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium">Your Wallet Balance</span>
                <p className="font-bold text-slate-800 dark:text-white">{walletBalance.toLocaleString()} COINS</p>
              </div>
              <Coins className="w-5 h-5 text-emerald-500" />
            </div>

            {/* Balance check guard */}
            {estimate && shortfall > 0 ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-2xl space-y-3">
                <div className="font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> INSUFFICIENT BALANCE</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]"><span>Required:</span> <span>{estimate.total_coins.toLocaleString()} COINS</span></div>
                  <div className="flex justify-between text-[10px]"><span>Available:</span> <span>{walletBalance.toLocaleString()} COINS</span></div>
                  <div className="flex justify-between text-[10px] font-bold"><span>Shortfall:</span> <span>{shortfall.toLocaleString()} COINS</span></div>
                </div>
                <Link to="/wallet" className="w-full py-2 bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1">
                  DEPOSIT COINS TO FUND
                </Link>
              </div>
            ) : (
              estimate && (
                <div className="space-y-4">
                  {/* Compliance check box */}
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmDetails}
                      onChange={(e) => setConfirmDetails(e.target.checked)}
                      className="mt-1 rounded text-violet-500 focus:ring-violet-500 bg-slate-950 border-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      I confirm that the recipient delivery address is accurate and the items do not conflict with local regulations.
                    </span>
                  </label>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !confirmDetails}
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-violet-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                  >
                    {checkoutLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> PLACE ORDER & DISPATCH
                      </>
                    )}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
