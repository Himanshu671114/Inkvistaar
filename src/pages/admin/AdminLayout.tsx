import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Database,
  RefreshCw,
  UserCog,
  Settings,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { AdminLoginPage } from './AdminLoginPage';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, profile, isAdmin, isLoading, signOut } = useAdminAuth();
  const { refetchData, isLoadingDb, dbError } = useStore();

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { path: '/admin/products', label: 'Catalog Products', icon: <Package size={15} /> },
    { path: '/admin/orders', label: 'Customer Orders', icon: <ShoppingCart size={15} /> },
    { path: '/admin/settings', label: 'Account Settings', icon: <UserCog size={15} /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-600 text-sm font-medium">
          <RefreshCw size={18} className="animate-spin text-neutral-900" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated or not an admin, render the secure Supabase Admin Login Page
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 font-sans">
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <Link
            to="/"
            className="text-neutral-600 hover:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-tight text-neutral-950">
              INKVISTAAR OPS
            </span>
            <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              Admin Gateway
            </span>
          </div>
        </header>
        <AdminLoginPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 font-sans">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-neutral-600 hover:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Storefront</span>
          </Link>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-tight text-neutral-950">
              INKVISTAAR OPS
            </span>
            <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              Staff Portal
            </span>
          </div>
        </div>

        {/* Supabase status & session controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => refetchData()}
            disabled={isLoadingDb}
            className="hidden md:flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
            title="Sync with Supabase"
          >
            <RefreshCw size={13} className={isLoadingDb ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-full">
            <Database size={13} className="text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Supabase Live</span>
          </div>

          <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
            <Link
              to="/admin/settings"
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors text-right"
              title="Open Account Settings"
            >
              <div className="hidden lg:block text-right">
                <span className="block text-xs font-semibold text-neutral-950 leading-tight">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="block text-[10px] text-neutral-400 capitalize">
                  {profile?.role || 'Admin'}
                </span>
              </div>
              <div className="w-7 h-7 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {(profile?.full_name || user.email || 'A').charAt(0).toUpperCase()}
              </div>
            </Link>

            <button
              onClick={() => signOut()}
              className="text-neutral-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Sign Out of Admin Portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Database error or setup notice if any */}
      {dbError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2 text-xs text-amber-900 flex items-center justify-between">
          <span>
            Database notice: {dbError}. If tables are not yet created, execute the provided <strong>supabase-schema.sql</strong> in your Supabase SQL editor.
          </span>
          <button
            onClick={() => refetchData()}
            className="underline font-semibold ml-2 hover:text-amber-950 cursor-pointer"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Admin Subnav */}
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-8 flex gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold tracking-normal transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-b-2 border-neutral-950 text-neutral-950'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Outlet Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};
