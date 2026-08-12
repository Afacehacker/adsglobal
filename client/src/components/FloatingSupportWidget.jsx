import React, { useState } from 'react';
import { Send, MessageSquare, Phone, X, DollarSign, Calculator, HelpCircle, ArrowRight } from 'lucide-react';

const FloatingSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [coinsInput, setCoinsInput] = useState('10000');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const RATES = {
    USD: 0.00065,  // 1 NGN ~ $0.00065 USD
    GBP: 0.00051,  // 1 NGN ~ £0.00051 GBP
    EUR: 0.00060,  // 1 NGN ~ €0.00060 EUR
    NGN: 1
  };

  const SYMBOLS = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    NGN: '₦'
  };

  const coins = parseFloat(coinsInput) || 0;
  const convertedValue = (coins * (RATES[selectedCurrency] || 1)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Currency Converter Modal */}
      {showConverter && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl w-80 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-violet-500" /> Currency & COIN Estimator
            </h4>
            <button onClick={() => setShowConverter(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">COINS Amount (1 COIN = ₦1)</label>
              <input
                type="number"
                value={coinsInput}
                onChange={(e) => setCoinsInput(e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Target Currency</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="GBP">GBP (£) - British Pound Sterling</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="NGN">NGN (₦) - Nigerian Naira</option>
              </select>
            </div>

            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-center">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Estimated Equivalent Value:</span>
              <span className="text-xl font-black text-violet-600 dark:text-violet-400">
                {SYMBOLS[selectedCurrency]} {convertedValue}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Support Options Menu */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl w-72 space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">ADSGLOBAL Quick Desk</h4>
            <p className="text-[10px] text-slate-400">Reach our 24/7 forwarding & advertising agents</p>
          </div>

          <a
            href="https://t.me/+9FSF2EH8QvplY2Zk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold transition"
          >
            <Send className="w-4 h-4 shrink-0" />
            <div className="flex-grow">
              <p className="leading-none">Telegram Community</p>
              <span className="text-[9px] text-sky-500 font-medium">3,420+ Live Members</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="mailto:janiellaton7@gmail.com"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold transition"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <div className="flex-grow">
              <p className="leading-none">Official Email Desk</p>
              <span className="text-[9px] text-violet-500 font-medium">janiellaton7@gmail.com</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => { setShowConverter(!showConverter); setIsOpen(false); }}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition text-left"
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <div className="flex-grow">
              <p className="leading-none">Currency & COIN Calculator</p>
              <span className="text-[9px] text-emerald-500 font-medium">Convert USD, GBP, NGN & COINS</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-full shadow-xl hover:shadow-violet-500/30 transition flex items-center gap-2 text-xs border border-white/20"
      >
        {isOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Send className="w-4 h-4" />
            <span>24/7 SUPPORT & TOOLS</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingSupportWidget;
