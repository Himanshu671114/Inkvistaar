import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    // Pick first variant options if variants exist
    const defaultVariants: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach((v) => {
        defaultVariants[v.name] = v.options[0];
      });
    }

    addToCart(product, defaultVariants, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const currentImage =
    isHovered && product.images.length > 1
      ? product.images[1]
      : product.images[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-neutral-200/80 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-300"
    >
      {/* Visual Image Container (65-75% height) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {!imageError ? (
            <img
              src={currentImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-500 p-4 text-center">
              <span className="text-xs capitalize font-medium text-neutral-500">
                {product.category}
              </span>
              <p className="font-display font-medium text-sm text-neutral-800 mt-1 line-clamp-2">
                {product.name}
              </p>
            </div>
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-neutral-900 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-amber-400 text-neutral-950 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% off
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-600 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button with Heart Animation */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            isFavorited
              ? 'bg-amber-400 text-neutral-950 scale-105'
              : 'bg-white/95 text-neutral-600 hover:text-neutral-950 hover:bg-white hover:scale-105'
          }`}
        >
          <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'text-neutral-950' : ''} />
        </button>

        {/* Quick Add To Bag overlay button on hover */}
        {!isOutOfStock && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
            >
              {justAdded ? (
                <>
                  <Check size={14} className="text-amber-400" />
                  <span>Added To Bag</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details Module */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium capitalize mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.stock > 5 ? 'In stock' : `${product.stock} left`}</span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-black transition-colors">
            <h3 className="font-display font-semibold text-sm sm:text-[15px] text-neutral-900 line-clamp-1 leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Variant Hints */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-950 tabular-nums">
              ₹{product.salePrice ?? product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                ₹{product.price}
              </span>
            )}
          </div>
          {product.variants && product.variants.length > 0 && (
            <span className="text-xs text-neutral-500 font-normal">
              {product.variants[0].options.length} options
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
