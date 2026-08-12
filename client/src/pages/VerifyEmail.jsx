import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Read email passed from Register / Login or localStorage
    const stateEmail = location.state?.email || localStorage.getItem('pendingVerificationEmail') || '';
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      // If no email, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/verify-email', {
        email,
        otp: otp.trim()
      });

      setMessage('Email verified successfully! Redirecting to dashboard...');
      localStorage.removeItem('pendingVerificationEmail');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Verification failed. Please check the 6-digit code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0 || resending) return;

    setResending(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/resend-otp', { email });
      setMessage(res.data.message || 'A new 6-digit verification code has been sent to your email.');
      setResendCountdown(60); // 60 seconds cooldown
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto text-violet-600 dark:text-violet-400">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Verify Your Email</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We sent a 6-digit verification code to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2 text-center">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Enter 6-Digit Code
            </label>
            <div className="relative max-w-xs mx-auto">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-violet-600 dark:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                required
              />
            </div>

            {/* Verification Code Helper Badge */}
            {(location.state?.otpCode || localStorage.getItem('pendingOTPCode')) && (
              <div className="mt-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Your Verification Code:</span>
                <button
                  type="button"
                  onClick={() => setOtp(location.state?.otpCode || localStorage.getItem('pendingOTPCode'))}
                  className="font-black text-violet-600 dark:text-violet-400 text-lg tracking-widest hover:underline cursor-pointer"
                >
                  {location.state?.otpCode || localStorage.getItem('pendingOTPCode')}
                </button>
                <span className="text-[10px] text-violet-500 block font-semibold mt-0.5">(Click to auto-fill)</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-violet-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                VERIFY & COMPLETE REGISTRATION <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Didn't receive the verification code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendCountdown > 0 || resending}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            {resendCountdown > 0 ? `Resend Code in ${resendCountdown}s` : 'Resend Verification Code'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Wrong email address?{' '}
          <Link to="/register" className="text-violet-600 hover:underline font-bold">
            Back to Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
