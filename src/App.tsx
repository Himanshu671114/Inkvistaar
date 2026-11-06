import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminResetPasswordPage } from './pages/admin/AdminResetPasswordPage';

// Public Storefront Shell
const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#111827] selection:bg-black selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Storefront Routes */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              {/* Catch-all */}
              <Route path="*" element={<HomePage />} />
            </Route>

            {/* Admin Password Reset Callback (Standalone) */}
            <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

            {/* Admin Routes (Separated layout, protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AdminAuthProvider>
  );
}
