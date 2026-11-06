import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, Plus, Minus, Check, Truck, Shield, ArrowRight, Share2, Sparkles } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    recentlyViewed,
    showToast,
  } = useStore();

  const product = products.find((p) => p.slug === slug && p.published && !p.archived) || products.find((p) => p.slug === slug);

  // Variant selections
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'shipping'>('specs');

  // Track recently viewed & initialize variants
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedImageIndex(0);
      setQuantity(1);

      // Default variant setup
      if (product.variants) {
        const initialVariants: Record<string, string> = {};
        product.variants.forEach((v) => {
          initialVariants[v.name] = v.options[0];
        });
        setSelectedVariants(initialVariants);
      }
      window.scrollTo(0, 0);
    }
  }, [slug, product?.id]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#fafafa] text-center">
        <h2 className="font-display font-bold text-2xl text-neutral-950">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2 mb-6 font-normal">
          The requested merchandise may have been archived or moved.
        </p>
        <Link
          to="/shop"
          className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-6 rounded-full"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const activePrice = product.salePrice ?? product.price;
  const isOutOfStock = product.stock <= 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariants, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariants, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard');
  };

  // Related products (same category, excluding self)
  const relatedProducts = products
    .filter((p) => p.published && p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Recently viewed products (excluding self)
  const recentProductsList = products.filter(
    (p) => p.published && recentlyViewed.includes(p.id) && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 lg:pb-16">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 flex items-center gap-2 font-medium">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-black capitalize font-semibold transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-4/3 w-full bg-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 bg-neutral-950 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-neutral-950 ring-2 ring-neutral-950/20 scale-103'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-24 shadow-xs">
            {/* Category, Status & Share */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-700 font-semibold capitalize tracking-normal">
                {product.category}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`font-medium ${
                    product.stock > 10
                      ? 'text-emerald-700'
                      : product.stock > 0
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Currently Sold Out'}
                </span>
                <button
                  onClick={handleShare}
                  className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                  title="Share product link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Title & Pricing */}
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-[28px] text-neutral-950 tracking-tight leading-snug">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-neutral-950 tabular-nums">
                  ₹{activePrice}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-neutral-400 line-through tabular-nums font-normal">
                      ₹{product.price}
                    </span>
                    <span className="bg-amber-400 text-neutral-950 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-normal">
                Inclusive of all taxes · Express pan-India 24H dispatch
              </p>
            </div>

            {/* Short Description */}
            <p className="text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4 font-normal">
              {product.description}
            </p>

            {/* Variant Selectors */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 border-t border-neutral-100 pt-4">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <div className="flex justify-between items-center text-xs text-neutral-600 mb-2 font-medium">
                      <span className="font-semibold text-neutral-800">{variant.name}</span>
                      <span className="text-neutral-950 font-semibold">
                        {selectedVariants[variant.name]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.name] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleVariantChange(variant.name, opt)}
                            className={`px-4 py-2 text-xs rounded-full transition-all cursor-pointer font-medium border ${
                              isSelected
                                ? 'bg-neutral-950 text-white font-semibold border-neutral-950 shadow-xs'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:border-black'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper & Stock Check */}
            <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800">Select Quantity</span>
              <div className="flex items-center border border-neutral-300 rounded-full bg-white px-1">
                <button
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-xs font-semibold tabular-nums text-neutral-950">
                  {quantity}
                </span>
                <button
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full text-xs font-semibold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow active:scale-98 ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-white'
                }`}
              >
                <span>Add To Bag</span>
                <span className="tabular-nums font-semibold">· ₹{activePrice * quantity}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-200 disabled:text-neutral-400 text-neutral-950 text-xs font-semibold py-3 px-4 rounded-full transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-full border text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer font-semibold ${
                    isFavorited
                      ? 'border-amber-400 text-neutral-950 bg-amber-50'
                      : 'border-neutral-300 text-neutral-700 hover:border-black hover:text-black'
                  }`}
                >
                  <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'text-amber-500' : ''} />
                  <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Guarantee / Shipping Bullet Points */}
            <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs text-neutral-600 font-normal">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-neutral-950 shrink-0" />
                <span>Orders dispatched within 24 hours via Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-neutral-950 shrink-0" />
                <span>Zero plastic packaging · Sealed studio security tape</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs & Features Tabs */}
        <div className="mt-16 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="flex border-b border-neutral-200 bg-neutral-50/50">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-xs tracking-normal transition-colors cursor-pointer font-semibold ${
                activeTab === 'specs'
                  ? 'border-b-2 border-neutral-950 text-neutral-950 bg-white'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-4 text-xs tracking-normal transition-colors cursor-pointer font-semibold ${
                activeTab === 'features'
                  ? 'border-b-2 border-neutral-950 text-neutral-950 bg-white'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              Design Features ({product.features.length})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 text-xs tracking-normal transition-colors cursor-pointer font-semibold ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-neutral-950 text-neutral-950 bg-white'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              Shipping & Care
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="border-b border-neutral-100 pb-2.5 flex justify-between">
                    <span className="text-neutral-500 capitalize">{key}</span>
                    <span className="text-neutral-900 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-3 max-w-2xl">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs text-neutral-700 max-w-2xl leading-relaxed">
                <p>
                  <strong className="text-neutral-950">Domestic Dispatch:</strong> All orders are dispatched from our Bengaluru studio within 24 business hours. Tracking details are automatically notified upon courier pickup.
                </p>
                <p>
                  <strong className="text-neutral-950">Maintenance:</strong> For desk mats, wipe clean with a slightly damp microfiber towel and mild soap; avoid harsh bleach. For brass and zinc alloy keychains, dry immediately if exposed to saltwater.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
                  Pair It With
                </span>
                <h3 className="font-display font-bold text-xl text-neutral-950 mt-1">
                  Related Merchandise
                </h3>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
              >
                <span>Category Catalog</span>
                <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentProductsList.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <h3 className="font-display font-bold text-xl text-neutral-950 mb-6">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProductsList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 flex items-center justify-between gap-3 shadow-xl">
        <div>
          <span className="text-base font-bold text-neutral-950 tabular-nums">
            ₹{activePrice}
          </span>
          <span className="block text-xs text-neutral-500 truncate max-w-[150px] font-medium">
            {product.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="w-10 h-10 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-700"
            aria-label="Save to wishlist"
          >
            <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'text-amber-500' : ''} />
          </button>
          <button
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-semibold py-2.5 px-5 rounded-full transition-colors"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
