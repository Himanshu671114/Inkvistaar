import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ink-mp-01',
    slug: 'topographic-contour-desk-mat',
    name: 'Topographic Contour Precision Desk Mat',
    category: 'mousepads',
    price: 1499,
    salePrice: 1199,
    stock: 28,
    images: [
      '/src/assets/images/product_desk_mousepad_1793982914309.jpg',
      '/src/assets/images/hero_campaign_banner_1793982914350.jpg',
    ],
    description: 'Engineered for high-friction control and glide consistency. The Topographic Contour Desk Mat features micro-woven textured fabric, reinforced 360° anti-fray perimeter stitching, and a natural non-slip rubber base. High-definition screen printed contours with fade-resistant pigments.',
    features: [
      'Micro-woven poly-spandex glide surface for high DPI tracking',
      'Ultra-dense 4mm cushioned rubber core absorbs desk vibration',
      'Seamless flat-lock stitched borders prevent wrist irritation',
      'Water-repellent spill-resistant coating cleans with a single wipe',
      'Neutral low-profile branding for pristine desk setups'
    ],
    specifications: {
      'Dimensions': '900 x 400 x 4 mm',
      'Surface Material': 'Micro-textured Poly-Spandex',
      'Base Material': 'Natural Textured Rubber',
      'Edge Finishing': 'Precision Anti-Fray Stitched Edge',
      'Weight': '820 grams',
      'Cleaning': 'Damp cloth / mild detergent'
    },
    variants: [
      {
        name: 'Size',
        options: ['Standard (900x400mm)', 'Studio XL (1000x500mm)']
      },
      {
        name: 'Contour Shade',
        options: ['Chalk White on Obsidian', 'Stealth Charcoal on Black']
      }
    ],
    badge: 'Bestseller',
    isNew: false,
    isBestseller: true,
    popularity: 98,
    createdAt: '2025-01-15',
    published: true
  },
  {
    id: 'ink-kc-01',
    slug: 'forged-tactical-carabiner-keychain',
    name: 'Forged Tactical Alloy Carabiner Keychain',
    category: 'keychains',
    price: 899,
    salePrice: 699,
    stock: 45,
    images: [
      '/src/assets/images/product_metal_keychain_1793982916309.jpg',
      '/src/assets/images/hero_campaign_banner_1793982914350.jpg',
    ],
    description: 'Cast from aerospace-grade zinc-aluminum alloy with a distressed gunmetal stone-wash treatment. Fitted with hand-braided 550 military-spec nylon paracord, quick-release screw gate lock, and laser-etched metric insignia.',
    features: [
      'Stone-washed matte gunmetal finish resists scratches and oxidization',
      'Threaded knurled screw-gate prevents accidental disengagement',
      'Fitted with 4-strand woven tactical paracord lanyard',
      'Solid bronze accent plate with bespoke serial stamping',
      'Heavy-duty spring gate tested to 10,000+ actuation cycles'
    ],
    specifications: {
      'Length': '145 mm total',
      'Carabiner Size': '70 x 38 mm',
      'Material': 'High-Tensile Zinc Alloy & 550 Paracord',
      'Mechanism': 'Spring Gate + Knurled Screw Lock',
      'Weight': '68 grams',
      'Load Rating': 'Utility carry (Not for climbing)'
    },
    variants: [
      {
        name: 'Paracord Weave',
        options: ['Olive Camo & Bronze', 'Stealth Black & Gunmetal']
      }
    ],
    badge: 'Staff Pick',
    isNew: true,
    isBestseller: true,
    popularity: 95,
    createdAt: '2025-02-10',
    published: true
  },
  {
    id: 'ink-mg-01',
    slug: 'brutalist-typographic-fridge-magnets-set',
    name: 'Brutalist Architecture Typographic Magnet Set (Pack of 4)',
    category: 'magnets',
    price: 649,
    salePrice: 499,
    stock: 60,
    images: [
      '/src/assets/images/product_fridge_magnets_1793982916050.jpg',
    ],
    description: 'A curated quartet of thick die-cast metallic and crystal acrylic fridge magnets celebrating brutalist architectural graphics, concrete monoliths, and modernist typographic posters. Equipped with ultra-strong rare-earth Neodymium magnets.',
    features: [
      'Set of 4 distinct modular architectural graphics',
      'Heavy cast aluminum bezel frame with matte relief lettering',
      'Embedded N52 Neodymium rare earth magnet holds up to 12 sheets of 80gsm paper',
      'Non-marring rubberized backing safeguards stainless steel refrigerators',
      'UV-cured pigment printing ensures zero fade over time'
    ],
    specifications: {
      'Units': 'Set of 4 individual magnets',
      'Dimensions (each)': '50 x 50 x 6 mm',
      'Materials': 'Cast Aluminum & Acrylic Glass',
      'Magnet Type': 'Grade N52 Rare-Earth Neodymium',
      'Hold Strength': 'Up to 12 A4 pages per magnet'
    },
    variants: [
      {
        name: 'Frame Style',
        options: ['Brushed Aluminum Frame', 'Matte Jet Black Frame']
      }
    ],
    badge: 'Popular',
    isNew: true,
    isBestseller: false,
    popularity: 88,
    createdAt: '2025-02-01',
    published: true
  },
  {
    id: 'ink-ac-01',
    slug: 'stealth-aluminum-cardholder-key-lanyard',
    name: 'Stealth RFID Aluminum Cardholder & Lanyard',
    category: 'accessories',
    price: 1899,
    salePrice: 1499,
    stock: 22,
    images: [
      '/src/assets/images/product_urban_cardholder_1793982916522.jpg',
    ],
    description: 'CNC-machined anodized aluminum minimalist cardholder with quick-eject thumb notch, RFID protection, and high-strength magnetic quick-release lanyard with blackened split ring.',
    features: [
      'Aviation-grade 6061-T6 aluminum chassis',
      'Stores up to 6 credit cards with tension silicone interior',
      'Integrated RFID frequency blocking shield',
      'Dual-magnet mechanical quick-detach lanyard connector',
      'Matte micro-sandblasted finish for anti-fingerprint durability'
    ],
    specifications: {
      'Dimensions': '86 x 54 x 7 mm',
      'Capacity': '1 to 6 cards + cash under band',
      'Material': 'Anodized 6061 Aluminum & Braided Paracord',
      'Locking': 'Fidlock-style neodymium magnetic latch',
      'Weight': '54 grams'
    },
    variants: [
      {
        name: 'Colorway',
        options: ['Matte Obsidian', 'Raw Titanium Gray']
      }
    ],
    badge: 'Limited Run',
    isNew: true,
    isBestseller: true,
    popularity: 92,
    createdAt: '2025-02-18',
    published: true
  },
  {
    id: 'ink-kc-02',
    slug: 'cast-brass-skulllock-keychain',
    name: 'Cast Solid Brass Skull & Talon Keychain',
    category: 'keychains',
    price: 799,
    salePrice: 649,
    stock: 35,
    images: [
      '/src/assets/images/hero_campaign_banner_1793982914350.jpg',
      '/src/assets/images/product_metal_keychain_1793982916309.jpg',
    ],
    description: 'Hand-poured solid antiqued brass skull with heavy spring snap clip. Develops a unique natural patina with daily carry. Inspired by underground motorcycle and street club talisman hardware.',
    features: [
      '100% solid brass sand-cast construction',
      'Hand-finished antiqued bronze oxidation',
      'Reinforced stainless steel pivot spring clasp',
      'Custom INKVISTAAR studio insignia underside stamp'
    ],
    specifications: {
      'Total Length': '110 mm',
      'Charm Dimensions': '32 x 22 x 20 mm',
      'Material': 'Solid Brass & Hardened Steel Ring',
      'Finish': 'Antiqued Patina'
    },
    variants: [
      {
        name: 'Finish',
        options: ['Antiqued Brass', 'Blackened Gunmetal']
      }
    ],
    popularity: 84,
    createdAt: '2025-01-20',
    published: true
  },
  {
    id: 'ink-mp-02',
    slug: 'cyber-blueprint-monochrome-desk-mat',
    name: 'Cyber Grid Technical Blueprint Desk Mat',
    category: 'mousepads',
    price: 1599,
    salePrice: 1299,
    stock: 18,
    images: [
      '/src/assets/images/product_desk_mousepad_1793982914309.jpg',
      '/src/assets/images/hero_campaign_banner_1793982914350.jpg',
    ],
    description: 'Isometric technical vector grid lines inspired by architectural schematics and industrial blueprint layouts. Smooth glide surface with rubberized micro-groove underbelly.',
    features: [
      'Sub-millimeter precise dye-sublimation print',
      'Waterproof nano-coating beads liquids for quick wiping',
      'Heavy 4mm thick rubber base stays firmly planted',
      'Narrow stitched edge maintains flat profile'
    ],
    specifications: {
      'Dimensions': '900 x 400 x 4 mm',
      'Material': 'Polyester Glide Knit + Natural Rubber Base',
      'Edge': 'Recessed Hem Stitched Edge'
    },
    variants: [
      {
        name: 'Size',
        options: ['Standard (900x400mm)', 'Compact (700x300mm)']
      }
    ],
    popularity: 79,
    createdAt: '2025-01-28',
    published: true
  },
  {
    id: 'ink-mg-02',
    slug: 'metropolis-monolith-metal-magnet-duo',
    name: 'Metropolis Monolith Die-Cast Magnet Duo',
    category: 'magnets',
    price: 499,
    salePrice: 399,
    stock: 50,
    images: [
      '/src/assets/images/product_fridge_magnets_1793982916050.jpg',
    ],
    description: 'Heavyweight zinc metal magnets sculpted with brutalist geometric towers and grid topography. Heavy industrial vibe for kitchen boards and studio memo rails.',
    features: [
      'Cast from solid zinc alloy with textured debossed grid',
      'Holds thick cardstock, blueprints, and keys',
      'Scratch-safe rubber footings'
    ],
    specifications: {
      'Units': 'Set of 2 Heavy Magnets',
      'Weight (each)': '75 grams',
      'Dimensions': '48 x 48 x 8 mm'
    },
    popularity: 76,
    createdAt: '2025-02-05',
    published: true
  },
  {
    id: 'ink-ac-02',
    slug: 'heavy-canvas-edc-accessory-pouch',
    name: 'Heavy Duck Canvas EDC Utility Pouch',
    category: 'accessories',
    price: 999,
    salePrice: 799,
    stock: 30,
    images: [
      '/src/assets/images/hero_campaign_banner_1793982914350.jpg',
      '/src/assets/images/product_urban_cardholder_1793982916522.jpg',
    ],
    description: '16oz waxed duck canvas organizer pouch for everyday carry items, cables, key fobs, and pocket tools. Fitted with heavy YKK matte black waterproof zip and MOLLE webbing loop.',
    features: [
      'Water-resistant 16oz paraffin-waxed cotton canvas',
      'YKK AquaGuard inverted reverse-coil zipper',
      'Internal split dividers for cables and keys',
      'Paracord zipper pull with heat-shrink grip'
    ],
    specifications: {
      'Dimensions': '200 x 120 x 40 mm',
      'Material': '16oz Waxed Cotton Canvas',
      'Hardware': 'YKK Matte Black AquaGuard'
    },
    variants: [
      {
        name: 'Color',
        options: ['Charcoal Black', 'Field Olive']
      }
    ],
    popularity: 81,
    createdAt: '2025-02-12',
    published: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8491',
    orderNumber: 'INK-8491',
    createdAt: '2026-11-04T14:22:00Z',
    customer: {
      fullName: 'Rohan Deshmukh',
      phone: '+91 98201 44521',
      email: 'rohan.d@example.com',
      address: 'Flat 402, Skyline Residency, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400050'
    },
    items: [
      {
        productId: 'ink-mp-01',
        name: 'Topographic Contour Precision Desk Mat',
        price: 1199,
        quantity: 1,
        selectedVariantText: 'Size: Standard (900x400mm), Contour Shade: Chalk White on Obsidian',
        image: '/src/assets/images/product_desk_mousepad_1793982914309.jpg'
      },
      {
        productId: 'ink-kc-01',
        name: 'Forged Tactical Alloy Carabiner Keychain',
        price: 699,
        quantity: 1,
        selectedVariantText: 'Paracord Weave: Stealth Black & Gunmetal',
        image: '/src/assets/images/product_metal_keychain_1793982916309.jpg'
      }
    ],
    subtotal: 1898,
    deliveryFee: 0,
    total: 1898,
    paymentMethod: 'UPI / QR',
    paymentStatus: 'Completed',
    status: 'Shipped',
    trackingNumber: 'DELHIVERY-984420182IN',
    courier: 'Delhivery Surface Express',
    estimatedDelivery: 'November 08, 2026'
  },
  {
    id: 'ord-8472',
    orderNumber: 'INK-8472',
    createdAt: '2026-11-02T11:10:00Z',
    customer: {
      fullName: 'Ananya Sharma',
      phone: '+91 97112 88390',
      email: 'ananya.sharma@example.com',
      address: 'Plot 18, Sector 14, Urban Enclave',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122001'
    },
    items: [
      {
        productId: 'ink-mg-01',
        name: 'Brutalist Architecture Typographic Magnet Set',
        price: 499,
        quantity: 2,
        selectedVariantText: 'Frame Style: Brushed Aluminum Frame',
        image: '/src/assets/images/product_fridge_magnets_1793982916050.jpg'
      }
    ],
    subtotal: 998,
    deliveryFee: 0,
    total: 998,
    paymentMethod: 'Credit/Debit Card',
    paymentStatus: 'Completed',
    status: 'Delivered',
    trackingNumber: 'BLUEDART-551029481',
    courier: 'Blue Dart Air',
    estimatedDelivery: 'November 05, 2026'
  },
  {
    id: 'ord-8503',
    orderNumber: 'INK-8503',
    createdAt: '2026-11-06T06:15:00Z',
    customer: {
      fullName: 'Vikram Mehta',
      phone: '+91 94481 02938',
      email: 'vikram.m@example.com',
      address: '77 Indiranagar 100ft Road, 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038'
    },
    items: [
      {
        productId: 'ink-ac-01',
        name: 'Stealth RFID Aluminum Cardholder & Lanyard',
        price: 1499,
        quantity: 1,
        selectedVariantText: 'Colorway: Matte Obsidian',
        image: '/src/assets/images/product_urban_cardholder_1793982916522.jpg'
      }
    ],
    subtotal: 1499,
    deliveryFee: 0,
    total: 1499,
    paymentMethod: 'UPI / QR',
    paymentStatus: 'Completed',
    status: 'Processing',
    trackingNumber: 'XPRESSBEES-78810293',
    courier: 'Xpressbees Priority',
    estimatedDelivery: 'November 09, 2026'
  }
];
