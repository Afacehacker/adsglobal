import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Check, Globe, Building } from 'lucide-react';

const PRESET_ADDRESSES = [
  // United Kingdom
  { country: 'United Kingdom', state: 'Greater London', city: 'London', address: '10 Downing Street, Westminster, London SW1A 2AA, UK', type: 'ADDRESS' },
  { country: 'United Kingdom', state: 'Greater London', city: 'London', address: 'Oxford Street, Mayfair, London W1D 1BS, UK', type: 'ADDRESS' },
  { country: 'United Kingdom', state: 'West Midlands', city: 'Birmingham', address: 'Colmore Row, Business District, Birmingham B3 2BJ, UK', type: 'ADDRESS' },
  { country: 'United Kingdom', state: 'Greater Manchester', city: 'Manchester', address: 'Market Street, City Centre, Manchester M1 1PW, UK', type: 'ADDRESS' },
  { country: 'United Kingdom', state: 'Edinburgh', city: 'Edinburgh', address: 'Royal Mile, Old Town, Edinburgh EH1 1SG, UK', type: 'ADDRESS' },

  // United States
  { country: 'United States', state: 'New York (NYC)', city: 'New York', address: '725 5th Ave, Midtown Manhattan, New York, NY 10022, USA', type: 'ADDRESS' },
  { country: 'United States', state: 'New York (NYC)', city: 'New York', address: '100 Wall Street, Financial District, New York, NY 10005, USA', type: 'ADDRESS' },
  { country: 'United States', state: 'California (Los Angeles/SF)', city: 'Los Angeles', address: 'Sunset Blvd, Hollywood, Los Angeles, CA 90028, USA', type: 'ADDRESS' },
  { country: 'United States', state: 'California (Los Angeles/SF)', city: 'San Francisco', address: 'Market Street, Financial District, San Francisco, CA 94105, USA', type: 'ADDRESS' },
  { country: 'United States', state: 'Texas (Houston/Dallas)', city: 'Dallas', address: 'Main Street, Downtown, Dallas, TX 75201, USA', type: 'ADDRESS' },
  { country: 'United States', state: 'Florida (Miami)', city: 'Miami', address: 'Ocean Drive, South Beach, Miami Beach, FL 33139, USA', type: 'ADDRESS' },
  { country: 'United States', state: 'Illinois (Chicago)', city: 'Chicago', address: 'Michigan Avenue, Magnificent Mile, Chicago, IL 60611, USA', type: 'ADDRESS' },

  // Nigeria
  { country: 'Nigeria', state: 'Lagos', city: 'Ikeja', address: '12 Allen Avenue, Ikeja, Lagos, Nigeria', type: 'ADDRESS' },
  { country: 'Nigeria', state: 'Lagos', city: 'Lagos Island', address: 'Broad Street, Commercial District, Lagos Island, Lagos, Nigeria', type: 'ADDRESS' },
  { country: 'Nigeria', state: 'Lagos', city: 'Victoria Island', address: 'Ahmadu Bello Way, Victoria Island, Lagos, Nigeria', type: 'ADDRESS' },
  { country: 'Nigeria', state: 'Abuja (FCT)', city: 'Abuja', address: 'Maitama District, Central Area, Abuja FCT, Nigeria', type: 'ADDRESS' },
  { country: 'Nigeria', state: 'Rivers (Port Harcourt)', city: 'Port Harcourt', address: 'Oil Mill Road, Trans Amadi, Port Harcourt, Rivers, Nigeria', type: 'ADDRESS' },

  // Canada
  { country: 'Canada', state: 'Ontario (Toronto/Ottawa)', city: 'Toronto', address: 'Yonge Street, Downtown, Toronto, ON M5B 2H1, Canada', type: 'ADDRESS' },
  { country: 'Canada', state: 'Quebec (Montreal)', city: 'Montreal', address: 'Ste-Catherine St, Ville-Marie, Montreal, QC H3B 1Y2, Canada', type: 'ADDRESS' },

  // Germany
  { country: 'Germany', state: 'Berlin', city: 'Berlin', address: 'Kurfürstendamm 10, City West, 10719 Berlin, Germany', type: 'ADDRESS' },
  { country: 'Germany', state: 'Bavaria (Munich)', city: 'Munich', address: 'Maximilianstraße 12, Altstadt, 80539 München, Germany', type: 'ADDRESS' },

  // France
  { country: 'France', state: 'Île-de-France (Paris)', city: 'Paris', address: 'Champs-Élysées, 75008 Paris, France', type: 'ADDRESS' },

  // Countries
  { country: 'United Kingdom', state: 'Greater London', city: 'London', address: 'United Kingdom (Nationwide)', type: 'COUNTRY' },
  { country: 'United States', state: 'New York (NYC)', city: 'New York', address: 'United States (Nationwide)', type: 'COUNTRY' },
  { country: 'Nigeria', state: 'Lagos', city: 'Lagos', address: 'Nigeria (Nationwide)', type: 'COUNTRY' },
  { country: 'Canada', state: 'Ontario (Toronto/Ottawa)', city: 'Toronto', address: 'Canada (Nationwide)', type: 'COUNTRY' },
  { country: 'Germany', state: 'Berlin', city: 'Berlin', address: 'Germany (Nationwide)', type: 'COUNTRY' },
  { country: 'France', state: 'Île-de-France (Paris)', city: 'Paris', address: 'France (Nationwide)', type: 'COUNTRY' },
  { country: 'Finland', state: 'Uusimaa (Helsinki)', city: 'Helsinki', address: 'Finland (Nationwide)', type: 'COUNTRY' },
  { country: 'Australia', state: 'New South Wales (Sydney)', city: 'Sydney', address: 'Australia (Nationwide)', type: 'COUNTRY' }
];

const AddressAutocomplete = ({ 
  value = '', 
  onChange = () => {}, 
  onSelectLocation = () => {},
  placeholder = 'Search country, state, city or precise street address...',
  label = 'Search Location or Address'
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [locating, setLocating] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const matches = PRESET_ADDRESSES.filter(item => 
        item.address.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );

      // If no exact preset matches, create a dynamic precise address suggestion
      if (matches.length === 0 && val.trim().length > 3) {
        matches.push({
          country: 'United States',
          state: 'Custom Address',
          city: 'Custom City',
          address: val,
          type: 'PRECISION ADDRESS'
        });
      }

      setSuggestions(matches);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.address);
    onChange(item.address);
    onSelectLocation(item);
    setIsOpen(false);
  };

  // Real-time GPS Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode via OpenStreetMap Nominatim free API
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          if (data && data.display_name) {
            const detectedAddress = data.display_name;
            const countryDetected = data.address?.country || 'United Kingdom';
            const stateDetected = data.address?.state || data.address?.region || 'London';
            const cityDetected = data.address?.city || data.address?.town || 'London';

            const locObj = {
              country: countryDetected,
              state: stateDetected,
              city: cityDetected,
              address: detectedAddress,
              type: 'REALTIME GPS ADDRESS'
            };

            setQuery(detectedAddress);
            onChange(detectedAddress);
            onSelectLocation(locObj);
          } else {
            alert(`Location detected: Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.error(err);
          alert('Device location pinpointed. Please select your target region.');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        console.error(error);
        alert('Could not access current location. Please type your target address in the search box.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full space-y-1">
      {label && <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.trim().length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        
        {/* Real-time GPS Tracker Button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          title="Detect my current real-time GPS location"
          disabled={locating}
          className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
        >
          <Navigation className={`w-4 h-4 ${locating ? 'animate-spin text-violet-600' : ''}`} />
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-start gap-3 text-xs"
            >
              <MapPin className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <div className="flex-grow min-w-0">
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.address}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{item.country}</span>
                  <span>•</span>
                  <span>{item.state}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                item.type === 'COUNTRY' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}>
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
