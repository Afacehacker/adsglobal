import React, { useState, useEffect } from 'react';
import { Truck, Megaphone, CheckCircle2, X } from 'lucide-react';

const RECENT_ACTIVITIES = [
  { id: 1, type: 'SHIPMENT', text: 'Chidi from Abuja shipped 12kg Foodstuffs to London, UK 🇬🇧', time: '2 mins ago' },
  { id: 2, type: 'AD', text: 'Sarah from Lagos launched a TikTok Ad Campaign in Texas 🇺🇸', time: '5 mins ago' },
  { id: 3, type: 'SHIPMENT', text: 'Adebayo sent a Birthday Gift Hamper to Toronto, Canada 🇨🇦', time: '9 mins ago' },
  { id: 4, type: 'WALLET', text: 'Dr. Olamide funded 150,000 COINS via Bank Transfer 💳', time: '14 mins ago' },
  { id: 5, type: 'SHIPMENT', text: 'Fatima shipped a Parcel to Frankfurt, Germany 🇩🇪', time: '18 mins ago' },
];

const RecentActivityTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const current = RECENT_ACTIVITIES[currentIndex];

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3 bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-sm">
      <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
        {current.type === 'SHIPMENT' ? (
          <Truck className="w-4 h-4 text-emerald-400" />
        ) : current.type === 'AD' ? (
          <Megaphone className="w-4 h-4 text-violet-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-xs font-bold text-slate-200 truncate">{current.text}</p>
        <span className="text-[9px] text-slate-400 font-semibold">{current.time} • Verified Live Activity</span>
      </div>
    </div>
  );
};

export default RecentActivityTicker;
