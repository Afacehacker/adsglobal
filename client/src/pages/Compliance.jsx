import React from 'react';
import { ShieldCheck, Megaphone, AlertCircle, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Compliance = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center md:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <div className="p-3 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-2xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Advertising Compliance Guidelines</h1>
            <p className="text-xs text-slate-500">Effective Date: January 1, 2026 | Last Updated: August 2026</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">1</span>
            Overview & Content Policy
          </h2>
          <p>
            ADSGLOBAL maintains high standards for advertising placed across our traffic network, including WhatsApp Ads, Zangi Ads, TikTok Ads, Facebook Ads, Snapchat Ads, and general social platforms.
          </p>
          <p>
            All submitted creatives, headlines, landing page links, and video/picture assets are reviewed by our moderation operators prior to live distribution.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">2</span>
            Allowed & Restricted Ad Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Allowed */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Allowed Ad Categories
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <li>Hookup & Dating Apps / Social Connectivity</li>
                <li>Pharmaceuticals, Supplements & Herbal Items</li>
                <li>BYD & EV Tech / Automotive Updates</li>
                <li>Crypto, Web3 & Digital Voucher Promotions</li>
                <li>E-commerce, Fast Food & Restaurant Delivery</li>
                <li>Real Estate, Shortlets & Short-term Rentals</li>
                <li>Job Vacancies & Domestic Services</li>
              </ul>
            </div>

            {/* Prohibited */}
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-red-600 dark:text-red-400 flex items-center gap-1.5 text-sm">
                <XCircle className="w-4 h-4" /> Strictly Prohibited Content
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <li>Malware, Phishing & Fraudulent Schemes</li>
                <li>Illegal Weapons & Explosives</li>
                <li>Hate Speech, Harassment & Violence</li>
                <li>Deceptive Financial Guarantees ("Get Rich Quick")</li>
                <li>Non-consensual PII & Doxing Content</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">3</span>
            Creative Specifications & Upload Limits
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Max File Size:</strong> 200 MB per image/video file.</li>
            <li><strong>Supported Formats:</strong> PNG, JPG, JPEG, WEBP, MP4, MOV, AVI.</li>
            <li><strong>Destination Links:</strong> Must point to valid websites, active WhatsApp links, or Zangi invite links.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">4</span>
            Compliance Support Desk
          </h2>
          <p>
            For ad compliance reviews, appeal requests, or asset guidelines inquiries, reach out to our team at:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
            Email: janiellaton7@gmail.com
          </div>
        </section>

      </div>
    </div>
  );
};

export default Compliance;
