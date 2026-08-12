import React, { useState, useEffect } from 'react';
import { Send, X, Clock, Sparkles, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

const TELEGRAM_LINK = 'https://t.me/+9FSF2EH8QvplY2Zk';
const HIDE_STORAGE_KEY = 'telegram_modal_hide_until';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const TelegramModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if hidden timer is still active
    const hideUntil = localStorage.getItem(HIDE_STORAGE_KEY);
    const now = Date.now();

    if (!hideUntil || now >= Number(hideUntil)) {
      // Show popup on page load/reload
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600); // smooth entry delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Dismiss for current view without setting 2-hour snooze key
  const handleCloseOnly = () => {
    setIsOpen(false);
  };

  // Snooze popup for 2 hours (only when "Remind Me Later (Hide for 2 Hours)" or "Join Telegram" is clicked)
  const handleSnoozeTwoHours = () => {
    const hideUntil = Date.now() + TWO_HOURS_MS;
    localStorage.setItem(HIDE_STORAGE_KEY, hideUntil.toString());
    setIsOpen(false);
  };

  const handleJoinTelegram = () => {
    window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
    handleSnoozeTwoHours();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Decorative Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600"></div>

        {/* Close Button (X dismisses for now, will show again on reload) */}
        <button
          onClick={handleCloseOnly}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
          title="Close (Will reappear on next reload)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Telegram Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 transform hover:scale-105 transition duration-300">
            <Send className="w-8 h-8 -translate-x-0.5 translate-y-0.5" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> VIP Telegram Community
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Join Our Telegram Channel!
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
            Get instant updates on ad campaign status, exclusive COINS discounts, real-time deposit confirmations, and 24/7 priority support!
          </p>
        </div>

        {/* Features Bullet List */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant Ad Approvals & Status Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-sky-500 shrink-0" />
            <span>24/7 Community Support & Inquiries</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Exclusive Promo Codes & Wallet Bonus Coins</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleJoinTelegram}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>JOIN TELEGRAM CHANNEL NOW</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          <button
            onClick={handleSnoozeTwoHours}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Remind Me Later (Hide for 2 Hours)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default TelegramModal;
