import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  Check,
  Upload,
  Archive,
  RotateCcw,
  Star,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { uploadProductImage } from '../../lib/storage';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    archiveProduct,
    togglePublishProduct,
    isLoadingDb,
    refetchData,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tabFilter, setTabFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewingProduct, setPreviewingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    category: ProductCategory;
    price: number;
    salePrice: number;
    stock: number;
    images: string[];
    description: string;
    features: string[];
    badge: string;
    popularity: number;
    published: boolean;
    archived: boolean;
    featureInput: string;
  }>({
    name: '',
    slug: '',
    category: 'keychains',
    price: 999,
    salePrice: 799,
    stock: 25,
    images: ['/src/assets/images/product_metal_keychain_1793982916309.jpg'],
    description: '',
    features: ['High durability', 'Engineered for daily utility'],
    badge: '',
    popularity: 80,
    published: true,
    archived: false,
    featureInput: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableImagePresets = [
    { label: 'Forged Carabiner Keychain', url: '/src/assets/images/product_metal_keychain_1793982916309.jpg' },
    { label: 'Contour Desk Mat (XL)', url: '/src/assets/images/product_desk_mousepad_1793982914309.jpg' },
    { label: 'Brutalist Fridge Magnets', url: '/src/assets/images/product_fridge_magnets_1793982916050.jpg' },
    { label: 'EDC Aluminum Cardholder', url: '/src/assets/images/product_urban_cardholder_1793982916522.jpg' },
    { label: 'Campaign Drop Hardware', url: '/src/assets/images/hero_campaign_banner_1793982914350.jpg' },
  ];

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'keychains',
      price: 999,
      salePrice: 799,
      stock: 30,
      images: ['/src/assets/images/product_metal_keychain_1793982916309.jpg'],
      description: 'Handcrafted utilitarian merchandise designed for everyday carry and workstation aesthetics.',
      features: ['Precision engineered', 'Matte oxidation finish', 'Complimentary gift packaging'],
      badge: 'New Drop',
      popularity: 85,
      published: true,
      archived: false,
      featureInput: '',
    });
    setUploadError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      price: prod.price,
      salePrice: prod.salePrice || 0,
      stock: prod.stock,
      images: prod.images && prod.images.length > 0 ? prod.images : ['/src/assets/images/hero_campaign_banner_1793982914350.jpg'],
      description: prod.description,
      features: prod.features || [],
      badge: prod.badge || '',
      popularity: prod.popularity,
      published: prod.published,
      archived: prod.archived || false,
      featureInput: '',
    });
    setUploadError(null);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadProductImage(file);
        if (res.error) {
          throw new Error(res.error);
        }
        if (res.url) {
          uploadedUrls.push(res.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Image upload to Supabase Storage failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: updated.length > 0 ? updated : ['/src/assets/images/hero_campaign_banner_1793982914350.jpg'],
      };
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...prev.images];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return { ...prev, images: copy };
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const copy = [...prev.images];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, images: copy };
    });
  };

  const handleAddFeature = () => {
    if (!formData.featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, prev.featureInput.trim()],
      featureInput: '',
    }));
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    if (editingProduct) {
      await updateProduct({
        ...editingProduct,
        ...formData,
        slug: finalSlug,
        salePrice: formData.salePrice > 0 ? formData.salePrice : undefined,
      });
    } else {
      await addProduct({
        ...formData,
        slug: finalSlug,
        salePrice: formData.salePrice > 0 ? formData.salePrice : undefined,
        specifications: {
          Origin: 'Bengaluru Studio',
          Material: 'High-Density Utility Hardware',
          Warranty: '1 Year Warranty',
        },
      });
    }

    setIsSubmitting(false);
    setModalOpen(false);
  };

  const filtered = products
    .filter((p) => {
      if (categoryFilter === 'all') return true;
      return p.category === categoryFilter;
    })
    .filter((p) => {
      if (tabFilter === 'published') return p.published && !p.archived;
      if (tabFilter === 'draft') return !p.published && !p.archived;
      if (tabFilter === 'archived') return p.archived;
      return true;
    })
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-neutral-950">
            Product Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Database-backed catalog management. Upload high-res photography to Supabase Storage and publish to customer storefront.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetchData()}
            className="p-2.5 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw size={15} className={isLoadingDb ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-5 rounded-full flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Products', count: products.length },
            { id: 'published', label: 'Published & Live', count: products.filter((p) => p.published && !p.archived).length },
            { id: 'draft', label: 'Drafts', count: products.filter((p) => !p.published && !p.archived).length },
            { id: 'archived', label: 'Archived', count: products.filter((p) => p.archived).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id as any)}
              className={`py-2 px-3.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tabFilter === tab.id
                  ? 'border-neutral-950 text-neutral-950 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[11px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-3 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search merchandise by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-neutral-950"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs py-2 px-3 rounded-xl focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500 font-semibold bg-neutral-50/60">
              <th className="py-3.5 px-4">Item & Images</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">
                  No merchandise items match the current query or filter.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        {product.images.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] px-1 rounded-full">
                            +{product.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-display font-semibold text-neutral-950 text-sm block">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                          <span>/{product.slug}</span>
                          {product.badge && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-medium">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-neutral-700 font-medium">
                    {product.category}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <span className="font-semibold text-neutral-950">₹{product.salePrice ?? product.price}</span>
                    {product.salePrice && (
                      <span className="line-through text-neutral-400 ml-1.5">₹{product.price}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <span className={product.stock < 15 ? 'text-amber-600 font-semibold' : 'text-neutral-700'}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublishProduct(product.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                          product.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                        }`}
                        title="Toggle live visibility on storefront"
                      >
                        {product.published ? <Eye size={11} /> : <EyeOff size={11} />}
                        <span>{product.published ? 'Published' : 'Draft'}</span>
                      </button>

                      {product.archived && (
                        <span className="bg-neutral-200 text-neutral-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Archived
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setPreviewingProduct(product);
                          setPreviewModalOpen(true);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer rounded-lg hover:bg-neutral-100"
                        title="Preview Storefront Presentation"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer rounded-lg hover:bg-neutral-100"
                        title="Edit Product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => archiveProduct(product.id, !product.archived)}
                        className="p-1.5 text-neutral-500 hover:text-amber-700 transition-colors cursor-pointer rounded-lg hover:bg-neutral-100"
                        title={product.archived ? 'Unarchive Product' : 'Archive Product'}
                      >
                        {product.archived ? <RotateCcw size={14} /> : <Archive size={14} />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-neutral-100"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isSubmitting && setModalOpen(false)}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                  Supabase Database Entry
                </span>
                <h3 className="font-display font-bold text-lg text-neutral-950">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Merchandise Item'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tactical Zinc Alloy Keychain"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">URL Slug (Auto-generated if blank)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="tactical-zinc-keychain"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller / Staff Pick"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3.5 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">Storefront Visibility</label>
                  <select
                    value={formData.published ? 'published' : 'draft'}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value === 'published' })}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm px-3 py-2.5 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Multiple Images Management */}
              <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-neutral-900 font-semibold text-xs">
                      Product Images ({formData.images.length})
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      The first image is designated as Primary. Use controls to reorder, set primary, or remove.
                    </p>
                  </div>

                  {/* Upload to Supabase Storage Button */}
                  <label className="inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium py-1.5 px-3 rounded-full cursor-pointer transition-colors">
                    <Upload size={13} />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image List Preview & Reordering */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative group bg-white border rounded-2xl overflow-hidden p-2 flex flex-col justify-between ${
                        idx === 0 ? 'border-neutral-950 ring-1 ring-neutral-950' : 'border-neutral-200'
                      }`}
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-neutral-950 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            <span>Primary</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-neutral-500 hover:text-black disabled:opacity-30"
                            title="Move Earlier"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'down')}
                            disabled={idx === formData.images.length - 1}
                            className="p-1 text-neutral-500 hover:text-black disabled:opacity-30"
                            title="Move Later"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-neutral-600 hover:text-neutral-950 underline font-medium"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-neutral-400 hover:text-red-600 p-1"
                            title="Remove Photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preset quick picks */}
                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-[11px] text-neutral-500 block mb-1.5">Or attach from Inkvistaar signature presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableImagePresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => {
                          if (!formData.images.includes(preset.url)) {
                            setFormData((prev) => ({ ...prev, images: [...prev.images, preset.url] }));
                          }
                        }}
                        className="text-[11px] bg-white border border-neutral-200 hover:border-neutral-950 px-2.5 py-1 rounded-full text-neutral-700 transition-colors"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm p-3 rounded-xl focus:border-neutral-950 focus:outline-none focus:bg-white transition-colors font-sans"
                />
              </div>

              {/* Feature Bullet Points */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">Craftsmanship Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.featureInput}
                    onChange={(e) => setFormData({ ...formData, featureInput: e.target.value })}
                    placeholder="e.g. Reinforced 360° flat-lock perimeter stitching"
                    className="flex-1 bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs px-3 py-2 rounded-xl focus:border-neutral-950 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900 px-3.5 py-2 rounded-xl text-xs font-semibold"
                  >
                    Add Point
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-100 text-neutral-800 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-medium text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold text-xs px-6 py-2.5 rounded-full cursor-pointer transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Saving to Database...' : editingProduct ? 'Update Product' : 'Create Merchandise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Preview Modal */}
      {previewModalOpen && previewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPreviewModalOpen(false)}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">
                  Storefront Preview
                </span>
                <h3 className="font-display font-bold text-lg text-neutral-950">
                  {previewingProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={previewingProduct.images[0]}
                alt={previewingProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 capitalize">{previewingProduct.category}</span>
                <span className="text-base font-semibold text-neutral-950">
                  ₹{previewingProduct.salePrice ?? previewingProduct.price}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {previewingProduct.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs">
              <span className={previewingProduct.published ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                Status: {previewingProduct.published ? 'Published to Storefront' : 'Draft (Admin Only)'}
              </span>
              <a
                href={`/product/${previewingProduct.slug}`}
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-950 text-white px-4 py-2 rounded-full font-semibold hover:bg-neutral-800 transition-colors"
              >
                Open Live Page →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
