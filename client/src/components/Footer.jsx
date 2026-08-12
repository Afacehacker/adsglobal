import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, HelpCircle, FileText } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-emerald-500">
              ADSGLOBAL
            </span>
            <p className="text-xs leading-relaxed">
              Premium international delivery marketplace & social media advertising submission engine. Bridging logistical gaps and marketing goals globally.
            </p>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-violet-500" /> SECURE WALLET</span>
              <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> 24/7 SUPPORT</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-xs uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-slate-900 dark:hover:text-white transition">Product Delivery Shop</Link></li>
              <li><Link to="/campaigns" className="hover:text-slate-900 dark:hover:text-white transition">Advertising Placements</Link></li>
              <li><Link to="/wallet" className="hover:text-slate-900 dark:hover:text-white transition">Prepaid Coins Wallet</Link></li>
              <li><Link to="/support" className="hover:text-slate-900 dark:hover:text-white transition">Support Tickets Center</Link></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-xs uppercase tracking-wider">Legal & Rules</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-slate-400" /> <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white">Terms of Service</span></li>
              <li className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-slate-400" /> <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white">Privacy Policy</span></li>
              <li className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-slate-400" /> <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white">Refund Policy</span></li>
              <li className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-slate-400" /> <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white">Advertising Compliance Guidelines</span></li>
            </ul>
          </div>

          {/* Corporate contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-xs uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-violet-500" />
                <span>janiellaton7@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-violet-500" />
                <span>+234 1 800 9000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-500" />
                <span>Lagos, Nigeria / London, UK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {year} ADSGLOBAL Technologies. All rights reserved.</p>
          <p className="text-[10px] text-slate-500">
            Disclosures: Ad postings are queued and manually reviewed/published by operators to ensure safety compliance. Delivery estimates subject to custom clearances.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
