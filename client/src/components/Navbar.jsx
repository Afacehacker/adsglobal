import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCartStore } from '../store/cartStore';
import { Sun, Moon, ShoppingCart, User, LogOut, Menu, X, Wallet, Megaphone, ShieldAlert, LifeBuoy } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setBalance(res.data.wallet.balance);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error('Fetch me failed', err);
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, [location, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
    isActive(path) 
      ? 'bg-violet-600/10 text-violet-600 dark:text-violet-400 font-semibold' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:dark:hover:bg-slate-800'
  }`;

  const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'DELIVERY_MANAGER', 'ADVERTISING_MANAGER', 'SUPPORT'];

  return (
    <nav className="sticky top-0 z-50 glass dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-emerald-500">
              ADSGLOBAL
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/shop" className={linkClass('/shop')}>Marketplace</Link>
            {token && (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                <Link to="/wallet" className={linkClass('/wallet')}>Wallet</Link>
                <Link to="/campaigns" className={linkClass('/campaigns')}>Ad Agency</Link>
                <Link to="/support" className={linkClass('/support')}>Support</Link>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Icon */}
            {token && (
              <Link to="/cart" className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center font-bold rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Auth Section */}
            {token && user ? (
              <div className="flex items-center space-x-3">
                {/* Coins readout */}
                <Link to="/wallet" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{balance.toLocaleString()} COINS</span>
                </Link>

                {/* Admin dashboard shortcut if applicable */}
                {adminRoles.includes(user.role) && (
                  <Link to="/admin" className="p-2 rounded-lg text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 transition" title="Admin Portal">
                    <ShieldAlert className="w-5 h-5" />
                  </Link>
                )}

                {/* Profile readout & logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">{user.name}</span>
                  <button onClick={handleLogout} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 shadow-sm transition">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 dark:text-slate-400">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {token && (
              <Link to="/cart" className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-4 space-y-3">
          <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300 hover:text-white">Marketplace</Link>
          {token ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300 hover:text-white">Dashboard</Link>
              <Link to="/wallet" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300 hover:text-white">Wallet</Link>
              <Link to="/campaigns" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300 hover:text-white">Ad Agency</Link>
              <Link to="/support" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300 hover:text-white">Support</Link>
              {user && adminRoles.includes(user.role) && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 text-amber-500 hover:text-amber-400">Admin Panel</Link>
              )}
              {user && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5" />
                    <span>Logged in as: <strong className="text-slate-700 dark:text-slate-300">{user.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Balance: {balance.toLocaleString()} COINS</span>
                  </div>
                  <button onClick={handleLogout} className="mt-2 w-full py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg text-sm transition">
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-2 text-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full py-2 text-center text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
