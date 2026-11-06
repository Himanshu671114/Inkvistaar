import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query sync
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'popularity';

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    categoryParam || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>(
    (sortParam as any) || 'popularity'
  );
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam !== undefined) setSearchQuery(searchParam);
    if (sortParam) setSortBy(sortParam as any);
  }, [categoryParam, searchParam, sortParam]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.published && !p.archived)
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }
        // Price limit
        const activePrice = p.salePrice ?? p.price;
        if (activePrice > maxPrice) {
          return false;
        }
        // Stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.popularity - a.popularity;
      });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const handleCategorySelect = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(2000);
    setInStockOnly(false);
    setSortBy('popularity');
    setSearchParams({});
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    maxPrice < 2000 ||
    inStockOnly ||
    sortBy !== 'popularity';

  const categoryOptions: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Merch' },
    { id: 'mousepads', label: 'Desk Mats' },
    { id: 'keychains', label: 'Forged Keychains' },
    { id: 'magnets', label: 'Fridge Magnets' },
    { id: 'accessories', label: 'EDC Gear' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase text-amber-700 font-semibold tracking-wider">
                Merchandise Archive
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
                {selectedCategory === 'all'
                  ? 'All Store Merchandise'
                  : categoryOptions.find((c) => c.id === selectedCategory)?.label}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Showing <span className="text-neutral-950 font-bold">{filteredProducts.length}</span> items
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Control Bar (Search, Sorting, Mobile Filter Trigger) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white border border-neutral-200/90 rounded-2xl p-3 shadow-xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs pl-10 pr-8 py-2.5 rounded-full focus:outline-none focus:border-neutral-950 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                aria-label="Clear search text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-900 text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {isFiltered && '•'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs py-2 px-3.5 rounded-full focus:outline-none focus:border-neutral-950 cursor-pointer font-medium"
              >
                <option value="popularity">Popularity (High Demand)</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs uppercase font-semibold text-neutral-900 tracking-wider">
                  Filter Catalog
                </span>
                {isFiltered && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-amber-700 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase text-neutral-400 font-semibold mb-3 tracking-wider">
                  Category
                </h4>
                <div className="space-y-1">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-between cursor-pointer font-medium ${
                        selectedCategory === cat.id
                          ? 'bg-neutral-950 text-white font-semibold'
                          : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[11px] tabular-nums font-normal">
                        {cat.id === 'all'
                          ? products.filter((p) => p.published).length
                          : products.filter((p) => p.published && p.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-neutral-100 pt-5">
                <div className="flex justify-between items-center text-xs text-neutral-600 mb-2 font-medium">
                  <span>Max Price</span>
                  <span className="text-neutral-950 font-bold tabular-nums">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={2000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-neutral-950 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>₹400</span>
                  <span>₹2,000</span>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="border-t border-neutral-100 pt-5">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-neutral-950 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Quality Assurance Statement */}
            <div className="p-4.5 bg-white border border-neutral-200/90 rounded-2xl text-neutral-600 text-xs space-y-1.5 shadow-xs">
              <span className="text-neutral-950 font-semibold tracking-normal block text-xs">
                Inkvistaar Guarantee
              </span>
              <p className="text-xs leading-relaxed text-neutral-500 font-normal">
                All merchandise is inspected before dispatch. No cheap plastics, no false claims. 100% authentic lifestyle accessories.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <Search size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-950">No products found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto font-normal">
                  No merchandise matched your active search or filters. Try adjusting price range or clearing keywords.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-6 rounded-full transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white p-6 h-full flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-display font-bold text-neutral-950">
                  Filter Merch
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-neutral-500 hover:text-black p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase text-neutral-400 font-semibold mb-2">Category</h4>
                <div className="space-y-1">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg flex justify-between font-medium ${
                        selectedCategory === cat.id
                          ? 'bg-neutral-950 text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="flex justify-between text-xs text-neutral-600 mb-2 font-medium">
                  <span>Max Price</span>
                  <span className="text-neutral-950 font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={2000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-neutral-950"
                />
              </div>

              {/* Stock */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-neutral-950 rounded"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-neutral-950 text-white text-xs font-semibold py-3 rounded-full"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full border border-neutral-300 text-neutral-700 text-xs font-medium py-2.5 rounded-full"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
