import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerUser, OrderStatus, Address, ProductCategory } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/products';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StoreContextType {
  products: Product[];
  categories: { id: string; category_name: string; description?: string }[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  orders: Order[];
  isCartOpen: boolean;
  announcementText: string;
  user: CustomerUser;
  toastMessage: string | null;
  isLoadingDb: boolean;
  dbError: string | null;
  setIsCartOpen: (open: boolean) => void;
  setAnnouncementText: (text: string) => void;
  showToast: (msg: string) => void;
  addToCart: (product: Product, variants?: Record<string, string>, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantKey: string, quantity: number) => void;
  removeFromCart: (productId: string, variantKey: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingNumber' | 'courier' | 'estimatedDelivery'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderByIdOrNumber: (identifier: string) => Order | undefined;
  addProduct: (newProd: Omit<Product, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProduct: (updated: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  archiveProduct: (id: string, archived: boolean) => Promise<boolean>;
  togglePublishProduct: (id: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
  updateUserProfile: (profile: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS_FALLBACK: 'inkvistaar_products_v2',
  CART: 'inkvistaar_cart_v2',
  WISHLIST: 'inkvistaar_wishlist_v2',
  RECENT: 'inkvistaar_recent_v2',
  ORDERS_FALLBACK: 'inkvistaar_orders_v2',
  USER: 'inkvistaar_user_v2',
  ANNOUNCEMENT: 'inkvistaar_announcement_v2',
};

const DEFAULT_USER: CustomerUser = {
  id: 'usr-demo-01',
  name: 'Devansh Verma',
  email: 'devansh.v@example.com',
  phone: '+91 98980 12345',
  addresses: [
    {
      id: 'addr-01',
      fullName: 'Devansh Verma',
      phone: '+91 98980 12345',
      street: '12-A, Design District, 4th Cross Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560034',
      isDefault: true,
    },
  ],
};

export const getVariantKey = (variants?: Record<string, string>): string => {
  if (!variants || Object.keys(variants).length === 0) return 'default';
  return Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS_FALLBACK);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<{ id: string; category_name: string; description?: string }[]>([
    { id: 'keychains', category_name: 'Keychains' },
    { id: 'mousepads', category_name: 'Desk Mousepads' },
    { id: 'magnets', category_name: 'Fridge Magnets' },
    { id: 'accessories', category_name: 'Merch & Accessories' },
  ]);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS_FALLBACK);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['ink-kc-01'];
    } catch {
      return ['ink-kc-01'];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      return saved ? JSON.parse(saved) : ['ink-mp-01', 'ink-kc-01'];
    } catch {
      return ['ink-mp-01', 'ink-kc-01'];
    }
  });

  const [user, setUser] = useState<CustomerUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [announcementText, setAnnouncementText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);
      return saved || 'FREE DOMESTIC EXPRESS SHIPPING OVER ₹999 / DISPATCH WITHIN 24 HOURS';
    } catch {
      return 'FREE DOMESTIC EXPRESS SHIPPING OVER ₹999 / DISPATCH WITHIN 24 HOURS';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  // --- Database Sync (Supabase) ---
  const fetchProductsFromSupabase = async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingDb(false);
      return;
    }

    try {
      setIsLoadingDb(true);
      setDbError(null);

      // 1. Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catData && catData.length > 0) {
        setCategories(catData);
      }

      // 2. Fetch products with their product_images
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          product_name,
          description,
          price,
          sale_price,
          category_id,
          stock_quantity,
          published,
          archived,
          badge,
          features,
          specifications,
          variants,
          popularity,
          created_at,
          product_images (
            id,
            image_url,
            display_order,
            is_primary
          )
        `)
        .order('created_at', { ascending: false });

      if (prodErr) {
        console.warn('Supabase products fetch note:', prodErr.message);
        setDbError(prodErr.message);
        return;
      }

      if (prodData && prodData.length > 0) {
        const mappedProducts: Product[] = prodData.map((row: any) => {
          // Sort images by is_primary and display_order
          const sortedImgs = (row.product_images || [])
            .sort((a: any, b: any) => {
              if (a.is_primary && !b.is_primary) return -1;
              if (!a.is_primary && b.is_primary) return 1;
              return (a.display_order || 0) - (b.display_order || 0);
            })
            .map((img: any) => img.image_url);

          return {
            id: row.id,
            slug: row.slug,
            name: row.product_name,
            description: row.description || '',
            price: Number(row.price),
            salePrice: row.sale_price ? Number(row.sale_price) : undefined,
            category: (row.category_id || 'keychains') as ProductCategory,
            stock: Number(row.stock_quantity),
            published: Boolean(row.published),
            archived: Boolean(row.archived),
            badge: row.badge || undefined,
            features: Array.isArray(row.features) ? row.features : [],
            specifications: (row.specifications && typeof row.specifications === 'object') ? row.specifications : {},
            variants: Array.isArray(row.variants) ? row.variants : [],
            popularity: row.popularity || 50,
            createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            images: sortedImgs.length > 0 ? sortedImgs : ['/src/assets/images/hero_campaign_banner_1793982914350.jpg'],
          };
        });

        setProducts(mappedProducts);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS_FALLBACK, JSON.stringify(mappedProducts));
      }
    } catch (err: any) {
      console.error('Failed to load from Supabase:', err);
      setDbError(err.message || 'Database connection error');
    } finally {
      setIsLoadingDb(false);
    }
  };

  const fetchOrdersFromSupabase = async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          phone,
          email,
          delivery_address,
          city,
          state,
          pin_code,
          subtotal,
          delivery_fee,
          total_amount,
          payment_method,
          payment_status,
          order_status,
          tracking_number,
          courier,
          estimated_delivery,
          created_at,
          order_items (
            product_id,
            product_name,
            quantity,
            unit_price,
            selected_variant_text,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersErr) {
        console.warn('Orders fetch note:', ordersErr.message);
        return;
      }

      if (ordersData && ordersData.length > 0) {
        const mappedOrders: Order[] = ordersData.map((row: any) => ({
          id: row.id,
          orderNumber: row.order_number,
          createdAt: row.created_at,
          customer: {
            fullName: row.customer_name,
            phone: row.phone,
            email: row.email,
            address: row.delivery_address,
            city: row.city || '',
            state: row.state || '',
            pinCode: row.pin_code || '',
          },
          items: (row.order_items || []).map((it: any) => ({
            productId: it.product_id || '',
            name: it.product_name,
            price: Number(it.unit_price),
            quantity: Number(it.quantity),
            selectedVariantText: it.selected_variant_text || undefined,
            image: it.image_url || '/src/assets/images/hero_campaign_banner_1793982914350.jpg',
          })),
          subtotal: Number(row.subtotal),
          deliveryFee: Number(row.delivery_fee),
          total: Number(row.total_amount),
          paymentMethod: row.payment_method as any,
          paymentStatus: row.payment_status as any,
          status: row.order_status as OrderStatus,
          trackingNumber: row.tracking_number || '',
          courier: row.courier || 'Express Surface',
          estimatedDelivery: row.estimated_delivery || 'Within 3–5 days',
        }));

        setOrders(mappedOrders);
        localStorage.setItem(STORAGE_KEYS.ORDERS_FALLBACK, JSON.stringify(mappedOrders));
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchProductsFromSupabase();
    fetchOrdersFromSupabase();
  }, []);

  // Save state to localStorage as fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch { /* noop */ }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch { /* noop */ }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyViewed));
    } catch { /* noop */ }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch { /* noop */ }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, announcementText);
    } catch { /* noop */ }
  }, [announcementText]);

  // Cart operations
  const addToCart = (product: Product, variants?: Record<string, string>, quantity: number = 1) => {
    const key = getVariantKey(variants);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && getVariantKey(item.selectedVariants) === key
      );

      if (existingIndex > -1) {
        const item = prev[existingIndex];
        const nextQty = Math.min(item.quantity + quantity, product.stock);
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity: nextQty };
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock);
        return [...prev, { productId: product.id, product, selectedVariants: variants, quantity: initialQty }];
      }
    });

    showToast(`Added "${product.name.slice(0, 24)}..." to bag`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, variantKey: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) => !(item.productId === productId && getVariantKey(item.selectedVariants) === variantKey)
        );
      }
      return prev.map((item) => {
        if (item.productId === productId && getVariantKey(item.selectedVariants) === variantKey) {
          const maxAllowed = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string, variantKey: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && getVariantKey(item.selectedVariants) === variantKey)
      )
    );
    showToast('Removed item from bag');
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const activePrice = item.product.salePrice ?? item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const deliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= 999 ? 0 : 99;
  const cartTotal = cartSubtotal + deliveryFee;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from wishlist');
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  // Orders
  const createOrder = async (
    orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingNumber' | 'courier' | 'estimatedDelivery'>
  ): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNo = `DELHIVERY-${Math.floor(100000000 + Math.random() * 900000000)}IN`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${randomSuffix}`,
      orderNumber: `INK-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'Order placed',
      trackingNumber: trackingNo,
      courier: 'Delhivery Surface Express',
      estimatedDelivery: 'Within 3–5 business days',
    };

    // Attempt to persist to Supabase
    if (isSupabaseConfigured) {
      try {
        const { error: ordErr } = await supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customer.fullName,
          phone: newOrder.customer.phone,
          email: newOrder.customer.email,
          delivery_address: newOrder.customer.address,
          city: newOrder.customer.city,
          state: newOrder.customer.state,
          pin_code: newOrder.customer.pinCode,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          total_amount: newOrder.total,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.status,
          tracking_number: newOrder.trackingNumber,
          courier: newOrder.courier,
          estimated_delivery: newOrder.estimatedDelivery,
        });

        if (!ordErr) {
          // Insert order items
          const itemRows = newOrder.items.map((it) => ({
            order_id: newOrder.id,
            product_id: it.productId,
            product_name: it.name,
            quantity: it.quantity,
            unit_price: it.price,
            selected_variant_text: it.selectedVariantText || null,
            image_url: it.image,
          }));

          await supabase.from('order_items').insert(itemRows);
        }
      } catch (err) {
        console.warn('Could not save order directly to Supabase:', err);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId || ord.orderNumber === orderId ? { ...ord, status } : ord))
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .or(`id.eq.${orderId},order_number.eq.${orderId}`);
      } catch (err) {
        console.error('Error updating order status in Supabase:', err);
      }
    }

    showToast(`Order status updated to "${status}"`);
  };

  const getOrderByIdOrNumber = (identifier: string): Order | undefined => {
    const clean = identifier.trim().toLowerCase();
    return orders.find(
      (ord) => ord.id.toLowerCase() === clean || ord.orderNumber.toLowerCase() === clean
    );
  };

  // Products CRUD for Admin
  const addProduct = async (newProd: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    const randomId = `ink-${Date.now().toString(36)}`;
    const product: Product = {
      ...newProd,
      id: randomId,
      createdAt: new Date().toISOString().split('T')[0],
      published: newProd.published ?? true,
      archived: false,
    };

    if (isSupabaseConfigured) {
      try {
        const { error: insErr } = await supabase.from('products').insert({
          id: product.id,
          slug: product.slug,
          product_name: product.name,
          description: product.description,
          price: product.price,
          sale_price: product.salePrice || null,
          category_id: product.category,
          stock_quantity: product.stock,
          published: product.published,
          archived: false,
          badge: product.badge || null,
          features: product.features,
          specifications: product.specifications,
          variants: product.variants || [],
          popularity: product.popularity || 80,
        });

        if (insErr) {
          console.error('Supabase product insert error:', insErr);
          showToast(`Error: ${insErr.message}`);
          return false;
        }

        // Insert product images
        if (product.images && product.images.length > 0) {
          const imgRows = product.images.map((url, idx) => ({
            product_id: product.id,
            image_url: url,
            display_order: idx,
            is_primary: idx === 0,
          }));
          await supabase.from('product_images').insert(imgRows);
        }

        await fetchProductsFromSupabase();
        showToast('Product added to database successfully');
        return true;
      } catch (err: any) {
        console.error('Failed to insert product in Supabase:', err);
        showToast('Saved locally (Database offline)');
      }
    }

    setProducts((prev) => [product, ...prev]);
    showToast('Product created successfully');
    return true;
  };

  const updateProduct = async (updated: Product): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error: updErr } = await supabase
          .from('products')
          .update({
            slug: updated.slug,
            product_name: updated.name,
            description: updated.description,
            price: updated.price,
            sale_price: updated.salePrice || null,
            category_id: updated.category,
            stock_quantity: updated.stock,
            published: updated.published,
            archived: updated.archived ?? false,
            badge: updated.badge || null,
            features: updated.features,
            specifications: updated.specifications,
            variants: updated.variants || [],
            popularity: updated.popularity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', updated.id);

        if (updErr) {
          console.error('Supabase update error:', updErr);
          showToast(`Error: ${updErr.message}`);
          return false;
        }

        // Refresh images
        await supabase.from('product_images').delete().eq('product_id', updated.id);
        if (updated.images && updated.images.length > 0) {
          const imgRows = updated.images.map((url, idx) => ({
            product_id: updated.id,
            image_url: url,
            display_order: idx,
            is_primary: idx === 0,
          }));
          await supabase.from('product_images').insert(imgRows);
        }

        await fetchProductsFromSupabase();
        showToast('Product updated in database');
        return true;
      } catch (err: any) {
        console.error('Failed to update in Supabase:', err);
      }
    }

    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Product updated');
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error: delErr } = await supabase.from('products').delete().eq('id', id);
        if (delErr) {
          showToast(`Error: ${delErr.message}`);
          return false;
        }
        await fetchProductsFromSupabase();
        showToast('Product deleted from database');
        return true;
      } catch (err: any) {
        console.error('Delete error:', err);
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted');
    return true;
  };

  const archiveProduct = async (id: string, archived: boolean): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error: arcErr } = await supabase
          .from('products')
          .update({ archived, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (arcErr) {
          showToast(`Error: ${arcErr.message}`);
          return false;
        }
        await fetchProductsFromSupabase();
        showToast(archived ? 'Product archived' : 'Product unarchived');
        return true;
      } catch (err: any) {
        console.error('Archive error:', err);
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archived } : p))
    );
    showToast(archived ? 'Product archived' : 'Product unarchived');
    return true;
  };

  const togglePublishProduct = async (id: string): Promise<boolean> => {
    const currentProd = products.find((p) => p.id === id);
    const nextPublished = currentProd ? !currentProd.published : true;

    if (isSupabaseConfigured) {
      try {
        const { error: pubErr } = await supabase
          .from('products')
          .update({ published: nextPublished, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (pubErr) {
          showToast(`Error: ${pubErr.message}`);
          return false;
        }
        await fetchProductsFromSupabase();
        showToast(nextPublished ? 'Product published to store' : 'Product unpublished');
        return true;
      } catch (err: any) {
        console.error('Publish error:', err);
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
    showToast('Product visibility updated');
    return true;
  };

  const refetchData = async () => {
    await fetchProductsFromSupabase();
    await fetchOrdersFromSupabase();
  };

  const updateUserProfile = (profile: Partial<CustomerUser>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    showToast('Profile updated');
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    showToast('Address saved');
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
    showToast('Address removed');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        recentlyViewed,
        orders,
        isCartOpen,
        announcementText,
        user,
        toastMessage,
        isLoadingDb,
        dbError,
        setIsCartOpen,
        setAnnouncementText,
        showToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        cartCount,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        addRecentlyViewed,
        createOrder,
        updateOrderStatus,
        getOrderByIdOrNumber,
        addProduct,
        updateProduct,
        deleteProduct,
        archiveProduct,
        togglePublishProduct,
        refetchData,
        updateUserProfile,
        addAddress,
        deleteAddress,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
