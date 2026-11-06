import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, removeFromWishlist, addToCart } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: any) => {
    // Pick first variant options if variants exist
    const defaultVariants: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach((v: any) => {
        defaultVariants[v.name] = v.options[0];
      });
    }
    addToCart(product, defaultVariants, 1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 tracking-wide">
              <Heart size={14} fill="currentColor" />
              <span>Saved Merch</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
              Your Wishlist ({wishlistedProducts.length})
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Content Grid or Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 sm:p-16 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <Heart size={26} />
            </div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Your wishlist is empty</h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Bookmark your favorite keychains, desk mats, or fridge magnets while browsing to quickly find them later.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-block bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-7 rounded-full transition-colors"
              >
                Browse Merchandise
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => {
              const activePrice = product.salePrice ?? product.price;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-neutral-600 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      title="Remove from wishlist"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-neutral-500 tracking-normal capitalize">
                        {product.category}
                      </span>
                      <Link to={`/product/${product.slug}`} className="block hover:text-black">
                        <h3 className="font-display font-semibold text-sm text-neutral-900 line-clamp-1 mt-0.5">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-2 text-sm font-semibold text-neutral-950 tabular-nums">
                        ₹{activePrice}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <button
                        disabled={isOutOfStock}
                        onClick={() => handleMoveToCart(product)}
                        className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-xs font-semibold py-2.5 px-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={14} />
                        <span>{isOutOfStock ? 'Sold Out' : 'Move To Bag'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
