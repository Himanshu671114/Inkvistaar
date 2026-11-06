import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, User, KeyRound, Eye, EyeOff, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminLoginPage: React.FC = () => {
  const { signIn, signUp, isLoading } = useAdminAuth();

  // If already registered before, show Login. If first time, show Register.
  const hasRegistered = localStorage.getItem('inkvistaar_admin_registered') === 'true';
  const savedAdminRaw = localStorage.getItem('inkvistaar_saved_admin');
  const savedUsername = savedAdminRaw ? JSON.parse(savedAdminRaw).username || '' : '';

  const [isLoginMode, setIsLoginMode] = useState<boolean>(hasRegistered);

  // Form fields
  const [username, setUsername] = useState<string>(isLoginMode ? savedUsername : '');
  const [password, setPassword] = useState<string>('');
  const [againPassword, setAgainPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAgainPassword, setShowAgainPassword] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. First Time Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    if (!username.trim()) {
      setErrorMessage('Please enter a username.');
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setSubmitting(false);
      return;
    }

    if (password !== againPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      setSubmitting(false);
      return;
    }

    // Register and immediately log in to the admin panel
    const res = await signUp(username.trim(), password);
    if (res.success) {
      setSuccessMessage('Admin account registered! Entering panel...');
      // Admin session is active, AdminLayout automatically displays the dashboard
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
    }
    setSubmitting(false);
  };

  // 2. Next Time Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter your username and password.');
      setSubmitting(false);
      return;
    }

    const res = await signIn(username.trim(), password);
    if (res.success) {
      setSuccessMessage('Logged in! Loading admin panel...');
      // Admin session is active, AdminLayout automatically displays the dashboard
    } else {
      setErrorMessage(res.error || 'Incorrect username or password. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-900 shadow-2xs">
            <Lock size={22} />
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 tracking-wider uppercase">
            INKVISTAAR OPS • ADMIN GATEWAY
          </span>
          <h1 className="font-display font-bold text-2xl text-neutral-950 tracking-tight">
            {!isLoginMode ? 'Admin Registration' : 'Admin Login'}
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {!isLoginMode
              ? 'Set up your administrator username and password to initialize the admin panel.'
              : 'Enter your administrator username and password to log in.'}
          </p>
        </div>

        {/* Feedback Message */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 font-medium">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2 font-medium">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* FIRST TIME REGISTRATION FORM */}
        {!isLoginMode ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your admin username"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm pl-10 pr-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm pl-10 pr-14 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 px-1 py-0.5 rounded cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">Again Password</label>
                <button
                  type="button"
                  onClick={() => setShowAgainPassword(!showAgainPassword)}
                  className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showAgainPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showAgainPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showAgainPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={againPassword}
                  onChange={(e) => setAgainPassword(e.target.value)}
                  placeholder="Enter password again"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm pl-10 pr-14 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowAgainPassword(!showAgainPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 px-1 py-0.5 rounded cursor-pointer"
                >
                  {showAgainPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mt-3"
            >
              <span>{submitting ? 'Registering...' : 'Register'}</span>
              <ArrowRight size={14} />
            </button>

            {hasRegistered && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(true);
                    setErrorMessage(null);
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-950 underline font-medium cursor-pointer"
                >
                  Already registered? Switch to login
                </button>
              </div>
            )}
          </form>
        ) : (
          /* NEXT TIME LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm pl-10 pr-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm pl-10 pr-14 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 px-1 py-0.5 rounded cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mt-3"
            >
              <span>{submitting ? 'Logging in...' : 'Login'}</span>
              <ArrowRight size={14} />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(false);
                  setErrorMessage(null);
                }}
                className="text-xs text-neutral-500 hover:text-neutral-950 underline font-medium cursor-pointer"
              >
                Need to register new admin? Register
              </button>
            </div>
          </form>
        )}

        {/* Storefront return link */}
        <div className="pt-2 border-t border-neutral-100 text-center">
          <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-950 font-medium transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
