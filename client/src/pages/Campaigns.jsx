import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Layers, Info, CheckCircle, AlertCircle, Sparkles, Target, 
  ClipboardCheck, ExternalLink, Coins, Clock, Flame, MessageSquare, 
  Share2, Globe, Calendar, Users, Check, ShieldCheck, X
} from 'lucide-react';
import api from '../services/api';

const GOAL_OPTIONS = [
  { id: 'Hookup Ads', name: 'Hookup Ads', desc: 'Promote hookup & adult social connectivity' },
  { id: 'Dating Ads', name: 'Dating Ads', desc: 'Promote dating apps & matchmaking' },
  { id: 'Drug Ads', name: 'Drug Ads', desc: 'Promote pharmaceuticals, supplements & herbal items' },
  { id: 'Celeb Ads', name: 'Celeb Ads', desc: 'Promote celebrity news, gossip & updates' },
  { id: 'BYD Update Ads', name: 'BYD Update Ads', desc: 'Promote EV tech, automotive & BYD news' },
  { id: 'Pet Update Ads', name: 'Pet Update Ads', desc: 'Promote pet sales, pet care & breeding' },
  { id: 'Investment Ads', name: 'Investment Ads', desc: 'Promote ROI programs, stocks & wealth plans' },
  { id: 'Sport Ads', name: 'Sport Ads', desc: 'Promote sports gear, betting & event tickets' },
  { id: 'Apartment Ads', name: 'Apartment Ads', desc: 'Promote shortlets, room rentals & apartments' },
  { id: 'Real Estate Ads', name: 'Real Estate Ads', desc: 'Promote land sales, houses & commercial property' },
  { id: 'Furniture Ads', name: 'Furniture Ads', desc: 'Promote home furniture, decor & fittings' },
  { id: 'Vehicle Ads', name: 'Vehicle Ads', desc: 'Promote cars, trucks, motorcycles & parts' },
  { id: 'Electronics Ads', name: 'Electronics Ads', desc: 'Promote TVs, gadgets, appliances & accessories' },
  { id: 'Phone Ads', name: 'Phone Ads', desc: 'Promote smartphones, repairs & accessories' },
  { id: 'Job Ads', name: 'Job Ads', desc: 'Promote job vacancies, recruitment & hiring' },
  { id: 'Baby Sitting Ads', name: 'Baby Sitting Ads', desc: 'Promote babysitting & child care services' },
  { id: 'Nanny Ads', name: 'Nanny Ads', desc: 'Promote domestic nanny & housekeeping services' },
  { id: 'Crypto Ads', name: 'Crypto Ads', desc: 'Promote cryptocurrencies, Web3, NFTs & exchanges' },
  { id: 'Gift Cards Ads', name: 'Gift Cards Ads', desc: 'Promote gift card trading & digital vouchers' },
  { id: 'Forex & Trading Ads', name: 'Forex & Trading Ads', desc: 'Promote Forex signals, brokers & trading tools' },
  { id: 'Fashion & Beauty Ads', name: 'Fashion & Beauty Ads', desc: 'Promote clothing, cosmetics & hair styling' },
  { id: 'Gaming & Esports Ads', name: 'Gaming & Esports Ads', desc: 'Promote mobile games, consoles & gaming gear' },
  { id: 'General Commercial Ads', name: 'General Commercial Ads', desc: 'Promote general products, apps & services' }
];

const DEFAULT_FALLBACK_PLATFORMS = [
  { _id: 'plat_wa', name: 'WhatsApp Ads', slug: 'whatsapp-ads' },
  { _id: 'plat_zangi', name: 'Zangi Ads', slug: 'zangi-ads' },
  { _id: 'plat_tt', name: 'TikTok Ads', slug: 'tiktok-ads' },
  { _id: 'plat_fb', name: 'Facebook Ads', slug: 'facebook-ads' },
  { _id: 'plat_snap', name: 'Snapchat Ads', slug: 'snapchat-ads' },
  { _id: 'plat_all', name: 'All Social Media Platforms', slug: 'all-social-media' }
];

const Campaigns = () => {
  const [platforms, setPlatforms] = useState(DEFAULT_FALLBACK_PLATFORMS);
  const [campaigns, setCampaigns] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submittedCampaignModal, setSubmittedCampaignModal] = useState(null);

  // Form State with user-friendly smart defaults
  const [selectedPlatformId, setSelectedPlatformId] = useState(DEFAULT_FALLBACK_PLATFORMS[0]._id);
  const [selectedGoal, setSelectedGoal] = useState('Hookup Ads');

  // Age Preferences (Opening Page requirement)
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(65);
  const [gender, setGender] = useState('All');
  const [targetCountry, setTargetCountry] = useState('Nigeria');

  // Budget & Time Settings (Min 7000 coins / 24h, 1 to 30 days)
  const [budgetPerDay, setBudgetPerDay] = useState(7000);
  const [durationDays, setDurationDays] = useState(1);
  const [creativeAssistance, setCreativeAssistance] = useState(false);

  // Creative & Contact details (starts completely blank)
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [productService, setProductService] = useState('');
  const [landingPage, setLandingPage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [headline, setHeadline] = useState('');
  const [copy, setCopy] = useState('');

  // Compliance Checkbox (checked by default for seamless submission)
  const [complianceCheck, setComplianceCheck] = useState(true);

  // Multi-Media File Uploads (Pictures & Videos up to 200MB)
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // 200 MB file size limit (200 * 1024 * 1024 bytes)
    const MAX_SIZE = 200 * 1024 * 1024;
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        setError(`File '${file.name}' exceeds the maximum allowed size of 200 MB.`);
        return;
      }
    }

    setUploadingMedia(true);
    setError('');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await api.post('/campaigns/upload-creatives', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.files) {
        setMediaFiles((prev) => [...prev, ...res.data.files]);
        setSuccess(`${res.data.files.length} file(s) uploaded successfully!`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload creative files. Max 200MB allowed.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeMediaFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchCampaignData = async () => {
    try {
      const resPlat = await api.get('/campaigns/platforms');
      if (resPlat.data?.platforms && resPlat.data.platforms.length > 0) {
        setPlatforms(resPlat.data.platforms);
        setSelectedPlatformId(resPlat.data.platforms[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch platforms from API, using default list:', err);
    }

    try {
      const resCams = await api.get('/campaigns');
      setCampaigns(resCams.data?.campaigns || []);
    } catch (err) {
      // User might be unauthenticated, silence error
    }

    try {
      const resMe = await api.get('/auth/me');
      setWalletBalance(resMe.data?.wallet?.balance || 0);
    } catch (err) {
      // User might be unauthenticated, silence error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  // Calculated Costs
  const currentDailyBudget = Math.max(7000, Number(budgetPerDay) || 7000);
  const currentDays = Math.min(30, Math.max(1, Number(durationDays) || 1));
  const adSpendTotal = currentDailyBudget * currentDays;
  const creativeFee = creativeAssistance ? 5000 : 0;
  const grandTotalCoins = adSpendTotal + creativeFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complianceCheck) {
      setError('Please accept the compliance & terms verification checkbox.');
      return;
    }
    if (!selectedPlatformId) {
      setError('Please select an Ad Type / Platform.');
      return;
    }
    if (!name || !copy) {
      setError('Please fill in Campaign Name and Main Ad Copy.');
      return;
    }

    setFormLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      name,
      business_name: businessName || name,
      product_service: productService || name,
      landing_page: landingPage,
      contact_info: contactInfo || 'N/A',
      objective: selectedGoal,
      category: selectedGoal,
      platform_id: selectedPlatformId,
      duration_days: currentDays,
      duration_hours: currentDays * 24,
      budget_per_day: currentDailyBudget,
      platform_budget: adSpendTotal,
      creative: {
        headline: headline,
        copy,
        destination_url: landingPage,
      },
      media_files: mediaFiles,
      target_locations: [{ country: targetCountry }],
      target_audience: {
        age_min: Number(ageMin),
        age_max: Number(ageMax),
        genders: [gender]
      },
      creative_assistance: creativeAssistance,
      compliance_declared: true
    };

    try {
      const res = await api.post('/campaigns', payload);
      const newCam = res.data.campaign;

      setSuccess('Campaign submitted successfully! Deducted ' + grandTotalCoins.toLocaleString() + ' COINS.');
      setSubmittedCampaignModal({
        number: newCam?.campaign_number || 'AD-NEW',
        cost: grandTotalCoins,
        platform: platforms.find(p => p._id === selectedPlatformId)?.name || 'Ad Platform',
        goal: selectedGoal,
        duration: currentDays
      });
      
      // Refresh campaigns & wallet balance
      fetchCampaignData();
    } catch (err) {
      const errMsg = err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response?.data?.details && err.response.data.details.length > 0 ? err.response.data.details.join(', ') : 'Failed to submit ad campaign');
      setError(errMsg);
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

  const selectedPlatform = platforms.find(p => p._id === selectedPlatformId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">

      {/* Success Modal Popup */}
      {submittedCampaignModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-sm uppercase">
                <CheckCircle className="w-6 h-6" /> Ad Campaign Submitted!
              </div>
              <button 
                onClick={() => setSubmittedCampaignModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Your ad campaign has been created and is now queued for manual moderation review!
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Campaign ID:</span>
                  <strong className="text-violet-500 font-bold">{submittedCampaignModal.number}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform:</span>
                  <strong className="text-slate-700 dark:text-slate-200">{submittedCampaignModal.platform}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Goal:</span>
                  <strong className="text-slate-700 dark:text-slate-200">{submittedCampaignModal.goal}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <strong className="text-slate-700 dark:text-slate-200">{submittedCampaignModal.duration} Days</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-sans font-black text-sm text-emerald-500">
                  <span>Deducted Coins:</span>
                  <span>{submittedCampaignModal.cost.toLocaleString()} COINS</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSubmittedCampaignModal(null);
                  document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                VIEW IN CAMPAIGN HISTORY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Next-Gen Ad Agency Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Social Media & Traffic Agency</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Launch high-converting campaigns across WhatsApp, Zangi, TikTok, Facebook, Snapchat, & all social networks using your prepaid COINS balance.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 shrink-0">
          <div>
            <span className="text-slate-300 text-xs block font-medium">Prepaid Wallet</span>
            <span className="text-2xl font-black text-emerald-400">{walletBalance.toLocaleString()} COINS</span>
          </div>
          <Coins className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Main Agency Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Section (2 Cols): Easy Navigation Setup */}
        <div className="lg:col-span-2 space-y-6">

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. TYPES OF ADS TO DISPLAY (PLATFORMS) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="w-7 h-7 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">1</span>
              <h2 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                Select Type of Ads / Platform Network
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {platforms.map((plat) => {
                const isSelected = plat._id === selectedPlatformId;
                return (
                  <button
                    key={plat._id}
                    type="button"
                    onClick={() => setSelectedPlatformId(plat._id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-violet-600 bg-violet-600/10 dark:bg-violet-600/20 ring-2 ring-violet-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="p-2 rounded-xl bg-violet-500/10 w-fit text-violet-500 mb-2">
                      {plat.name.includes('Hookup') ? <Flame className="w-5 h-5 text-rose-500" /> :
                       plat.name.includes('WhatsApp') || plat.name.includes('Zangi') ? <MessageSquare className="w-5 h-5 text-emerald-500" /> :
                       plat.name.includes('TikTok') || plat.name.includes('Facebook') || plat.name.includes('Snapchat') ? <Share2 className="w-5 h-5 text-indigo-500" /> :
                       <Globe className="w-5 h-5 text-amber-500" />}
                    </div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">{plat.name}</span>
                    <span className="text-[9px] text-slate-400 block mt-1">Manual Audit Placement</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. MAIN GOAL OF THE ADS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="w-7 h-7 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">2</span>
              <h2 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                Select Main Goal of the Ads
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {GOAL_OPTIONS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-violet-600 bg-violet-600/10 dark:bg-violet-600/20 ring-2 ring-violet-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{g.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-violet-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{g.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. AGE PREFERENCES & DEMOGRAPHICS (OPENING PAGE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="w-7 h-7 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">3</span>
              <h2 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                Age Preferences & Demographic Targeting
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Minimum Age *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={13}
                    max={100}
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-semibold">yrs</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Maximum Age *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={13}
                    max={100}
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-semibold">yrs</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Target Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male only</option>
                  <option value="Female">Female only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[10px] uppercase font-bold text-slate-500">Target Country / Region</label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Worldwide">Worldwide / Global</option>
              </select>
            </div>
          </div>

          {/* 4. AD CREATIVE CONTENT & DETAILS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="w-7 h-7 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center">4</span>
              <h2 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                Ad Creatives & Offer Details
              </h2>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Campaign Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Special Hookup/Dating Launch"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Destination Link / WhatsApp / Zangi Link</label>
              <input
                type="text"
                value={landingPage}
                onChange={(e) => setLandingPage(e.target.value)}
                placeholder="https://wa.me/234... or zangi link"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Ad Headline / Title</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Catchy headline for your ad..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Main Ad Copy Text / Description *</label>
              <textarea
                value={copy}
                onChange={(e) => setCopy(e.target.value)}
                placeholder="Write your detailed ad text copy here..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none h-24"
                required
              />
            </div>

            {/* MULTI-MEDIA FILE UPLOADER (PICS & VIDS UP TO 200MB) */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex justify-between items-center">
                <span>Upload Pictures & Videos (Local Files)</span>
                <span className="text-emerald-500 font-extrabold">Max: 200 MB per file</span>
              </label>
              
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-violet-500 transition bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  id="media-upload-input"
                  className="hidden"
                  disabled={uploadingMedia}
                />
                <label 
                  htmlFor="media-upload-input" 
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-md transition uppercase tracking-wider"
                >
                  {uploadingMedia ? 'UPLOADING CREATIVES...' : 'SELECT PICS & VIDEOS (UP TO 200MB)'}
                </label>
                <p className="text-[10px] text-slate-400">Supported formats: JPG, PNG, WEBP, MP4, MOV, WEBM (Max size: 200MB)</p>
              </div>

              {/* Uploaded Media Previews */}
              {mediaFiles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Uploaded Media Preview ({mediaFiles.length}):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaFiles.map((file, idx) => (
                      <div key={idx} className="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                        {file.file_type === 'video' ? (
                          <video 
                            src={file.url} 
                            controls 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <img 
                            src={file.url} 
                            alt={file.original_name || 'Uploaded preview'} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMediaFile(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition"
                          title="Remove media file"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section (1 Col): Budgeting, Pricing & Checkout */}
        <div className="space-y-6">

          {/* BUDGET & DURATION CONFIGURATION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 sticky top-6">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">5</span>
              <h2 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                Budget & Duration
              </h2>
            </div>

            {/* Daily Amount Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex justify-between">
                <span>Daily Ad Budget (Coins per 24h) *</span>
                <span className="text-violet-500 font-extrabold">Min: 7,000 COINS</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={7000}
                  step={500}
                  value={budgetPerDay}
                  onChange={(e) => setBudgetPerDay(e.target.value)}
                  className="w-full pl-4 pr-16 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl text-base font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">COINS/day</span>
              </div>
              <p className="text-[10px] text-slate-400">Minimum budget is <strong>7,000 COINS</strong> for 24 hours (1 COIN = ₦1).</p>
            </div>

            {/* Duration Input (1 to 30 days) */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex justify-between">
                <span>Campaign Duration (Days) *</span>
                <span className="text-indigo-500 font-extrabold">Max: 30 Days</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full accent-violet-600 cursor-pointer"
                />
                <div className="px-3 py-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-500 font-black text-xs shrink-0">
                  {durationDays} {Number(durationDays) === 1 ? 'Day' : 'Days'}
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Min duration: <strong>24 Hours (1 Day)</strong>, Max: <strong>30 Days</strong>.</p>
            </div>

            {/* Creative Copywriter Option */}
            <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                checked={creativeAssistance}
                onChange={(e) => setCreativeAssistance(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-slate-950 border-slate-800"
              />
              <div>
                <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Creative Copywriter Assist</span>
                <span className="text-[9px] text-slate-400 block font-normal">+5,000 COINS for graphic & copy polish</span>
              </div>
            </label>

            {/* Live Pricing Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Daily Rate:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{currentDailyBudget.toLocaleString()} COINS / 24h</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Duration:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{currentDays} {currentDays === 1 ? 'Day (24h)' : 'Days'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Ads Placement Spend:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{adSpendTotal.toLocaleString()} COINS</span>
              </div>
              {creativeAssistance && (
                <div className="flex justify-between text-slate-500">
                  <span>Creative Service Fee:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">5,000 COINS</span>
                </div>
              )}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Grand Total:</span>
                <span className="text-emerald-500 text-base">{grandTotalCoins.toLocaleString()} COINS</span>
              </div>
            </div>

            {/* Wallet balance check */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Your Wallet Balance</span>
                <strong className="text-slate-800 dark:text-white font-bold">{walletBalance.toLocaleString()} COINS</strong>
              </div>
              <Coins className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>

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

            {walletBalance < grandTotalCoins && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold rounded-xl flex flex-col gap-1">
                <span>INSUFFICIENT WALLET BALANCE</span>
                <span>Shortfall: {(grandTotalCoins - walletBalance).toLocaleString()} COINS</span>
              </div>
            )}

            {/* Compliance Declaration Checkbox */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-[10px] text-slate-400">
                <input
                  type="checkbox"
                  checked={complianceCheck}
                  onChange={(e) => setComplianceCheck(e.target.checked)}
                  className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 bg-slate-950 border-slate-800 shrink-0"
                  required
                />
                <span className="leading-normal">
                  I confirm the creatives and links comply with user terms and understand that campaigns are manually audited before going live.
                </span>
              </label>

              {walletBalance >= grandTotalCoins ? (
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-violet-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" /> PAY COINS & LAUNCH ADS NOW
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl uppercase tracking-wider">
                  Fund Wallet to Launch Campaign
                </div>
              )}
            </div>

          </div>
        </div>
      </form>

      {/* History of Submitted Campaigns */}
      <div id="history-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-violet-500" /> Submitted Ad Campaigns
        </h3>

        {campaigns.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No ad campaigns submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((cam) => (
              <div key={cam._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col gap-3 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">{cam.name} ({cam.campaign_number})</strong>
                    <span className="text-slate-400 block text-[10px] mt-0.5">Platform: {cam.platform?.name} | Goal: {cam.objective}</span>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                    cam.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse'
                      : cam.status === 'REJECTED' || cam.status === 'CANCELLED'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {cam.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] border-t border-slate-200/50 dark:border-slate-800/50 pt-3 text-slate-400">
                  <div>Duration: <strong>{(cam.duration_hours / 24) || 1} Days ({cam.duration_hours}h)</strong></div>
                  <div>Age Target: <strong>{cam.target_audience?.age_min || 18} - {cam.target_audience?.age_max || 65} yrs</strong></div>
                  <div>Views (Impressions): <strong className="text-emerald-500 font-bold">{(cam.impressions_views || 0).toLocaleString()} 👁</strong></div>
                  <div>Clicks Generated: <strong className="text-violet-500 font-bold">{(cam.clicks || 0).toLocaleString()} 🖱</strong></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900/60 p-2.5 rounded-xl">
                  <div>Total Spent: <strong className="text-slate-700 dark:text-slate-300 font-bold">{cam.total_cost_coins?.toLocaleString()} COINS</strong></div>
                  <div>Ad Status: <strong className="uppercase font-bold text-slate-600 dark:text-slate-300">{cam.status === 'SUBMITTED' ? 'PENDING REVIEW' : cam.status}</strong></div>
                </div>

                {/* UPLOADED PICTURES OR VIDEO DISPLAY FOR CUSTOMER */}
                {cam.media_files && cam.media_files.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Uploaded Ad Creatives ({cam.media_files.length} files):</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cam.media_files.map((file, fIdx) => (
                        <div key={fIdx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
                          {file.file_type === 'video' ? (
                            <video src={file.url} controls className="w-full h-full object-cover" />
                          ) : (
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <img src={file.url} alt={file.original_name || 'Uploaded Ad Creative'} className="w-full h-full object-cover hover:scale-105 transition" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cam.posting_url && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-between gap-2">
                    <span className="font-semibold text-[10px]">Active Ad URL:</span>
                    <a href={cam.posting_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-emerald-500 text-white rounded-lg font-bold text-[9px] flex items-center gap-1 transition">
                      OPEN AD LINK <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
