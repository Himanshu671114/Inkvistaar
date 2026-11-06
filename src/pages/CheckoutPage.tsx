import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore, getVariantKey } from '../context/StoreContext';
import { ShieldCheck, Truck, ArrowLeft, QrCode, CreditCard, Landmark, Banknote, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, deliveryFee, cartTotal, createOrder, user } = useStore();
  const navigate = useNavigate();

  // Prepopulate from user state
  const defaultAddress = user.addresses[0];
  const [formData, setFormData] = useState({
    fullName: defaultAddress?.fullName || user.name || '',
    phone: defaultAddress?.phone || user.phone || '',
    email: user.email || '',
    address: defaultAddress?.street || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    pinCode: defaultAddress?.pinCode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI / QR' | 'Credit/Debit Card' | 'Netbanking' | 'Cash on Delivery'>('UPI / QR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#fafafa] py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                Order Confirmed
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
                Thank You For Your Order!
              </h1>
              <p className="text-sm text-neutral-500 mt-2">
                Order reference: <strong className="text-neutral-950 font-semibold">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-3">
              <div className="flex justify-between border-b border-neutral-200/70 pb-2">
                <span className="text-neutral-500">Recipient</span>
                <span className="text-neutral-950 font-medium">{completedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/70 pb-2">
                <span className="text-neutral-500">Delivery Address</span>
                <span className="text-neutral-950 text-right max-w-xs font-medium">{completedOrder.customer.address}, {completedOrder.customer.city}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/70 pb-2">
                <span className="text-neutral-500">Payment Option</span>
                <span className="text-neutral-950 font-medium">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold">
                <span className="text-neutral-700">Total Billed</span>
                <span className="text-neutral-950 tabular-nums">₹{completedOrder.total}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto font-normal">
              Your merchandise will be packaged in sealed security wrap and dispatched from our studio within 24 hours. A confirmation has been logged to your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/account"
                className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <span>View Order in Account</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/shop"
                className="flex-1 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold py-3.5 px-6 rounded-full transition-colors"
              >
                Keep Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#fafafa] text-center">
        <h2 className="font-display font-bold text-2xl text-neutral-950">Your bag is empty</h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3.5 px-8 rounded-full transition-colors"
        >
          Explore Store
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pinCode.trim()) {
      setError('Please provide all mandatory delivery fields (Name, Phone, Address, PIN code).');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => {
        const variantText = item.selectedVariants
          ? Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
          : undefined;

        return {
          productId: item.productId,
          name: item.product.name,
          price: item.product.salePrice ?? item.product.price,
          quantity: item.quantity,
          selectedVariantText: variantText,
          image: item.product.images[0],
        };
      });

      const newOrder = await createOrder({
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
        },
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee: deliveryFee,
        total: cartTotal,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Completed',
      });

      setCompletedOrder(newOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation link */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Shopping Bag</span>
          </Link>
        </div>

        <div className="border-b border-neutral-200 pb-4 mb-8">
          <span className="text-xs font-semibold text-amber-700 tracking-wide">
            Step 2 of 2 · Checkout
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
            Shipping & Payment Details
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Shipping Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="font-display font-semibold text-base text-neutral-950">
                  1. Delivery Address
                </h2>
                <span className="text-xs text-neutral-500 font-medium">Pan-India Express</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Siddharth Rao"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Email Address (For Invoice) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat/House No, Building, Street, Landmark"
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="6 digits"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Interface */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="font-display font-semibold text-base text-neutral-950">
                  2. Select Payment Method
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Prototype checkout mode: simulated order placement.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'UPI / QR',
                    label: 'Instant UPI (Google Pay, PhonePe, Paytm, BHIM)',
                    icon: <QrCode size={18} className="text-neutral-900" />,
                    note: 'Fastest dispatch verification',
                  },
                  {
                    id: 'Credit/Debit Card',
                    label: 'Credit / Debit Card (Visa, MasterCard, RuPay)',
                    icon: <CreditCard size={18} className="text-neutral-900" />,
                    note: 'Zero processing surcharge',
                  },
                  {
                    id: 'Netbanking',
                    label: 'Net Banking (All Major Indian Banks)',
                    icon: <Landmark size={18} className="text-neutral-900" />,
                    note: 'HDFC, ICICI, SBI, Axis & 40+ banks',
                  },
                  {
                    id: 'Cash on Delivery',
                    label: 'Cash On Delivery (COD)',
                    icon: <Banknote size={18} className="text-neutral-900" />,
                    note: 'Pay cash upon doorstep verification',
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start gap-3.5 p-3.5 border rounded-2xl cursor-pointer transition-colors ${
                      paymentMethod === pm.id
                        ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950/10'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id as any)}
                      className="accent-neutral-950 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {pm.icon}
                        <span className="text-xs font-semibold text-neutral-950">
                          {pm.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {pm.note}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24 shadow-xs">
            <h2 className="font-display font-semibold text-base text-neutral-950 border-b border-neutral-100 pb-3">
              Order Review ({cart.length} Products)
            </h2>

            {/* Itemized Mini List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
              {cart.map((item) => {
                const variantKey = getVariantKey(item.selectedVariants);
                const activePrice = item.product.salePrice ?? item.product.price;
                return (
                  <div key={`${item.productId}-${variantKey}`} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-xs text-neutral-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} × ₹{activePrice}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-950 tabular-nums">
                      ₹{activePrice * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs sm:text-sm border-t border-neutral-100 pt-4">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="text-neutral-950 font-medium tabular-nums">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Express Delivery</span>
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
                <span className="text-neutral-800 font-medium">₹{Math.round(cartSubtotal * 0.18)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>Total Payable</span>
                <span className="text-neutral-950 tabular-nums">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs py-4 px-4 rounded-full transition-all cursor-pointer shadow-xs hover:shadow"
            >
              {isSubmitting ? 'Placing Order...' : `Confirm & Place Order · ₹${cartTotal}`}
            </button>

            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-neutral-950 shrink-0" />
                <span>Estimated dispatch: Next business day via Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Instant confirmation receipt generated in your account</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
