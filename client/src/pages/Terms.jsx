import React from 'react';
import { ShieldCheck, FileText, Lock, Scale, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center md:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <div className="p-3 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-2xl">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
            <p className="text-xs text-slate-500">Effective Date: January 1, 2026 | Last Updated: August 2026</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">1</span>
            Acceptance of Terms
          </h2>
          <p>
            By creating an account, depositing funds, purchasing products, or submitting advertising campaigns on ADSGLOBAL, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must refrain from accessing or using our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">2</span>
            Prepaid Wallet & COINS Currency System
          </h2>
          <p>
            ADSGLOBAL operates a prepaid wallet system measured in <strong>COINS</strong>. 
            All marketplace purchases, delivery fees, and advertising placement submissions require an active wallet balance funded prior to transaction execution.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Deposits made via bank transfer or online gateway are credited upon admin verification.</li>
            <li>Wallet funds are non-transferable between separate user accounts.</li>
            <li>In the event of campaign rejection or order cancellation, refunded amounts return as COINS balance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">3</span>
            Marketplace Orders & Cross-Border Delivery
          </h2>
          <p>
            ADSGLOBAL facilitates international gift and item deliveries across Nigeria, United States, United Kingdom, Canada, Finland, and global destinations. 
            Delivery fees are dynamically calculated based on recipient country, product weight (kg), packaging specifications, and handling tier.
          </p>
          <p className="text-xs text-slate-500">
            Estimated delivery windows are provided in good faith. Customs processing delays in destination countries are beyond our direct control.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">4</span>
            Ad Placements & Moderation Review
          </h2>
          <p>
            Advertisers submitting ad creatives for WhatsApp, Zangi, TikTok, Facebook, Snapchat, or general social networks must adhere strictly to local laws and platform safety guidelines.
          </p>
          <p>
            All submitted campaigns undergo mandatory manual moderation review before live publishing. Campaigns promoting illegal fraud, malware, or violence will be rejected and accounts suspended.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">5</span>
            Contact & Legal Inquiries
          </h2>
          <p>
            For legal inquiries, dispute resolution, or compliance notices, please contact our legal desk at:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
            Email: janiellaton7@gmail.com
          </div>
        </section>

      </div>
    </div>
  );
};

export default Terms;
