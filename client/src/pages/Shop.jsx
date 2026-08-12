import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, HelpCircle, Package, Layers, Info } from 'lucide-react';
import api from '../services/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState('asc'); // Cheap ones first by default

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 200, order: sortOrder };
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      
      const res = await api.get('/products', { params });
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search, sortOrder]);

  // Helper to group products by category
  const groupedProducts = categories.map(cat => ({
    category: cat,
    items: products.filter(p => p.category?._id === cat._id || p.category?.name === cat.name)
  })).filter(group => group.items.length > 0);

  // If a specific category is selected, or search is active, get flat list
  const activeCategoryName = categories.find(c => c._id === selectedCategory)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Logistics Marketplace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Buy curated goods and forward them to your family abroad instantly using COINS</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="asc">Sort: Cheap First (Low to High)</option>
            <option value="desc">Sort: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Filter Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-500" /> Categories
          </h3>
          <div className="flex flex-wrap lg:flex-col gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 text-left rounded-xl text-xs font-semibold transition flex justify-between items-center ${
                selectedCategory === ''
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>All Categories</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold ml-2">
                {products.length}
              </span>
            </button>
            {categories.map((cat) => {
              const catCount = products.filter(p => p.category?._id === cat._id || p.category?.name === cat.name).length;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold transition flex justify-between items-center ${
                    selectedCategory === cat._id
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{cat.name}</span>
                  {catCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-2 ${
                      selectedCategory === cat._id ? 'bg-violet-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {catCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="hidden lg:block bg-violet-500/5 border border-violet-500/10 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-violet-500 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Note on Delivery</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Add products to your cart to estimate custom clearance and international weight-bracket forwarding fees on the checkout page. All quotes are authoritative.
            </p>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-12">
          {loading ? (
            // Skeleton Grid Loaders
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-4 animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-800 h-44 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            // Empty State
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl space-y-4">
              <Package className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No products found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try searching for another keyword or check another category</p>
            </div>
          ) : selectedCategory !== '' || search !== '' ? (
            // Single Selected Category View
            <div className="space-y-6">
              {activeCategoryName && (
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
                    {activeCategoryName}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">{products.length} products available</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod._id} prod={prod} />
                ))}
              </div>
            </div>
          ) : (
            // Grouped Categories View (All Categories selected)
            groupedProducts.map((group) => (
              <div key={group.category._id} className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
                    {group.category.name}
                  </h2>
                  <button
                    onClick={() => setSelectedCategory(group.category._id)}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    View category ({group.items.length}) →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {group.items.map((prod) => (
                    <ProductCard key={prod._id} prod={prod} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Product Card Component
const ProductCard = ({ prod }) => (
  <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
    <div>
      {/* Image */}
      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
        <img
          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
          alt={prod.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-violet-600 text-white">
          {prod.weight_kg} kg
        </span>
      </div>

      {/* Metadata */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-violet-500">{prod.category?.name}</span>
        <h3 className="font-bold text-slate-800 dark:text-white truncate">{prod.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2rem]">{prod.short_description}</p>
      </div>
    </div>

    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase font-bold">Price</span>
        <strong className="text-emerald-500 dark:text-emerald-400 text-sm font-black">{prod.price_coins.toLocaleString()} COINS</strong>
      </div>
      
      <Link
        to={`/product/${prod._id}`}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition"
      >
        View details
      </Link>
    </div>
  </div>
);

export default Shop;
