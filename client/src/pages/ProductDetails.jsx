import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Heart, ShieldAlert, Check, HelpCircle, Truck, Calculator, Coins } from 'lucide-react';
import api from '../services/api';

const COUNTRY_STATE_DATA = {
  'United Kingdom': [
    'Greater London', 'West Midlands (Birmingham)', 'Greater Manchester', 'West Yorkshire (Leeds)',
    'Glasgow & Strathclyde', 'Edinburgh', 'Cardiff & South Wales', 'Belfast & Northern Ireland', 'Merseyside (Liverpool)',
    'Tyne & Wear (Newcastle)', 'Bristol & South West', 'Leicestershire', 'Nottinghamshire', 'Hampshire', 'Essex', 'Kent', 'All Regions / Nationwide'
  ],
  'Nigeria': [
    'Lagos', 'Abuja (FCT)', 'Rivers (Port Harcourt)', 'Oyo (Ibadan)', 'Kano', 'Kaduna', 
    'Ogun', 'Edo (Benin City)', 'Enugu', 'Delta', 'Anambra', 'Akwa Ibom', 'Imo', 'Abia', 'Osun', 'Ondo', 'Kwara', 
    'Cross River', 'Plateau', 'Benue', 'Niger', 'Bauchi', 'Adamawa', 'Taraba', 'Borno', 'Yobe', 'Gombe', 'Katsina', 
    'Sokoto', 'Zamfara', 'Kebbi', 'Jigawa', 'Kogi', 'Nasarawa', 'Ekiti', 'Ebonyi', 'Bayelsa', 'All States / Nationwide'
  ],
  'United States': [
    'California (Los Angeles/SF)', 'New York (NYC)', 'Texas (Houston/Dallas)', 'Florida (Miami)', 
    'Illinois (Chicago)', 'Pennsylvania (Philly)', 'Georgia (Atlanta)', 'Ohio', 'North Carolina', 'Michigan (Detroit)', 
    'New Jersey', 'Virginia', 'Washington (Seattle)', 'Massachusetts (Boston)', 'Arizona (Phoenix)', 'Indiana', 
    'Tennessee', 'Maryland', 'Missouri', 'Wisconsin', 'Colorado (Denver)', 'Minnesota', 'South Carolina', 'Alabama', 
    'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Nevada (Las Vegas)', 'Iowa', 'Arkansas', 
    'Mississippi', 'Kansas', 'New Mexico', 'Nebraska', 'Idaho', 'West Virginia', 'Hawaii', 'New Hampshire', 'Maine', 
    'Montana', 'Rhode Island', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming', 'All States / Nationwide'
  ],
  'Canada': [
    'Ontario (Toronto/Ottawa)', 'Quebec (Montreal)', 'British Columbia (Vancouver)', 
    'Alberta (Calgary/Edmonton)', 'Manitoba (Winnipeg)', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 
    'Newfoundland & Labrador', 'Prince Edward Island', 'All Provinces / Nationwide'
  ],
  'Germany': [
    'Berlin', 'Bavaria (Munich)', 'North Rhine-Westphalia (Cologne/Dusseldorf)', 
    'Baden-Württemberg (Stuttgart)', 'Hesse (Frankfurt)', 'Hamburg', 'Saxony', 'Lower Saxony', 'All States / Nationwide'
  ],
  'Finland': [
    'Uusimaa (Helsinki)', 'Pirkanmaa (Tampere)', 'Varsinais-Suomi (Turku)', 
    'North Ostrobothnia (Oulu)', 'Central Finland', 'All Regions / Nationwide'
  ],
  'France': [
    'Île-de-France (Paris)', 'Auvergne-Rhône-Alpes (Lyon)', 
    'Provence-Alpes-Côte d\'Azur (Marseille/Nice)', 'Occitanie (Toulouse)', 'Nouvelle-Aquitaine (Bordeaux)', 'All Regions / Nationwide'
  ],
  'Australia': [
    'New South Wales (Sydney)', 'Victoria (Melbourne)', 'Queensland (Brisbane)', 
    'Western Australia (Perth)', 'South Australia (Adelaide)', 'Tasmania', 'Australian Capital Territory (Canberra)', 'All States / Nationwide'
  ],
  'Italy': [
    'Lombardy (Milan)', 'Lazio (Rome)', 'Campania (Naples)', 'Veneto (Venice)', 
    'Piedmont (Turin)', 'Tuscany (Florence)', 'All Regions / Nationwide'
  ],
  'Spain': [
    'Community of Madrid (Madrid)', 'Catalonia (Barcelona)', 'Andalusia (Seville/Malaga)', 
    'Valencian Community (Valencia)', 'Basque Country (Bilbao)', 'All Regions / Nationwide'
  ],
  'South Africa': [
    'Gauteng (Johannesburg/Pretoria)', 'Western Cape (Cape Town)', 
    'KwaZulu-Natal (Durban)', 'Eastern Cape', 'Free State', 'All Provinces / Nationwide'
  ],
  'Ghana': [
    'Greater Accra (Accra)', 'Ashanti (Kumasi)', 'Western Region', 'Eastern Region', 
    'Central Region', 'Northern Region', 'All Regions / Nationwide'
  ],
  'Kenya': [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'All Counties / Nationwide'
  ],
  'United Arab Emirates': [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'All Emirates / Nationwide'
  ],
  'Saudi Arabia': [
    'Riyadh', 'Makkah (Jeddah)', 'Eastern Province (Dammam)', 'Madinah', 'All Provinces / Nationwide'
  ],
  'India': [
    'Maharashtra (Mumbai)', 'Delhi NCR', 'Karnataka (Bengaluru)', 
    'Tamil Nadu (Chennai)', 'Telangana (Hyderabad)', 'West Bengal (Kolkata)', 'All States / Nationwide'
  ],
  'Brazil': [
    'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'All States / Nationwide'
  ],
  'Worldwide / Global': [
    'All Global Cities & Regions (Global Audience)'
  ]
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Shipping Calculator state
  const [country, setCountry] = useState('United Kingdom');
  const [state, setState] = useState('Greater London');
  const [deliveryMethod, setDeliveryMethod] = useState('STANDARD');
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [estimateError, setEstimateError] = useState('');

  const handleCountryChange = (selectedCty) => {
    setCountry(selectedCty);
    const availableStates = COUNTRY_STATE_DATA[selectedCty] || ['All Regions / Nationwide'];
    setState(availableStates[0]);
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleEstimate = async () => {
    if (!product) return;
    setEstimateLoading(true);
    setEstimateError('');
    setEstimate(null);

    try {
      const res = await api.post('/products/estimate', {
        items: [{ product: product._id, quantity }],
        country,
        state,
        delivery_method: deliveryMethod
      });
      setEstimate(res.data);
    } catch (err) {
      setEstimateError(err.response?.data?.error || 'Failed to calculate delivery fee');
    } finally {
      setEstimateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <span className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 mx-auto text-amber-500" />
        <h3 className="text-xl font-bold">Product not found</h3>
        <Link to="/shop" className="text-violet-500 font-bold hover:underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* breadcrumbs */}
      <nav className="text-xs text-slate-400 font-semibold space-x-2">
        <Link to="/shop" className="hover:text-slate-600">Marketplace</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px] inline-block align-bottom">{product.name}</span>
      </nav>

      {/* Main product box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Packaging details */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <span className="text-slate-400 font-medium">Weight</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{product.weight_kg} kg</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Package Type</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1 uppercase">{product.package_type}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Fragile Package</span>
              <p className={`font-bold mt-1 ${product.fragile ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {product.fragile ? 'YES' : 'NO'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Title, pricing & action */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold uppercase tracking-wider">{product.category?.name}</span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{product.name}</h1>
            <p className="text-xs text-slate-400">SKU: {product.sku}</p>
          </div>

          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <span className="text-xs text-slate-400 uppercase font-semibold">Authoritative Price</span>
            <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-1">{product.price_coins.toLocaleString()} COINS</div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>

          {/* Surcharges warning flags */}
          {(product.fragile || product.restricted) && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs rounded-2xl space-y-1">
              <span className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 shrink-0" /> Shipping Disclosures</span>
              <p className="leading-relaxed">
                {product.fragile && 'This package is fragile. A fragile handling surcharge will be added dynamically by the logistics rules.'}
                {product.restricted && ' Restricted item. Subject to custom inspection delays.'}
              </p>
            </div>
          )}

          {/* Action box */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400">Quantity</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none"
                >
                  {[...Array(Math.min(10, product.stock)).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-grow pt-5">
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/cart');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-violet-500/25 transition flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" /> ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Shipping Calculator Widget */}
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
            <Calculator className="w-5 h-5 text-violet-500" /> Interactive Shipping Calculator
          </h3>
          <p className="text-xs text-slate-400">Calculate delivery estimates for this quantity before checking out</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Destination Country</label>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 dark:text-slate-100"
            >
              {Object.keys(COUNTRY_STATE_DATA).map((cty) => (
                <option key={cty} value={cty}>{cty}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">State / Province / City</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 dark:text-slate-100"
            >
              {(COUNTRY_STATE_DATA[country] || ['All Regions / Nationwide']).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Logistics Speed</label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
            >
              <option value="STANDARD">Standard Forwarding</option>
              <option value="EXPRESS">Express Priority Forwarding</option>
            </select>
          </div>

          <button
            onClick={handleEstimate}
            disabled={estimateLoading}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Truck className="w-4 h-4" /> CALCULATE ESTIMATE
          </button>
        </div>

        {/* Calculation Result */}
        {estimateLoading && (
          <div className="text-center py-4 text-xs text-slate-400">Calculating...</div>
        )}

        {estimateError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl">{estimateError}</div>
        )}

        {estimate && (
          <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-950 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Calculation Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-400">Product subtotal</span>
                <p className="font-bold text-slate-800 dark:text-white mt-1">{estimate.subtotal_coins.toLocaleString()} COINS</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-400">Estimated delivery fee</span>
                <p className="font-bold text-slate-800 dark:text-white mt-1">{estimate.delivery_fee_coins.toLocaleString()} COINS</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-400">Handling surcharges</span>
                <p className="font-bold text-slate-800 dark:text-white mt-1">{estimate.handling_fee_coins.toLocaleString()} COINS</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Authoritative Total</span>
                <p className="font-black text-emerald-500 dark:text-emerald-400 mt-1 text-sm">{estimate.total_coins.toLocaleString()} COINS</p>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Applied pricing rules zone: <strong className="text-slate-500">{JSON.stringify(estimate.appliedRule)}</strong>. Calculations occur on the backend and are valid for immediate purchase. Surcharges apply for {product.fragile ? 'fragile handling,' : ''} package weight ({estimate.total_weight_kg}kg), and delivery speed.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
