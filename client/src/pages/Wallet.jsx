import React, { useState, useEffect } from 'react';
import { Coins, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, AlertCircle, FileText, CheckCircle, RefreshCw, Landmark, Camera } from 'lucide-react';
import api from '../services/api';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [pendingCredits, setPendingCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);
  
  // Bank details settings
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    instructions: ''
  });

  // Deposit Form State
  const [amountNaira, setAmountNaira] = useState('');
  const [senderName, setSenderName] = useState('');
  const [bankUsed, setBankUsed] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [proofFile, setProofFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchWalletData = async () => {
    try {
      const resBal = await api.get('/wallet/balance');
      setBalance(resBal.data.balance);
      setPendingCredits(resBal.data.pending_credits);

      const resBank = await api.get('/wallet/bank-details');
      setBankDetails(resBank.data.bankDetails);

      const resTxns = await api.get('/wallet/transactions');
      setTransactions(resTxns.data.transactions);

      const resDeps = await api.get('/deposits');
      setDeposits(resDeps.data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!amountNaira || !senderName || !bankUsed || !transferRef || !transferDate) {
      setError('Please fill in all required deposit fields');
      return;
    }

    setFormLoading(true);
    setError('');
    setSuccess('');

    // Create form data to allow screenshot uploading
    const formData = new FormData();
    formData.append('amount_naira', amountNaira);
    formData.append('sender_name', senderName);
    formData.append('bank_used', bankUsed);
    formData.append('transfer_reference', transferRef);
    formData.append('transfer_date', transferDate);
    if (proofFile) {
      formData.append('proof_image', proofFile);
    }

    try {
      await api.post('/deposits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Deposit request submitted successfully for review!');
      setAmountNaira('');
      setSenderName('');
      setBankUsed('');
      setTransferRef('');
      setTransferDate('');
      setProofFile(null);
      
      // Reload lists
      fetchWalletData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit deposit confirmation');
    } finally {
      setFormLoading(false);
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
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Prepaid Wallet</h1>
        <p className="text-xs text-slate-500">Fund your balance manually and view your transactions history ledger</p>
      </div>

      {/* Aggregate balance readouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-md flex items-center justify-between border border-emerald-400/20">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-100">Available Balance</span>
            <div className="text-3xl font-black">{balance.toLocaleString()} COINS</div>
            <p className="text-[10px] text-emerald-100/80">Authoritative balance ready to use (1 COIN = ₦1)</p>
          </div>
          <Coins className="w-12 h-12 text-emerald-200/50 shrink-0" />
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md flex items-center justify-between border border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pending review credits</span>
            <div className="text-3xl font-black text-slate-200">{pendingCredits.toLocaleString()} COINS</div>
            <p className="text-[10px] text-slate-400">Credits awaiting manual bank transfer approval</p>
          </div>
          <WalletIcon className="w-12 h-12 text-slate-700/50 shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Fund Wallet Deposit Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Display designated bank account details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4.5 h-4.5 text-violet-500" /> Bank Transfer Details
            </h3>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Bank Name</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{bankDetails.bankName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Account Number</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold font-mono text-sm">{bankDetails.accountNumber}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Account Name</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{bankDetails.accountName}</strong>
              </div>
            </div>

            <div className="p-3.5 bg-violet-500/5 dark:bg-violet-500/10 rounded-2xl border border-violet-500/10 text-[10px] text-slate-500 leading-relaxed">
              <span className="font-bold text-violet-500 flex items-center gap-1 mb-1">Instructions:</span>
              {bankDetails.instructions}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Confirm Payment Transfer</h3>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-xl flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0" /> <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Amount to Deposit (₦) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₦</span>
                  <input
                    type="number"
                    value={amountNaira}
                    onChange={(e) => setAmountNaira(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-7 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    required
                  />
                </div>
                {amountNaira && (
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1">
                    Equates to: {parseFloat(amountNaira || 0).toLocaleString()} COINS
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Sender Name *</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Sender Bank Used *</label>
                <input
                  type="text"
                  value={bankUsed}
                  onChange={(e) => setBankUsed(e.target.value)}
                  placeholder="e.g. GTBank"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Transfer Reference ID *</label>
                <input
                  type="text"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  placeholder="Paste reference / transaction code"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none text-slate-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Upload Screenshot Proof</label>
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950 text-center cursor-pointer hover:bg-slate-100 transition relative">
                  <input
                    type="file"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-[10px] text-slate-400 block">
                    {proofFile ? proofFile.name : 'Select JPG/PNG (Max 10MB)'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-violet-500/25 transition disabled:opacity-50 flex items-center justify-center gap-1 text-xs uppercase"
              >
                {formLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Submit Deposit'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Columns: Ledger Transactions & Reviewable deposit requests history */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deposits requests list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Manual Deposit Submissions</h3>
            {deposits.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No deposit requests submitted yet.</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {deposits.map((dep) => (
                  <div key={dep._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">₦{dep.amount_naira.toLocaleString()} ({dep.amount_coins.toLocaleString()} COINS)</strong>
                      <div className="text-[10px] text-slate-400 mt-0.5">Ref: {dep.transfer_reference}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">Bank: {dep.bank_used} | Date: {new Date(dep.transfer_date).toLocaleDateString()}</div>
                      {dep.rejection_reason && (
                        <p className="text-[9px] text-red-500 mt-1">Rejection Reason: {dep.rejection_reason}</p>
                      )}
                    </div>
                    
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wide border ${
                      dep.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : dep.status === 'REJECTED'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {dep.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ledger transactions list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Account Transaction Ledger</h3>
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No ledger transaction records found.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {transactions.map((txn) => {
                  const isCredit = ['DEPOSIT', 'REFUND', 'ADMIN_CREDIT'].includes(txn.type);
                  return (
                    <div key={txn._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex justify-between items-center gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200 font-bold block">{txn.description}</strong>
                          <span className="text-[10px] text-slate-400">{txn.txn_id} | Reference: {txn.reference}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(txn.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`font-black text-sm block ${isCredit ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isCredit ? '+' : '-'}{txn.amount.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400">Balance: {txn.balance_after.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
