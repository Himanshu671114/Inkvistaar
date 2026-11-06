import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Package, ShoppingCart, IndianRupee, AlertTriangle, ArrowRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, orders } = useStore();

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published && !p.archived).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = products.filter((p) => p.stock < 20 && !p.archived);

  return (
    <div className="space-y-8">
      {/* Overview Heading */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-neutral-950">
          Operations Overview
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Live metric aggregates for INKVISTAAR merchandise inventory & customer orders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Total Catalog</span>
            <Package size={17} className="text-neutral-900" />
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-neutral-950 tabular-nums">
              {totalProducts}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">
              {publishedProducts} active on storefront
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Customer Orders</span>
            <ShoppingCart size={17} className="text-neutral-900" />
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-neutral-950 tabular-nums">
              {totalOrders}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">
              {orders.filter((o) => o.status !== 'Delivered').length} in active fulfillment
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Gross Revenue</span>
            <IndianRupee size={17} className="text-neutral-900" />
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-neutral-950 tabular-nums">
              ₹{totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 block mt-1 font-semibold">
              From {totalOrders} demo purchases
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Low Stock Alerts</span>
            <AlertTriangle size={17} className="text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-neutral-950 tabular-nums">
              {lowStockItems.length}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">
              Units with stock &lt; 20
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Catalog Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <div>
              <h2 className="font-display font-bold text-base text-neutral-950">
                Recent Fulfillment Queue
              </h2>
              <span className="text-xs text-neutral-500">Latest dispatched and processing items</span>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-neutral-900 hover:text-black flex items-center gap-1.5 transition-colors"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold bg-neutral-50/50">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-neutral-950 whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3 text-neutral-800 whitespace-nowrap font-medium">
                      {order.customer.fullName}
                    </td>
                    <td className="py-3 px-3 text-neutral-950 tabular-nums font-semibold">
                      ₹{order.total}
                    </td>
                    <td className="py-3 px-3 text-neutral-500 text-xs">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-neutral-700 hover:text-neutral-950 font-semibold underline transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Catalog Quick Overview */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <div>
              <h2 className="font-display font-bold text-base text-neutral-950">
                Merchandise
              </h2>
              <span className="text-xs text-neutral-500">Inventory levels</span>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-neutral-900 hover:text-black flex items-center gap-1.5 transition-colors"
            >
              <span>Add / Edit</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto pr-1">
            {products.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-10 h-10 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-xs text-neutral-950 truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span className="capitalize font-medium">{p.category}</span>
                    <span>·</span>
                    <span className={p.stock < 20 ? 'text-amber-600 font-semibold' : 'text-neutral-600'}>
                      {p.stock} in stock
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-neutral-950 tabular-nums">
                  ₹{p.salePrice ?? p.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
