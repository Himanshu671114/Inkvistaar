import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, getVariantKey } from '../context/StoreContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    cartCount,
    clearCart,
  } = useStore();

  const navigate = useNavigate();

  const freeDeliveryThreshold = 999;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-700 tracking-wide">
              Review Bag
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
              Shopping Cart ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-neutral-500 hover:text-red-600 self-start sm:self-auto cursor-pointer font-medium transition-colors"
            >
              Clear Entire Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <ShoppingBag size={26} />
            </div>
            <h2 className="font-display font-bold text-xl text-neutral-950">Your cart is currently empty</h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              You haven't added any merchandise to your bag yet. Browse our latest drop of desk mats, forged keychains, and accessories.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-block bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-7 rounded-full transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items Table/List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free shipping banner */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                <Truck size={18} className={amountNeeded === 0 ? 'text-emerald-600' : 'text-neutral-900'} />
                <div className="text-xs">
                  {amountNeeded === 0 ? (
                    <span className="text-emerald-700 font-semibold">
                      Your order qualifies for FREE Express Shipping!
                    </span>
                  ) : (
                    <span className="text-neutral-700">
                      Add <strong className="text-neutral-950 font-semibold">₹{amountNeeded}</strong> more worth of merchandise to qualify for free express delivery.
                    </span>
                  )}
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white border border-neutral-200 rounded-3xl divide-y divide-neutral-100 shadow-xs overflow-hidden">
                {cart.map((item) => {
                  const variantKey = getVariantKey(item.selectedVariants);
                  const activePrice = item.product.salePrice ?? item.product.price;
                  const itemTotal = activePrice * item.quantity;
                  const isMax = item.quantity >= item.product.stock;

                  return (
                    <div
                      key={`${item.productId}-${variantKey}`}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-4 items-center flex-1 min-w-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-medium text-neutral-500 tracking-normal capitalize">
                            {item.product.category}
                          </span>
                          <Link to={`/product/${item.product.slug}`} className="block hover:text-black">
                            <h3 className="font-display font-semibold text-sm sm:text-base text-neutral-900 line-clamp-1">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <div className="text-xs text-neutral-500 mt-1">
                              {Object.entries(item.selectedVariants).map(([k, v]) => (
                                <span key={k} className="mr-3">
                                  {k}: <span className="text-neutral-800 font-medium">{v}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-neutral-500 sm:hidden">
                            Unit: ₹{activePrice}
                          </div>
                        </div>
                      </div>

                      {/* Stepper, Item Total & Delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-300 rounded-full bg-white px-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, variantKey, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums text-neutral-950">
                            {item.quantity}
                          </span>
                          <button
                            disabled={isMax}
                            onClick={() =>
                              updateCartQuantity(item.productId, variantKey, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black transition-colors disabled:opacity-30"
                            aria-label="Increase quantity"
                            title={isMax ? 'Maximum stock reached' : 'Increase quantity'}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[80px]">
                          <span className="text-base font-semibold text-neutral-950 tabular-nums">
                            ₹{itemTotal}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId, variantKey)}
                          className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1.5 transition-colors"
                >
                  <span>← Back to Catalog</span>
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24 shadow-xs">
              <h2 className="font-display font-semibold text-base text-neutral-950 border-b border-neutral-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Subtotal ({cartCount} items)</span>
                  <span className="text-neutral-950 font-medium tabular-nums">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charges</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>GST (18% inclusive)</span>
                  <span className="text-neutral-800 font-medium">Included</span>
                </div>

                <div className="border-t border-neutral-100 pt-3 flex justify-between text-base font-semibold text-neutral-950">
                  <span>Final Total</span>
                  <span className="tabular-nums text-neutral-950">₹{cartTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs py-4 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="pt-2 space-y-2 text-xs text-neutral-500 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>Secure prototype checkout session</span>
                </div>
                <p className="leading-relaxed">
                  Delivery charges are waived on all orders exceeding ₹999. UPI, Cards, Netbanking, and COD supported.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
