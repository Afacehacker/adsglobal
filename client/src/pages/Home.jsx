import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Truck, Megaphone, Coins, ChevronRight, Globe, Layers, 
  ArrowRight, Star, HelpCircle, MapPin, Search, PlusCircle, Sparkles, 
  Eye, MousePointer, ExternalLink, Filter, Building, Compass, Gift, Heart, PackageCheck
} from 'lucide-react';
import api from '../services/api';
import TelegramModal from '../components/TelegramModal';

const Home = () => {
  const navigate = useNavigate();
  const locationInputRef = useRef(null);

  const [locations, setLocations] = useState([
    { country: 'United States', code: 'US', count: 77, flag: '🇺🇸' },
    { country: 'Canada', code: 'CA', count: 4, flag: '🇨🇦' },
    { country: 'Germany', code: 'DE', count: 3, flag: '🇩🇪' },
    { country: 'United Kingdom', code: 'UK', count: 12, flag: '🇬🇧' },
    { country: 'Finland', code: 'FI', count: 5, flag: '🇫🇮' },
    { country: 'Nigeria', code: 'NG', count: 18, flag: '🇳🇬' },
    { country: 'Australia', code: 'AU', count: 6, flag: '🇦🇺' },
    { country: 'France', code: 'FR', count: 4, flag: '🇫🇷' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Fetch Public Location Counts & Seeded Ads
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const resLoc = await api.get('/campaigns/public/locations');
        if (resLoc.data.locations && resLoc.data.locations.length > 0) {
          setLocations(resLoc.data.locations);
        }

        const resSearch = await api.get('/campaigns/public/search');
        setSearchResults(resSearch.data.campaigns || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPublicData();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setSearching(true);
    try {
      const res = await api.get('/campaigns/public/search', {
        params: {
          query: searchQuery,
          country: selectedCountry === 'All' ? '' : selectedCountry
        }
      });
      setSearchResults(res.data.campaigns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleChooseLocationClick = () => {
    if (locationInputRef.current) {
      locationInputRef.current.scrollIntoView({ behavior: 'smooth' });
      locationInputRef.current.focus();
    }
  };

  return (
    <div className="relative overflow-hidden space-y-12">
      {/* Hero Section with Choose Location, Send Gifts Abroad & Post Ads */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.2),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider animate-bounce">
              <Gift className="w-4 h-4" /> Send Gifts To Families & Friends Abroad • Post Ads Worldwide
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
              Send Gifts To Loved Ones Abroad.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400">
                Post Ads in Any City Worldwide.
              </span>
            </h1>

            <p className="text-slate-300 sm:text-lg max-w-xl mx-auto leading-relaxed">
              Surprise your family and friends in the UK, USA, Canada, Europe & beyond with care packages, food items & gifts — or launch high-converting ad campaigns in any city. Driven by prepaid COINS.
            </p>

            {/* Top Action Buttons: Send Gifts Abroad, Choose Location & Post Ads */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <Gift className="w-5 h-5" /> SEND GIFTS ABROAD
              </Link>

              <button 
                onClick={handleChooseLocationClick}
                className="w-full sm:w-auto px-7 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 shadow-lg hover:border-violet-500 transition flex items-center justify-center gap-2 text-sm"
              >
                <MapPin className="w-5 h-5 text-violet-400" /> CHOOSE A LOCATION
              </button>
              
              <Link 
                to="/campaigns" 
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-violet-500/30 transition flex items-center justify-center gap-2 text-sm"
              >
                <PlusCircle className="w-5 h-5" /> POST ADS NOW
              </Link>
            </div>
          </div>

          {/* MAIN SEARCH BAR (City, Country, Keyword) */}
          <div ref={locationInputRef} className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-3xl shadow-2xl space-y-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              {/* Search Keyword */}
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities, hookups, real estate, electronics, jobs..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Country / City Selector */}
              <div className="relative sm:w-60 shrink-0">
                <Compass className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    handleSearch();
                  }}
                  className="w-full pl-12 pr-8 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
                >
                  <option value="All">All Locations / Global</option>
                  {locations.map((loc) => (
                    <option key={loc.country} value={loc.country}>
                      {loc.flag} {loc.country} ({loc.count} Ads)
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Search */}
              <button
                type="submit"
                disabled={searching}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                {searching ? 'SEARCHING...' : 'SEARCH ADS'}
              </button>
            </form>
          </div>

          {/* ACTIVE COUNTRIES CLASSIFIED ADS COUNTER BANNER */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" /> Live Ads Posted By Country
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {locations.map((loc) => {
                const isSelected = selectedCountry === loc.country;
                return (
                  <button
                    key={loc.country}
                    onClick={() => {
                      setSelectedCountry(loc.country);
                      handleSearch();
                    }}
                    className={`px-4 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-500 shadow-md ring-2 ring-violet-500/40'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80'
                    }`}
                  >
                    <span>{loc.flag}</span>
                    <span>{loc.country}</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-black">
                      {loc.count} Ads
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* SPECIAL FEATURE BANNER: SEND GIFTS TO FAMILY & FRIENDS ABROAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/5 skew-x-12 pointer-events-none"></div>
          
          <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300" /> Send Love Across Borders
            </div>

            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Send Gift Packages & Food Items To Family & Friends Abroad!
            </h2>

            <p className="text-emerald-100 text-sm leading-relaxed">
              Surprise your relatives and friends in the United States, UK, Canada, Germany, Finland & Europe. Order authentic food packs, customized gift baskets, and personal care items with door-to-door international forwarding.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold pt-2 justify-center md:justify-start">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-300" /> Door-to-Door Delivery</span>
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-emerald-300" /> Real-Time Parcel Tracking</span>
              <span className="flex items-center gap-1.5"><Coins className="w-4 h-4 text-emerald-300" /> Pay in COINS</span>
            </div>
          </div>

          <div className="shrink-0 relative z-10">
            <Link
              to="/shop"
              className="px-8 py-4 bg-white text-emerald-700 hover:bg-slate-100 font-black text-sm rounded-2xl shadow-xl transition inline-flex items-center gap-2 uppercase tracking-wider"
            >
              <Gift className="w-5 h-5 text-emerald-600" /> SEND A GIFT NOW
            </Link>
          </div>
        </div>
      </section>

      {/* CORE COIN BANNER */}
      <section className="py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-center text-xs tracking-wider uppercase shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 flex-wrap">
          <Coins className="w-4 h-4" />
          <span>Internal prepaid token wallet: <strong>1 COIN = ₦1</strong></span>
          <span className="mx-2 hidden md:inline">|</span>
          <span>Instant reviews & verified placement execution</span>
        </div>
      </section>

      {/* SEARCH RESULTS & FEATURED CLASSIFIED ADS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-violet-500" /> 
              {selectedCountry !== 'All' ? `Posted Ads in ${selectedCountry}` : 'Global Posted Ads'}
            </h2>
            <p className="text-xs text-slate-400">Showing live verified ad placements and active listings</p>
          </div>

          {selectedCountry !== 'All' && (
            <button 
              onClick={() => {
                setSelectedCountry('All');
                setSearchQuery('');
                handleSearch();
              }}
              className="text-xs text-violet-500 hover:underline font-bold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
            <Globe className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No ads found for this location search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Be the first to post an ad for {selectedCountry}!</p>
            <Link to="/campaigns" className="inline-flex px-6 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-md">
              POST AN AD NOW
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((ad) => (
              <div key={ad._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20 text-[10px] font-black uppercase">
                      {ad.objective}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {(ad.target_locations && ad.target_locations[0]?.country) || 'Global'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">{ad.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold block">{ad.business_name} • {ad.platform?.name}</span>
                  </div>

                  {/* USER-UPLOADED PICTURE OR VIDEO DISPLAY */}
                  {ad.media_files && ad.media_files.length > 0 && (
                    <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-800 my-2">
                      {ad.media_files[0].file_type === 'video' ? (
                        <video src={ad.media_files[0].url} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={ad.media_files[0].url} alt={ad.name} className="w-full h-full object-cover hover:scale-105 transition" />
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {ad.creative?.copy}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-emerald-500" /> {(ad.impressions_views || 0).toLocaleString()} Views</span>
                    <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5 text-violet-500" /> {(ad.clicks || 0).toLocaleString()} Clicks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* VERIFIED REAL CUSTOMER REVIEWS & PACKAGE UNBOXING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
            ⭐ 4.98 / 5.0 Rating Across 1,420+ Orders
          </span>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">Real Customer Deliveries & Testimonials</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">See real photos of gift packages, food items, cars & electronics forwarded to families in the UK, USA, Canada & Europe!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" alt="Nigerian foodstuffs package" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "Sent a 15kg traditional foodstuffs pack to my sister in London SW1. Delivered in 4 days in perfect condition! Extremely fast forwarders."
              </p>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Dr. Kenneth O.</span>
                <span className="text-violet-500">London, UK 🇬🇧</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600" alt="Physical car delivery" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "Promoted my vehicle dealership across Texas and Florida using WhatsApp and TikTok ad campaigns. Generated 48 hot leads in 48 hours!"
              </p>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Sarah Jenkins</span>
                <span className="text-violet-500">Houston, USA 🇺🇸</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600" alt="Gift basket delivery" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "Ordered a birthday luxury gift hamper for my mom in Lagos. The delivery team packaged it so nicely. Will definitely use ADSGLOBAL again."
              </p>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Tunde Bakare</span>
                <span className="text-violet-500">Toronto, Canada 🇨🇦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Send Gifts or Post Ads Worldwide Today</h2>
          <p className="max-w-lg mx-auto text-sm text-slate-300">
            Sign up now, credit your wallet, and send gift packages or launch ads across cities and countries under one platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/shop" className="px-8 py-4 bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg hover:bg-emerald-700 transition inline-flex items-center gap-2 text-sm">
              <Gift className="w-5 h-5" /> SEND GIFTS ABROAD
            </Link>
            <Link to="/campaigns" className="px-8 py-4 bg-violet-600 text-white font-extrabold rounded-2xl shadow-lg hover:bg-violet-700 transition inline-flex items-center gap-2 text-sm">
              <PlusCircle className="w-5 h-5" /> POST AD NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Telegram Channel Invitation Modal (Triggers on load/reload, 2-hour snooze) */}
      <TelegramModal />
    </div>
  );
};

export default Home;
