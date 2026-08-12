import React from 'react';
import { Lock, Shield, Eye, Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center md:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <div className="p-3 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: January 1, 2026 | Last Updated: August 2026</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">1</span>
            Information We Collect
          </h2>
          <p>
            At ADSGLOBAL, we prioritize the protection of your personal information. When you create an account, register for delivery, or launch advertising campaigns, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Account Data:</strong> Name, email address, phone number, and account credentials.</li>
            <li><strong>Delivery Data:</strong> Recipient delivery addresses, contact numbers, and parcel weight preferences.</li>
            <li><strong>Transaction Data:</strong> Deposit proofs, wallet credit histories, and order invoices.</li>
            <li><strong>Ad Creatives:</strong> Headline copies, destination links, images, and video media files uploaded for ad placement.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">2</span>
            How We Use Your Information
          </h2>
          <p>
            Your information is strictly utilized for core operational purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Processing international gift purchases and fulfillment delivery dispatch.</li>
            <li>Moderating and publishing ad placements across requested traffic networks.</li>
            <li>Maintaining wallet balance security and preventing double-spend fraud.</li>
            <li>Sending critical transaction updates and support ticket responses.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">3</span>
            Data Protection & Security
          </h2>
          <p>
            We deploy 256-bit SSL encryption across all web interactions, secure database encryption, and strict role-based access control. We never sell, rent, or trade user personal data to unauthorized third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">4</span>
            Data Privacy Officer Contact
          </h2>
          <p>
            If you have questions regarding data privacy or wish to request account data deletion, please contact:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Email: janiellaton7@gmail.com
          </div>
        </section>

      </div>
    </div>
  );
};

export default Privacy;
