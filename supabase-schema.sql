-- =========================================================================
-- INKVISTAAR ECOMMERCE DATABASE SCHEMA & SECURITY POLICIES
-- Execute this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. HOW TO ASSIGN THE FIRST STORE ADMINISTRATOR (SECURE WORKFLOW)
-- =========================================================================
-- Step A: In your Supabase Dashboard, go to "Authentication" -> "Users" -> "Add User" -> "Create User".
--         Enter an email (e.g. admin@inkvistaar.com) and a secure initial password.
-- Step B: Copy the newly created User UUID (e.g. a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11).
-- Step C: Run the following SQL query below to assign the 'admin' role:
--
--         INSERT INTO public.profiles (id, email, full_name, role)
--         VALUES ('<YOUR_USER_UUID>', 'admin@inkvistaar.com', 'Store Administrator', 'admin')
--         ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();
--
-- Notice: Permissions are tied to auth.users UUID. When an admin changes their
-- email or password through the Inkvistaar settings panel, their UUID never changes,
-- ensuring admin rights are never accidentally stripped.
-- =========================================================================

-- 1. PROFILES / ADMIN ROLES TABLE
-- Links with auth.users to designate authorized store admins
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY, -- e.g. 'keychains', 'mousepads', 'magnets', 'accessories'
  category_name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('ink-' || substr(md5(random()::text), 1, 8)),
  slug TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  published BOOLEAN NOT NULL DEFAULT true,
  archived BOOLEAN NOT NULL DEFAULT false,
  badge TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  popularity INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ord-' || floor(1000 + random() * 9000)::text),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL DEFAULT 'UPI / QR',
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Completed', 'Cash on Delivery')),
  order_status TEXT NOT NULL DEFAULT 'Order placed' CHECK (order_status IN ('Order placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered')),
  tracking_number TEXT,
  courier TEXT,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  selected_variant_text TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(published, archived);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- Profiles RLS ---
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- --- Categories RLS ---
-- Public can view all categories
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --- Products RLS ---
-- Public storefront: View published and non-archived products (Admins can view all)
CREATE POLICY "Public can view published products"
  ON public.products FOR SELECT
  USING ((published = true AND archived = false) OR public.is_admin());

-- Only admins can insert, update, archive, or delete products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --- Product Images RLS ---
-- Public can view images belonging to visible products (Admins view all)
CREATE POLICY "Public can view product images"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND ((p.published = true AND p.archived = false) OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage product images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --- Orders RLS ---
-- Anyone (customers checkout without requiring forced login) can insert orders
CREATE POLICY "Customers can place orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Customers can view their own order if they have the ID/order_number or if admin
CREATE POLICY "Admins can view and manage all orders"
  ON public.orders FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --- Order Items RLS ---
CREATE POLICY "Customers can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage all order items"
  ON public.order_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =========================================================================
-- INITIAL SEED DATA (Categories & Inkvistaar Signature Merchandise)
-- =========================================================================

INSERT INTO public.categories (id, category_name, description, display_order)
VALUES
  ('keychains', 'Keychains', 'Forged metallic, cast brass, and tactical utilitarian keychains.', 1),
  ('mousepads', 'Desk Mousepads', 'Micro-textured desk mats and precision mouse surfaces.', 2),
  ('magnets', 'Fridge Magnets', 'Architectural and brutalist heavy-duty rare-earth magnets.', 3),
  ('accessories', 'Merch & Accessories', 'EDC gear, RFID cardholders, and studio carry merchandise.', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (
  id, slug, product_name, description, price, sale_price, category_id, stock_quantity, published, archived, badge, features, specifications, variants, popularity
)
VALUES
  (
    'ink-mp-01',
    'topographic-contour-desk-mat',
    'Topographic Contour Precision Desk Mat',
    'Engineered for high-friction control and glide consistency. The Topographic Contour Desk Mat features micro-woven textured fabric, reinforced 360° anti-fray perimeter stitching, and a natural non-slip rubber base. High-definition screen printed contours with fade-resistant pigments.',
    1499.00,
    1199.00,
    'mousepads',
    28,
    true,
    false,
    'Bestseller',
    '["Micro-woven poly-spandex glide surface for high DPI tracking", "Ultra-dense 4mm cushioned rubber core absorbs desk vibration", "Seamless flat-lock stitched borders prevent wrist irritation", "Water-repellent spill-resistant coating cleans with a single wipe", "Neutral low-profile branding for pristine desk setups"]'::jsonb,
    '{"Dimensions": "900 x 400 x 4 mm", "Surface Material": "Micro-textured Poly-Spandex", "Base Material": "Natural Textured Rubber", "Edge Finishing": "Precision Anti-Fray Stitched Edge", "Weight": "820 grams", "Cleaning": "Damp cloth / mild detergent"}'::jsonb,
    '[{"name": "Size", "options": ["Standard (900x400mm)", "Studio XL (1000x500mm)"]}, {"name": "Contour Shade", "options": ["Chalk White on Obsidian", "Stealth Charcoal on Black"]}]'::jsonb,
    98
  ),
  (
    'ink-kc-01',
    'forged-tactical-carabiner-keychain',
    'Forged Tactical Alloy Carabiner Keychain',
    'Cast from aerospace-grade zinc-aluminum alloy with a distressed gunmetal stone-wash treatment. Fitted with hand-braided 550 military-spec nylon paracord, quick-release screw gate lock, and laser-etched metric insignia.',
    899.00,
    699.00,
    'keychains',
    45,
    true,
    false,
    'Staff Pick',
    '["Stone-washed matte gunmetal finish resists scratches and oxidization", "Threaded knurled screw-gate prevents accidental disengagement", "Fitted with 4-strand woven tactical paracord lanyard", "Solid bronze accent plate with bespoke serial stamping", "Heavy-duty spring gate tested to 10,000+ actuation cycles"]'::jsonb,
    '{"Length": "145 mm total", "Carabiner Size": "70 x 38 mm", "Material": "High-Tensile Zinc Alloy & 550 Paracord", "Mechanism": "Spring Gate + Knurled Screw Lock", "Weight": "68 grams", "Load Rating": "Utility carry (Not for climbing)"}'::jsonb,
    '[{"name": "Paracord Weave", "options": ["Olive Camo & Bronze", "Stealth Black & Gunmetal"]}]'::jsonb,
    95
  ),
  (
    'ink-mg-01',
    'brutalist-typographic-fridge-magnets-set',
    'Brutalist Architecture Typographic Magnet Set (Pack of 4)',
    'A curated quartet of thick die-cast metallic and crystal acrylic fridge magnets celebrating brutalist architectural graphics, concrete monoliths, and modernist typographic posters. Equipped with ultra-strong rare-earth Neodymium magnets.',
    649.00,
    499.00,
    'magnets',
    60,
    true,
    false,
    'Popular',
    '["Set of 4 distinct modular architectural graphics", "Heavy cast aluminum bezel frame with matte relief lettering", "Embedded N52 Neodymium rare earth magnet holds up to 12 sheets of 80gsm paper", "Non-marring rubberized backing safeguards stainless steel refrigerators", "UV-cured pigment printing ensures zero fade over time"]'::jsonb,
    '{"Units": "Set of 4 individual magnets", "Dimensions (each)": "50 x 50 x 6 mm", "Materials": "Cast Aluminum & Acrylic Glass", "Magnet Type": "Grade N52 Rare-Earth Neodymium", "Hold Strength": "Up to 12 A4 pages per magnet"}'::jsonb,
    '[{"name": "Frame Style", "options": ["Brushed Aluminum Frame", "Matte Jet Black Frame"]}]'::jsonb,
    88
  ),
  (
    'ink-ac-01',
    'stealth-aluminum-cardholder-key-lanyard',
    'Stealth RFID Aluminum Cardholder & Lanyard',
    'CNC-machined anodized aluminum minimalist cardholder with quick-eject thumb notch, RFID protection, and high-strength magnetic quick-release lanyard with blackened split ring.',
    1899.00,
    1499.00,
    'accessories',
    22,
    true,
    false,
    'Limited Run',
    '["Aviation-grade 6061-T6 aluminum chassis", "Stores up to 6 credit cards with tension silicone interior", "Integrated RFID frequency blocking shield", "Dual-magnet mechanical quick-detach lanyard connector", "Matte micro-sandblasted finish for anti-fingerprint durability"]'::jsonb,
    '{"Dimensions": "86 x 54 x 7 mm", "Capacity": "1 to 6 cards + cash under band", "Material": "Anodized 6061 Aluminum & Braided Paracord", "Locking": "Fidlock-style neodymium magnetic latch", "Weight": "54 grams"}'::jsonb,
    '[{"name": "Colorway", "options": ["Matte Obsidian", "Raw Titanium Gray"]}]'::jsonb,
    92
  ),
  (
    'ink-kc-02',
    'cast-brass-skulllock-keychain',
    'Cast Solid Brass Skull & Talon Keychain',
    'Hand-poured solid antiqued brass skull with heavy spring snap clip. Develops a unique natural patina with daily carry. Inspired by underground motorcycle and street club talisman hardware.',
    799.00,
    649.00,
    'keychains',
    35,
    true,
    false,
    NULL,
    '["100% solid brass sand-cast construction", "Hand-finished antiqued bronze oxidation", "Reinforced stainless steel pivot spring clasp", "Custom INKVISTAAR studio insignia underside stamp"]'::jsonb,
    '{"Total Length": "110 mm", "Charm Dimensions": "32 x 22 x 20 mm", "Material": "Solid Brass & Hardened Steel Ring", "Finish": "Antiqued Patina"}'::jsonb,
    '[{"name": "Finish", "options": ["Antiqued Brass", "Blackened Gunmetal"]}]'::jsonb,
    84
  ),
  (
    'ink-mp-02',
    'cyber-blueprint-monochrome-desk-mat',
    'Cyber Grid Technical Blueprint Desk Mat',
    'Isometric technical vector grid lines inspired by architectural schematics and industrial blueprint layouts. Smooth glide surface with rubberized micro-groove underbelly.',
    1599.00,
    1299.00,
    'mousepads',
    18,
    true,
    false,
    NULL,
    '["Sub-millimeter precise dye-sublimation print", "Waterproof nano-coating beads liquids for quick wiping", "Heavy 4mm thick rubber base stays firmly planted", "Narrow stitched edge maintains flat profile"]'::jsonb,
    '{"Dimensions": "900 x 400 x 4 mm", "Material": "Polyester Glide Knit + Natural Rubber Base", "Edge": "Recessed Hem Stitched Edge"}'::jsonb,
    '[{"name": "Size", "options": ["Standard (900x400mm)", "Compact (700x300mm)"]}]'::jsonb,
    79
  ),
  (
    'ink-mg-02',
    'metropolis-monolith-metal-magnet-duo',
    'Metropolis Monolith Die-Cast Magnet Duo',
    'Heavyweight zinc metal magnets sculpted with brutalist geometric towers and grid topography. Heavy industrial vibe for kitchen boards and studio memo rails.',
    499.00,
    399.00,
    'magnets',
    50,
    true,
    false,
    NULL,
    '["Cast from solid zinc alloy with textured debossed grid", "Holds thick cardstock, blueprints, and keys", "Scratch-safe rubber footings"]'::jsonb,
    '{"Units": "Set of 2 Heavy Magnets", "Weight (each)": "75 grams", "Dimensions": "48 x 48 x 8 mm"}'::jsonb,
    '[]'::jsonb,
    76
  ),
  (
    'ink-ac-02',
    'heavy-canvas-edc-accessory-pouch',
    'Heavy Duck Canvas EDC Utility Pouch',
    '16oz waxed duck canvas organizer pouch for everyday carry items, cables, key fobs, and pocket tools. Fitted with heavy YKK matte black waterproof zip and MOLLE webbing loop.',
    999.00,
    799.00,
    'accessories',
    30,
    true,
    false,
    NULL,
    '["Water-resistant 16oz paraffin-waxed cotton canvas", "YKK AquaGuard inverted reverse-coil zipper", "Internal split dividers for cables and keys", "Paracord zipper pull with heat-shrink grip"]'::jsonb,
    '{"Dimensions": "200 x 120 x 40 mm", "Material": "16oz Waxed Cotton Canvas", "Hardware": "YKK Matte Black AquaGuard"}'::jsonb,
    '[{"name": "Color", "options": ["Charcoal Black", "Field Olive"]}]'::jsonb,
    81
  )
ON CONFLICT (id) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  stock_quantity = EXCLUDED.stock_quantity;

-- Insert matching product images
INSERT INTO public.product_images (product_id, image_url, display_order, is_primary)
VALUES
  ('ink-mp-01', '/src/assets/images/product_desk_mousepad_1793982914309.jpg', 0, true),
  ('ink-mp-01', '/src/assets/images/hero_campaign_banner_1793982914350.jpg', 1, false),
  ('ink-kc-01', '/src/assets/images/product_metal_keychain_1793982916309.jpg', 0, true),
  ('ink-kc-01', '/src/assets/images/hero_campaign_banner_1793982914350.jpg', 1, false),
  ('ink-mg-01', '/src/assets/images/product_fridge_magnets_1793982916050.jpg', 0, true),
  ('ink-ac-01', '/src/assets/images/product_urban_cardholder_1793982916522.jpg', 0, true),
  ('ink-kc-02', '/src/assets/images/hero_campaign_banner_1793982914350.jpg', 0, true),
  ('ink-kc-02', '/src/assets/images/product_metal_keychain_1793982916309.jpg', 1, false),
  ('ink-mp-02', '/src/assets/images/product_desk_mousepad_1793982914309.jpg', 0, true),
  ('ink-mg-02', '/src/assets/images/product_fridge_magnets_1793982916050.jpg', 0, true),
  ('ink-ac-02', '/src/assets/images/hero_campaign_banner_1793982914350.jpg', 0, true),
  ('ink-ac-02', '/src/assets/images/product_urban_cardholder_1793982916522.jpg', 1, false)
ON CONFLICT DO NOTHING;

-- Seed initial orders
INSERT INTO public.orders (
  id, order_number, customer_name, phone, email, delivery_address, city, state, pin_code, subtotal, delivery_fee, total_amount, payment_method, payment_status, order_status, tracking_number, courier, estimated_delivery
)
VALUES
  ('ord-8491', 'INK-8491', 'Rohan Deshmukh', '+91 98201 44521', 'rohan.d@example.com', 'Flat 402, Skyline Residency, Bandra West', 'Mumbai', 'Maharashtra', '400050', 1898.00, 0.00, 1898.00, 'UPI / QR', 'Completed', 'Shipped', 'DELHIVERY-984420182IN', 'Delhivery Surface Express', 'November 08, 2026'),
  ('ord-8472', 'INK-8472', 'Ananya Sharma', '+91 97112 88390', 'ananya.sharma@example.com', 'Plot 18, Sector 14, Urban Enclave', 'Gurugram', 'Haryana', '122001', 998.00, 0.00, 998.00, 'Credit/Debit Card', 'Completed', 'Delivered', 'BLUEDART-551029481', 'Blue Dart Air', 'November 05, 2026'),
  ('ord-8503', 'INK-8503', 'Vikram Mehta', '+91 94481 02938', 'vikram.m@example.com', '77 Indiranagar 100ft Road, 2nd Stage', 'Bengaluru', 'Karnataka', '560038', 1499.00, 0.00, 1499.00, 'UPI / QR', 'Completed', 'Processing', 'XPRESSBEES-78810293', 'Xpressbees Priority', 'November 09, 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, selected_variant_text, image_url)
VALUES
  ('ord-8491', 'ink-mp-01', 'Topographic Contour Precision Desk Mat', 1, 1199.00, 'Size: Standard (900x400mm), Contour Shade: Chalk White on Obsidian', '/src/assets/images/product_desk_mousepad_1793982914309.jpg'),
  ('ord-8491', 'ink-kc-01', 'Forged Tactical Alloy Carabiner Keychain', 1, 699.00, 'Paracord Weave: Stealth Black & Gunmetal', '/src/assets/images/product_metal_keychain_1793982916309.jpg'),
  ('ord-8472', 'ink-mg-01', 'Brutalist Architecture Typographic Magnet Set', 2, 499.00, 'Frame Style: Brushed Aluminum Frame', '/src/assets/images/product_fridge_magnets_1793982916050.jpg'),
  ('ord-8503', 'ink-ac-01', 'Stealth RFID Aluminum Cardholder & Lanyard', 1, 1499.00, 'Colorway: Matte Obsidian', '/src/assets/images/product_urban_cardholder_1793982916522.jpg')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- STORAGE BUCKET POLICIES (Run in SQL Editor after creating the 'product-images' bucket)
-- =========================================================================

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in product-images
CREATE POLICY "Public Read Access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only authenticated admins can upload/update/delete
CREATE POLICY "Admin Upload Access on product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Update Access on product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Delete Access on product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
