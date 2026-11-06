import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { Search, Eye, X, Check, Truck, Package, MapPin } from 'lucide-react';

const ALL_STATUSES: OrderStatus[] = [
  'Order placed',
  'Processing',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders
    .filter((o) => (statusFilter === 'all' ? true : o.status === statusFilter))
    .filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-neutral-950">
            Order Fulfillment Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            View customer details, inspect line items, and advance delivery fulfillment stages.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order #, customer name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-neutral-950"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs py-2 px-3 rounded-xl focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500 font-semibold bg-neutral-50/60">
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Customer Info</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Status & Update</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-neutral-950 whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-neutral-950 font-medium">{order.customer.fullName}</div>
                  <div className="text-[11px] text-neutral-500">{order.customer.phone}</div>
                </td>
                <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </td>
                <td className="py-3.5 px-4 text-neutral-700">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </td>
                <td className="py-3.5 px-4 font-semibold text-neutral-950 tabular-nums">
                  ₹{order.total}
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-950 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-neutral-950 cursor-pointer font-medium"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
                    title="View Full Details"
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <div>
                <span className="text-xs text-amber-700 font-semibold tracking-wide">
                  Order Details
                </span>
                <h3 className="font-display font-bold text-xl text-neutral-950">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-black cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Selector in Modal */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-neutral-500 block font-medium">
                  Current Fulfillment State
                </span>
                <span className="text-sm font-semibold text-neutral-950">
                  {selectedOrder.status}
                </span>
              </div>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus;
                  updateOrderStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                }}
                className="bg-white border border-neutral-300 text-neutral-950 text-xs py-2 px-3 rounded-xl focus:outline-none font-medium cursor-pointer"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Move to: {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Split Info: Customer & Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
                <span className="text-neutral-900 font-semibold flex items-center gap-1.5">
                  <MapPin size={14} className="text-neutral-950" />
                  <span>Customer Destination</span>
                </span>
                <p className="text-neutral-950 font-medium">{selectedOrder.customer.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.customer.address}</p>
                <p className="text-neutral-600">
                  {selectedOrder.customer.city}, {selectedOrder.customer.state} — {selectedOrder.customer.pinCode}
                </p>
                <p className="text-neutral-500 pt-1">Phone: {selectedOrder.customer.phone}</p>
                <p className="text-neutral-500">Email: {selectedOrder.customer.email}</p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
                <span className="text-neutral-900 font-semibold flex items-center gap-1.5">
                  <Truck size={14} className="text-neutral-950" />
                  <span>Logistics Details</span>
                </span>
                <p className="text-neutral-600">
                  Carrier: <strong className="text-neutral-950 font-medium">{selectedOrder.courier}</strong>
                </p>
                <p className="text-neutral-600">
                  Tracking AWB: <strong className="text-neutral-950 font-medium">{selectedOrder.trackingNumber}</strong>
                </p>
                <p className="text-neutral-600">
                  Payment: <strong className="text-neutral-950 font-medium">{selectedOrder.paymentMethod}</strong> ({selectedOrder.paymentStatus})
                </p>
              </div>
            </div>

            {/* Itemized breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-700 block">
                Purchased Merchandise ({selectedOrder.items.length})
              </span>
              <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-100 overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-xs text-neutral-950 truncate">
                        {item.name}
                      </p>
                      {item.selectedVariantText && (
                        <p className="text-[11px] text-neutral-500 truncate">
                          {item.selectedVariantText}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-400">
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

            <div className="flex justify-between items-center pt-3 border-t border-neutral-200 text-sm">
              <span className="text-neutral-600">Total Billed:</span>
              <span className="text-neutral-950 font-semibold text-base tabular-nums">
                ₹{selectedOrder.total}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
