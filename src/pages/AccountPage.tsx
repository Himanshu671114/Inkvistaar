import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { User, Package, MapPin, Plus, Trash2, ArrowRight, Eye, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';

export const AccountPage: React.FC = () => {
  const { user, updateUserProfile, addAddress, deleteAddress, orders, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'auth'>('orders');

  // Simulated Auth State
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [authEmail, setAuthEmail] = useState('devansh.v@example.com');
  const [authPassword, setAuthPassword] = useState('••••••••');
  const [authName, setAuthName] = useState('Devansh Verma');

  // Address modal form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user.name || '',
    phone: user.phone || '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
  });

  // Profile form
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);

  // Selected Order for detail view modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pinCode) {
      showToast('Please complete all address fields');
      return;
    }
    addAddress(newAddr);
    setShowAddAddress(false);
    setNewAddr({
      fullName: user.name || '',
      phone: user.phone || '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
    });
  };

  const handleSimulatedAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      updateUserProfile({ name: authName, email: authEmail });
    }
    setIsSignedIn(true);
    showToast(authMode === 'signin' ? 'Simulated Sign In Successful' : 'Simulated Account Created');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 tracking-wide">
              <User size={13} />
              <span>Customer Portal</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 tracking-tight mt-1">
              {isSignedIn ? user.name : 'Account Access'}
            </h1>
          </div>

          {isSignedIn && (
            <button
              onClick={() => {
                setIsSignedIn(false);
                showToast('Signed out of demo session');
              }}
              className="text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Sign Out (Demo Session)
            </button>
          )}
        </div>

        {!isSignedIn ? (
          /* Simulated Authentication View */
          <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 text-sm font-semibold tracking-normal text-center cursor-pointer transition-colors ${
                  authMode === 'signin'
                    ? 'border-b-2 border-neutral-950 text-neutral-950'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 text-sm font-semibold tracking-normal text-center cursor-pointer transition-colors ${
                  authMode === 'register'
                    ? 'border-b-2 border-neutral-950 text-neutral-950'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 text-xs text-neutral-600 font-normal">
              Prototype Mode: Simulated credentials for UI demonstration. Supabase Auth will be integrated in future phases.
            </div>

            <form onSubmit={handleSimulatedAuth} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs py-3.5 rounded-full transition-colors cursor-pointer mt-2"
              >
                {authMode === 'signin' ? 'Sign In to Account' : 'Register Account'}
              </button>
            </form>
          </div>
        ) : (
          /* Signed In Dashboard View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Tabs */}
            <aside className="lg:col-span-3 space-y-1.5">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-white bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={16} />
                  <span>Order History</span>
                </div>
                <span className="tabular-nums text-xs">({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-white bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Saved Addresses</span>
                </div>
                <span className="tabular-nums text-xs">({user.addresses.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-white bg-transparent'
                }`}
              >
                <User size={16} />
                <span>Profile Details</span>
              </button>
            </aside>

            {/* Main Tab Content */}
            <main className="lg:col-span-9 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-neutral-950">
                      Your Orders & Purchases
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Review all past orders, delivery details, and item receipts.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-12 text-center text-xs text-neutral-500 border border-neutral-200 rounded-2xl bg-neutral-50">
                      No order history found for this account.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 rounded-2xl p-4 sm:p-5 space-y-4 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3 text-xs">
                            <div>
                              <span className="text-neutral-950 font-semibold text-sm">{order.orderNumber}</span>
                              <span className="text-neutral-400 ml-2">·</span>
                              <span className="text-neutral-500 ml-2">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                                {order.status}
                              </span>
                              <button
                                onClick={() => setInspectOrder(order)}
                                className="text-neutral-700 hover:text-neutral-950 text-xs font-semibold underline cursor-pointer flex items-center gap-1 transition-colors"
                              >
                                <span>Inspect Receipt</span>
                                <Eye size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div className="divide-y divide-neutral-200">
                            {order.items.map((it: any, idx: number) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={it.image}
                                    alt={it.name}
                                    className="w-12 h-12 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-display text-xs text-neutral-950 font-semibold truncate">
                                      {it.name}
                                    </p>
                                    <p className="text-[11px] text-neutral-500">
                                      Qty: {it.quantity} × ₹{it.price}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-neutral-950 tabular-nums shrink-0">
                                  ₹{it.price * it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-xs">
                            <span className="text-neutral-600">
                              Payment: {order.paymentMethod}
                            </span>
                            <span className="text-neutral-950 font-semibold tabular-nums">
                              Total Paid: ₹{order.total}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-display font-bold text-lg text-neutral-950">
                        Saved Shipping Addresses
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        Addresses used for swift checkout.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {/* Add Address Form */}
                  {showAddAddress && (
                    <form
                      onSubmit={handleSaveAddress}
                      className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4 text-xs"
                    >
                      <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                        <span className="text-neutral-950 font-semibold">New Shipping Address</span>
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="text-neutral-500 hover:text-black cursor-pointer font-medium"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Recipient Full Name"
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          className="bg-white border border-neutral-200 rounded-xl text-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm focus:border-neutral-950 focus:outline-none"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Mobile Number"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="bg-white border border-neutral-200 rounded-xl text-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm focus:border-neutral-950 focus:outline-none"
                        />
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Street Address, Flat / Apt No, Landmark"
                        value={newAddr.street}
                        onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl text-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm focus:border-neutral-950 focus:outline-none"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          className="bg-white border border-neutral-200 rounded-xl text-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm focus:border-neutral-950 focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder="State"
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          className="bg-white border border-neutral-200 rounded-xl text-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm focus:border-neutral-950 focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder="PIN Code"
                          value={newAddr.pinCode}
                          onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                          className="bg-white border border-neutral-200 rounded-xl text-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm focus:border-neutral-950 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold py-2.5 px-6 rounded-full cursor-pointer transition-colors"
                      >
                        Save Address
                      </button>
                    </form>
                  )}

                  {/* Address List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="border border-neutral-200 bg-neutral-50 rounded-2xl p-4 flex flex-col justify-between text-xs space-y-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-neutral-950">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600">{addr.street}</p>
                          <p className="text-neutral-600">
                            {addr.city}, {addr.state} — {addr.pinCode}
                          </p>
                          <p className="text-neutral-500 pt-1">Phone: {addr.phone}</p>
                        </div>

                        <div className="pt-2 border-t border-neutral-200 flex justify-end">
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-neutral-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-medium transition-colors"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Details Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <h2 className="font-display font-bold text-lg text-neutral-950">
                      Personal Information
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Manage your contact details and default dispatch contact.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-700 font-medium mb-1.5">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 font-medium mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 font-medium mb-1.5">Mobile Contact</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs py-3 px-6 rounded-full transition-colors cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}
            </main>
          </div>
        )}

        {/* In-Modal Order Receipt Inspection */}
        {inspectOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setInspectOrder(null)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
            />
            <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-xs text-amber-700 font-semibold tracking-wide">
                    Order Receipt
                  </span>
                  <h3 className="font-display font-bold text-xl text-neutral-950">
                    {inspectOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectOrder(null)}
                  className="text-neutral-400 hover:text-black p-1 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status</span>
                  <span className="font-semibold text-neutral-950">{inspectOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Courier Partner</span>
                  <span className="text-neutral-950 font-medium">{inspectOrder.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination</span>
                  <span className="text-neutral-950 text-right font-medium">{inspectOrder.customer.city}, {inspectOrder.customer.state}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Items Purchased:
                </span>
                <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto">
                  {inspectOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-xs text-neutral-950 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-neutral-950 tabular-nums">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-semibold">
                <span>Total Paid</span>
                <span className="text-neutral-950 tabular-nums">₹{inspectOrder.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
