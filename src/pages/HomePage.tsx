import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { ArrowRight, Sparkles, Layers, ShieldCheck, Flame, Zap, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const publishedProducts = products.filter((p) => p.published && !p.archived);
  const bestsellers = publishedProducts.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = publishedProducts.filter((p) => p.isNew).slice(0, 4);

  const filteredForGrid = activeCategory === 'all'
    ? publishedProducts
    : publishedProducts.filter((p) => p.category === activeCategory);

  const categoryCards = [
    {
      id: 'mousepads',
      label: 'Desk Mats',
      subtitle: 'Micro-woven 900x400mm',
      image: '/src/assets/images/product_desk_mousepad_1793982914309.jpg',
      count: publishedProducts.filter((p) => p.category === 'mousepads').length,
    },
    {
      id: 'keychains',
      label: 'Forged Keychains',
      subtitle: 'Alloy & 550 Paracord',
      image: '/src/assets/images/product_metal_keychain_1793982916309.jpg',
      count: publishedProducts.filter((p) => p.category === 'keychains').length,
    },
    {
      id: 'magnets',
      label: 'Fridge Magnets',
      subtitle: 'N52 Neodymium Holds',
      image: '/src/assets/images/product_fridge_magnets_1793982916050.jpg',
      count: publishedProducts.filter((p) => p.category === 'magnets').length,
    },
    {
      id: 'accessories',
      label: 'EDC Essentials',
      subtitle: 'Aluminum & Canvas',
      image: '/src/assets/images/product_urban_cardholder_1793982916522.jpg',
      count: publishedProducts.filter((p) => p.category === 'accessories').length,
    },
  ];

  const categoryTabOptions = [
    { id: 'all', label: 'All Merch', count: publishedProducts.length },
    { id: 'mousepads', label: 'Desk Mats', count: publishedProducts.filter((p) => p.category === 'mousepads').length },
    { id: 'keychains', label: 'Keychains', count: publishedProducts.filter((p) => p.category === 'keychains').length },
    { id: 'magnets', label: 'Fridge Magnets', count: publishedProducts.filter((p) => p.category === 'magnets').length },
    { id: 'accessories', label: 'EDC Gear', count: publishedProducts.filter((p) => p.category === 'accessories').length },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* 1. Promotional Campaign Banner (Stylish, Modern Lifestyle Brand Aesthetic) */}
      <section className="relative w-full bg-white border-b border-neutral-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Editorial Copy */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/60 px-3 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                <span>Drop 04 · Now Available</span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[44px] text-neutral-950 tracking-tight leading-[1.12] text-balance">
                Tactile merchandise crafted for inspired workstations.
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md font-normal">
                Precision 900x400mm desk mats, stone-tumbled alloy keychains, and brutalist art magnets designed for everyday life and creator setups.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/shop"
                  className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3.5 px-7 rounded-full flex items-center gap-2 transition-all shadow-xs hover:shadow active:scale-98 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/shop?category=mousepads"
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 text-xs font-semibold py-3.5 px-6 rounded-full transition-all"
                >
                  View Desk Mats
                </Link>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                  <Zap size={14} className="text-amber-500" /> Dispatched within 24 hours
                </span>
                <span>·</span>
                <span>Complimentary Delivery &gt; ₹999</span>
              </div>
            </div>

            {/* Campaign Product Imagery */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm group">
                <img
                  src="/src/assets/images/hero_campaign_banner_1793982914350.jpg"
                  alt="Inkvistaar tactile merchandise and desk mats"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end text-xs text-white font-medium">
                  <span className="tracking-wide">Inkvistaar Studio Archive</span>
                  <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    Series 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Category Discovery Strip */}
      <section className="border-b border-neutral-200/80 bg-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-neutral-500">
              Curated Collections
            </h3>
            <Link
              to="/shop"
              className="text-xs font-semibold text-neutral-900 hover:text-black hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryCards.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative flex flex-col p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 hover:bg-white transition-all duration-300 hover:shadow-sm"
              >
                <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-neutral-200 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-display font-semibold text-[15px] text-neutral-900 group-hover:text-black transition-colors">
                    {cat.label}
                  </h4>
                  <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-700 transition-colors">
                    {cat.count} items
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{cat.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider">
              <Flame size={14} className="text-amber-500" />
              <span>Community Favorites</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
              Top Bestsellers
            </h2>
          </div>
          <Link
            to="/shop?sort=popularity"
            className="text-xs font-semibold text-neutral-700 hover:text-black transition-colors flex items-center gap-1.5"
          >
            <span>See All Bestsellers</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Marquee Brand Ticker */}
      <div className="bg-neutral-950 text-neutral-200 py-3 overflow-hidden border-y border-neutral-800">
        <div className="animate-marquee whitespace-nowrap text-xs font-medium tracking-wide uppercase flex gap-8">
          <span>· Drop 04 Archive Live</span>
          <span>· 4mm Precision Cushioned Desk Mats</span>
          <span>· Aerospace Grade Stone-Tumbled Alloys</span>
          <span>· Rare-Earth N52 Neodymium Holds</span>
          <span>· Pan-India 24H Express Shipping</span>
          <span>· Inkvistaar Lifestyle Merch</span>
          <span>· Drop 04 Archive Live</span>
          <span>· 4mm Precision Cushioned Desk Mats</span>
          <span>· Aerospace Grade Stone-Tumbled Alloys</span>
          <span>· Rare-Earth N52 Neodymium Holds</span>
          <span>· Pan-India 24H Express Shipping</span>
          <span>· Inkvistaar Lifestyle Merch</span>
        </div>
      </div>

      {/* 5. Interactive Discovery with Clean Filter Tabs */}
      <section className="bg-white border-b border-neutral-200/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <Layers size={14} />
                <span>Explore Catalog</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
                The Inkvistaar Lineup
              </h2>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-neutral-100 p-1.5 rounded-full border border-neutral-200">
              {categoryTabOptions.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredForGrid.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3.5 px-8 rounded-full transition-all shadow-xs hover:shadow"
            >
              <span>Browse Full Collection ({publishedProducts.length} Items)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Craftsmanship & Studio Transparency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-neutral-200 bg-white rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs text-amber-700 uppercase font-semibold tracking-wider">
              Zero Shortcuts · Heavy Utility
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight leading-snug">
              Physical merchandise made for daily wear and workstation life.
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-xl font-normal">
              We design accessories that spend years in your pockets and on your desks. Desk mats engineered with high-density natural rubber and 360° perimeter anti-fray stitching so edges never peel. Keychains cast from solid zinc alloys and stone-tumbled for an authentic tactile patina.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-950 block font-semibold text-sm">4mm Density</span>
                <span className="text-neutral-500 font-normal">Cushioned rubber core</span>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-950 block font-semibold text-sm">N52 Neodymium</span>
                <span className="text-neutral-500 font-normal">Rare earth magnet hold</span>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-950 block font-semibold text-sm">550 Paracord</span>
                <span className="text-neutral-500 font-normal">Mil-spec braided weave</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/src/assets/images/product_metal_keychain_1793982916309.jpg"
              alt="Forged keychain close-up craftsmanship"
              className="w-full aspect-4/3 object-cover rounded-xl border border-neutral-200 shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* 7. New Arrivals Showcase */}
      {newArrivals.length > 0 && (
        <section className="border-t border-neutral-200/80 bg-neutral-50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Fresh Inventory
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
                  New Arrivals
                </h2>
              </div>
              <Link
                to="/shop?sort=newest"
                className="text-xs font-semibold text-neutral-700 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <span>View All New</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
