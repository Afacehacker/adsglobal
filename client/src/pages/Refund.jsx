import React from 'react';
import { Coins, RefreshCw, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Refund = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center md:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <div className="p-3 bg-amber-600/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Refund Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: January 1, 2026 | Last Updated: August 2026</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">1</span>
            Wallet Balance & COINS Refunds
          </h2>
          <p>
            ADSGLOBAL utilizes a prepaid <strong>COINS</strong> system. Deposits credited to your prepaid wallet balance are available for any marketplace order or ad submission.
          </p>
          <p className="text-xs text-slate-500">
            Unused wallet balances remain active indefinitely in your account and do not expire.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">2</span>
            Ad Campaign Rejections & Refunds
          </h2>
          <p>
            If an ad campaign submission is rejected by our moderation team during safety review:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>100% of deducted COINS</strong> are immediately credited back to your prepaid wallet.</li>
            <li>You will receive a notification detailing the reason for rejection and can modify your creative content for re-submission.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">3</span>
            Marketplace Order Cancellations & Damaged Items
          </h2>
          <p>
            For product delivery orders:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Before Dispatch:</strong> Orders cancelled before dispatch are eligible for full COINS wallet refund.</li>
            <li><strong>Damaged / Incorrect Items:</strong> If an item arrives damaged or incomplete, open a support ticket within 48 hours of delivery. Upon inspection, replacement items or wallet refunds will be processed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">4</span>
            Submitting a Refund Request
          </h2>
          <p>
            To submit a refund or dispute claim, navigate to your <Link to="/support" className="text-violet-600 font-bold hover:underline">Support Desk</Link> or email us:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
            Email: janiellaton7@gmail.com
          </div>
        </section>

      </div>
    </div>
  );
};

export default Refund;
