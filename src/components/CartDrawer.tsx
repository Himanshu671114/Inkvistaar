import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, getVariantKey } from '../context/StoreContext';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    cartCount,
  } = useStore();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 999;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 text-neutral-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                <ShoppingBag size={17} className="text-neutral-950" />
              </div>
              <h2 className="font-display font-bold text-lg text-neutral-950 tracking-tight">
                Your Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-neutral-50 p-4 px-5 border-b border-neutral-200">
              <div className="flex items-center gap-2 text-xs mb-2">
                <Truck size={15} className={progressPercent === 100 ? 'text-emerald-600' : 'text-neutral-950'} />
                {progressPercent === 100 ? (
                  <span className="text-emerald-700 font-semibold">
                    You've unlocked free express delivery!
                  </span>
                ) : (
                  <span className="text-neutral-700 font-medium">
                    Add <strong className="text-neutral-950 font-bold">₹{amountNeededForFree}</strong> more for{' '}
                    <strong className="text-neutral-950 font-semibold">Free Express Shipping</strong>
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-950 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-neutral-950">Your bag is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs font-normal">
                    Explore precision desk mats, cast metal keychains, and lifestyle accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const variantKey = getVariantKey(item.selectedVariants);
                const activePrice = item.product.salePrice ?? item.product.price;
                const itemTotal = activePrice * item.quantity;
                const isMax = item.quantity >= item.product.stock;

                return (
                  <div key={`${item.productId}-${variantKey}`} className="py-4 flex gap-4 first:pt-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-neutral-100 border border-neutral-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display font-semibold text-sm text-neutral-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, variantKey)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Variants display */}
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <div className="text-xs text-neutral-500 mt-1 space-y-0.5 font-normal">
                            {Object.entries(item.selectedVariants).map(([k, v]) => (
                              <div key={k} className="truncate">
                                {k}: <span className="text-neutral-800 font-medium">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stepper & Price */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, variantKey, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 transition-colors text-sm cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums text-neutral-950">
                            {item.quantity}
                          </span>
                          <button
                            disabled={isMax}
                            onClick={() =>
                              updateCartQuantity(item.productId, variantKey, item.quantity + 1)
                            }
                            className={`w-7 h-7 flex items-center justify-center text-sm transition-colors ${
                              isMax
                                ? 'text-neutral-300 cursor-not-allowed'
                                : 'text-neutral-600 hover:text-neutral-950 cursor-pointer'
                            }`}
                            aria-label="Increase quantity"
                            title={isMax ? 'Maximum stock reached' : 'Increase quantity'}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-neutral-950 tabular-nums">
                            ₹{itemTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Subtotal</span>
                  <span className="text-neutral-950 font-bold tabular-nums">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Estimate</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="tabular-nums text-neutral-950">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleViewCart}
                    className="border border-neutral-300 hover:bg-white text-neutral-800 text-xs font-semibold py-2.5 rounded-full transition-colors text-center"
                  >
                    View Bag
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="border border-neutral-300 hover:bg-white text-neutral-800 text-xs font-semibold py-2.5 rounded-full transition-colors text-center"
                  >
                    Keep Shopping
                  </button>
                </div>
              </div>

              {/* Trust Tag */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Authentic Merch · Fast 24H Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
