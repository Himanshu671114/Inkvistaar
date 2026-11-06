import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { KeyRound, Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const AdminResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword, user } = useAdminAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState(false);

  useEffect(() => {
    // Check if recovery token is present in URL hash or session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecoverySessionReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setIsRecoverySessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (newPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your input.');
      setIsSubmitting(false);
      return;
    }

    const res = await updatePassword(newPassword);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2500);
    } else {
      setErrorMessage(res.error || 'Failed to update password. Your recovery link may have expired.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-900 shadow-2xs">
            <KeyRound size={22} />
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 tracking-wider uppercase">
            Security Gateway
          </span>
          <h1 className="font-display font-bold text-2xl text-neutral-950 tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Choose a strong, secure password for your administrator account.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 font-medium">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-display font-bold text-base text-neutral-950">
              Password Changed Successfully!
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Your administrator password has been updated in Supabase Auth. Redirecting you to the admin portal...
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs py-3 px-6 rounded-full transition-all"
              >
                <span>Go to Admin Portal</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {user?.email && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs flex items-center justify-between">
                <span className="text-neutral-500">Resetting for account:</span>
                <span className="font-mono font-medium text-neutral-900">{user.email}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newPassword || !confirmPassword}
              className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>{isSubmitting ? 'Updating Password...' : 'Save & Activate Password'}</span>
              <ArrowRight size={14} />
            </button>

            <div className="text-center pt-2">
              <Link to="/admin" className="text-xs text-neutral-500 hover:text-neutral-950 font-medium">
                ← Back to Admin Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
