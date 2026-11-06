import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, products, setIsCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Auto-suggestions
  const filteredSuggestions = searchQuery.trim()
    ? products
        .filter((p) => p.published && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              to="/"
              className="font-display font-bold text-2xl sm:text-[26px] tracking-tight text-neutral-950 whitespace-nowrap shrink-0 flex items-center gap-1.5 group"
            >
              <span>Inkvistaar</span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block group-hover:scale-125 transition-transform"></span>
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Refined, Lifestyle Brand Typography) */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium tracking-normal text-neutral-600">
            <Link
              to="/"
              className={`transition-colors py-1 relative ${
                location.pathname === '/'
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </Link>
            <Link
              to="/shop"
              className={`transition-colors py-1 relative ${
                location.pathname === '/shop' && !location.search.includes('category=')
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              All Merch
              {location.pathname === '/shop' && !location.search.includes('category=') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </Link>
            <Link
              to="/shop?category=mousepads"
              className="hover:text-neutral-950 transition-colors py-1 whitespace-nowrap"
            >
              Desk Mats
            </Link>
            <Link
              to="/shop?category=keychains"
              className="hover:text-neutral-950 transition-colors py-1 whitespace-nowrap"
            >
              Keychains
            </Link>
            <Link
              to="/shop?category=magnets"
              className="hover:text-neutral-950 transition-colors py-1 whitespace-nowrap"
            >
              Fridge Magnets
            </Link>
            <Link
              to="/shop?category=accessories"
              className="hover:text-neutral-950 transition-colors py-1 whitespace-nowrap"
            >
              EDC Gear
            </Link>
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              aria-label="Open search dialog"
              title="Search store"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label={`Wishlist (${wishlist.length} saved)`}
              title="View Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-neutral-950 text-[10px] font-semibold flex items-center justify-center rounded-full leading-none shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            <Link
              to="/account"
              className="p-2.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Customer account"
              title="Account & Orders"
            >
              <User size={18} />
            </Link>

            {/* Shopping Cart Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-xs group"
              aria-label={`Shopping bag (${cartCount} items)`}
            >
              <ShoppingBag size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-normal">
                Bag ({cartCount})
              </span>
            </button>
          </div>
        </div>

        {/* Live Search Expandable Bar */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white px-4 py-5 sm:px-8 shadow-lg animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search size={18} className="absolute left-3.5 text-neutral-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search keychains, desk mats, fridge magnets, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm pl-10 pr-28 py-3 rounded-md focus:outline-none focus:border-black focus:bg-white transition-all font-sans placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-neutral-950 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {searchQuery.trim().length > 1 && (
                <div className="mt-3 bg-white border border-neutral-200 rounded-xl shadow-xl p-2 divide-y divide-neutral-100">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3.5 p-2.5 hover:bg-neutral-50 rounded-lg transition-colors group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-11 h-11 object-cover rounded-md bg-neutral-100 border border-neutral-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-amber-700 capitalize">
                            {prod.category}
                          </p>
                          <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-black">
                            {prod.name}
                          </p>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-neutral-900">
                          ₹{prod.salePrice ?? prod.price}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-neutral-500">
                      No matching products for "{searchQuery}". Press Enter to browse full catalog.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="space-y-1 text-base font-medium text-neutral-800">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black border-b border-neutral-100"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black border-b border-neutral-100"
              >
                All Merch
              </Link>
              <Link
                to="/shop?category=mousepads"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black border-b border-neutral-100"
              >
                Desk Mousepads
              </Link>
              <Link
                to="/shop?category=keychains"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black border-b border-neutral-100"
              >
                Keychains & Clips
              </Link>
              <Link
                to="/shop?category=magnets"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black border-b border-neutral-100"
              >
                Fridge Magnets
              </Link>
              <Link
                to="/shop?category=accessories"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black border-b border-neutral-100"
              >
                EDC Accessories
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-neutral-900 hover:text-black"
              >
                My Account & Orders
              </Link>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-500">
              <span className="font-medium">Inkvistaar Studio</span>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-black font-semibold flex items-center gap-1">
                Wishlist ({wishlist.length}) <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
