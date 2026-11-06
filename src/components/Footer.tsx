import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Shield, Truck, RotateCcw, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('Subscribed to drop alerts!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-sm border-t border-neutral-800">
      {/* Brand Guarantees / Service Strip */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
              <Truck size={18} className="text-amber-400" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm">Express Pan-India Logistics</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Dispatched within 24 hours. Free delivery on orders above ₹999.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
              <Shield size={18} className="text-amber-400" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm">Studio Engineered Quality</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Aerospace-grade zinc alloys, micro-woven fabrics, and heavy neodymium magnets.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="text-amber-400" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm">7-Day Easy Replacements</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Hassle-free replacement for any transit damage or manufacturing discrepancy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Mission */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              Inkvistaar
            </span>
            <span className="w-2 h-2 bg-amber-400 rounded-full inline-block"></span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
            Tactile merchandise and modern desk accessories designed for creators, daily carry, and inspired workstations.
          </p>
          <div className="pt-2">
            <p className="text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
              Subscribe for Drop Alerts & Limited Editions
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-neutral-800 border border-neutral-700 text-white text-xs px-3.5 py-2.5 rounded-l-lg focus:outline-none focus:border-amber-400 flex-1 placeholder:text-neutral-500 font-normal"
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase px-5 py-2.5 rounded-r-lg transition-colors cursor-pointer shrink-0"
              >
                {subscribed ? <Check size={14} className="text-emerald-700" /> : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="text-xs uppercase tracking-wider text-neutral-200 font-semibold">Collections</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/shop?category=mousepads" className="text-neutral-400 hover:text-white transition-colors">
                Desk Mats (XL)
              </Link>
            </li>
            <li>
              <Link to="/shop?category=keychains" className="text-neutral-400 hover:text-white transition-colors">
                Forged Keychains
              </Link>
            </li>
            <li>
              <Link to="/shop?category=magnets" className="text-neutral-400 hover:text-white transition-colors">
                Fridge Magnets
              </Link>
            </li>
            <li>
              <Link to="/shop?category=accessories" className="text-neutral-400 hover:text-white transition-colors">
                EDC Cardholders
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-medium">
                View All Merch <ArrowUpRight size={11} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="text-xs uppercase tracking-wider text-neutral-200 font-semibold">Customer Support</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/account" className="text-neutral-400 hover:text-white transition-colors">
                My Orders & History
              </Link>
            </li>
            <li>
              <Link to="/account" className="text-neutral-400 hover:text-white transition-colors">
                Saved Addresses
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="text-neutral-400 hover:text-white transition-colors">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <span className="text-neutral-400">care@inkvistaar.com</span>
            </li>
            <li>
              <span className="text-neutral-400">+91 (080) 4120-9944</span>
            </li>
          </ul>
        </div>

        {/* Store Policies */}
        <div className="md:col-span-3 space-y-3">
          <h5 className="text-xs uppercase tracking-wider text-neutral-200 font-semibold">Store Policies</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="text-neutral-400">Domestic Delivery: 2–4 Business Days</span>
            </li>
            <li>
              <span className="text-neutral-400">Payment Modes: UPI, Cards, Netbanking, COD</span>
            </li>
            <li>
              <span className="text-neutral-400">Replacements: 7-Day Doorstep Exchange</span>
            </li>
            <li>
              <span className="text-neutral-500">Studio: Bengaluru, Karnataka 560034</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sub-footer Copyright & Discreet Admin Link */}
      <div className="border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Inkvistaar Merchandise & Co. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Premium Storefront</span>
            <span aria-hidden="true">·</span>
            {/* Discreet Admin entry point */}
            <Link
              to="/admin"
              className="text-neutral-500 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
              title="Store Operations / Admin Dashboard"
            >
              <Lock size={11} />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
