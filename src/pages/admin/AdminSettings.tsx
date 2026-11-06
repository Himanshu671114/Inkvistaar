import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  User,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Lock,
  Calendar,
  LogOut,
  Eye,
  EyeOff,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user, profile, isAdmin, updateEmail, updatePassword, updateAdminProfile, signOut } = useAdminAuth();

  // Full name state
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaving(true);
    setNameMsg(null);

    const res = await updateAdminProfile(fullName);
    if (res.success) {
      setNameMsg({ type: 'success', text: 'Admin name updated successfully.' });
    } else {
      setNameMsg({ type: 'error', text: res.error || 'Failed to update name.' });
    }
    setNameSaving(false);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSaving(true);
    setEmailMsg(null);

    if (newEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      setEmailMsg({ type: 'error', text: 'The new email must be different from your current email.' });
      setEmailSaving(false);
      return;
    }

    const res = await updateEmail(newEmail);
    if (res.success) {
      setEmailMsg({
        type: 'success',
        text:
          res.message ||
          'Verification email sent. Please check both your current and new inbox to confirm the update.',
      });
      setNewEmail('');
    } else {
      setEmailMsg({ type: 'error', text: res.error || 'Failed to update email.' });
    }
    setEmailSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    setPwMsg(null);

    if (newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      setPwSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match. Please verify and retype.' });
      setPwSaving(false);
      return;
    }

    const res = await updatePassword(newPassword);
    if (res.success) {
      setPwMsg({ type: 'success', text: 'Password changed successfully. Your new password is now active.' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPwMsg({ type: 'error', text: res.error || 'Failed to change password.' });
    }
    setPwSaving(false);
  };

  const createdAtFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Active';

  const lastSignInFormatted = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent session';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Identity & Access Management
          </span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={12} />
            Supabase Protected
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl text-neutral-950 tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your administrator profile, registered email address, and login credentials securely.
        </p>
      </div>

      {/* Admin Profile Overview Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-display font-bold text-xl shrink-0 shadow-xs">
              {(profile?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-lg text-neutral-950">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </h2>
                <span className="bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {profile?.role || (isAdmin ? 'Admin' : 'Staff')}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5 flex items-center gap-1.5">
                <Mail size={13} className="text-neutral-400" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-400 block mb-1">Permanent Admin UUID</span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-neutral-700 truncate" title={user?.id}>
                {user?.id ? `${user.id.slice(0, 14)}...` : 'N/A'}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-neutral-500 hover:text-neutral-950 p-1 rounded hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                title="Copy full UUID"
              >
                {copiedId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-400 block mb-1">Account Created</span>
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <Calendar size={13} className="text-neutral-400 shrink-0" />
              <span>{createdAtFormatted}</span>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-400 block mb-1">Last Sign In</span>
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              <span>{lastSignInFormatted}</span>
            </div>
          </div>
        </div>

        {/* Security Role Isolation Notice */}
        <div className="mt-5 p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl flex items-start gap-2.5 text-xs text-neutral-600">
          <Info size={16} className="text-neutral-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Role Isolation Architecture:</strong> Your administrative permissions are anchored to your permanent UUID in the <code className="font-mono text-neutral-950 bg-white px-1.5 py-0.5 rounded border border-neutral-200">public.profiles</code> table. Updating your registered email address or changing your password will <strong>never</strong> revoke or reset your administrator permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Admin Profile Details */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-neutral-900" />
              <h3 className="font-display font-bold text-sm text-neutral-950">
                Personal Information
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Update how your name appears on internal order fulfillment logs and audit trails.
            </p>

            {nameMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 mb-4 font-medium ${
                  nameMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {nameMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{nameMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Display Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Inkvistaar Admin"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Current Email (Login Username)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-neutral-100 border border-neutral-200 text-neutral-500 text-sm px-3.5 py-2.5 rounded-xl cursor-not-allowed font-mono text-xs"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  To modify this address, use the Change Email section below.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={nameSaving}
                  className="bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {nameSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 2: Change Email Address */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} className="text-neutral-900" />
              <h3 className="font-display font-bold text-sm text-neutral-950">
                Change Email Address
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Update the primary email used for login and critical automated store alerts.
            </p>

            {emailMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 mb-4 font-medium ${
                  emailMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {emailMsg.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                <span className="leading-snug">{emailMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  New Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new-admin@inkvistaar.com"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert size={14} className="shrink-0 text-amber-700 mt-0.5" />
                <span>
                  Supabase Authentication requires email verification. A confirmation link will be delivered to both your current address and new address.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={emailSaving || !newEmail.trim()}
                  className="bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {emailSaving ? 'Sending Verification...' : 'Send Verification & Update Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Card 3: Change Password */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound size={17} className="text-neutral-900" />
          <h3 className="font-display font-bold text-sm text-neutral-950">
            Change Admin Password
          </h3>
        </div>
        <p className="text-xs text-neutral-500 mb-5">
          Update your secret access password. Passwords are salted and encrypted directly via Supabase Auth and never stored in plain database records.
        </p>

        {pwMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 mb-5 font-medium ${
              pwMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {pwMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{pwMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
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

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={pwSaving || !newPassword || !confirmPassword}
              className="bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {pwSaving ? 'Updating Password...' : 'Save New Password'}
            </button>
            <span className="text-[11px] text-neutral-400">
              Minimum 6 characters recommended with alphanumeric symbols.
            </span>
          </div>
        </form>
      </div>

      {/* Card 4: Administrator Privileges & Security Architecture */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={17} className="text-neutral-900" />
          <h3 className="font-display font-bold text-sm text-neutral-950">
            Security & Assigning Administrators
          </h3>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          INKVISTAAR enforces high-standard security with Supabase Row Level Security (RLS) policies. Public visitors are prohibited from self-registering as store administrators. Only accounts explicitly granted the <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-950 font-mono text-[11px]">admin</code> role in the database can manage products, modify inventory, or inspect customer orders.
        </p>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 font-mono text-xs text-neutral-800 overflow-x-auto space-y-2">
          <span className="text-[10px] text-neutral-400 block font-sans font-semibold uppercase tracking-wider">
            SQL Command to Designate / Grant Admin Role:
          </span>
          <pre className="text-[11px] text-neutral-900 leading-relaxed">
{`-- Execute in Supabase SQL Editor to grant admin access to a team member:
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('<USER_AUTH_UUID>', 'teammate@inkvistaar.com', 'Staff Member', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';`}
          </pre>
        </div>
      </div>
    </div>
  );
};
