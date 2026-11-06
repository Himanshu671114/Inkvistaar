import { supabase } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload an image file to Supabase Storage bucket 'product-images'
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    console.error('Storage upload error:', err);
    return {
      url: '',
      path: '',
      error: err.message || 'Image upload failed',
    };
  }
}

/**
 * Delete an image file from Supabase Storage
 */
export async function deleteProductImage(pathOrUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // If it's a full public URL, extract the path inside 'product-images'
    let path = pathOrUrl;
    if (pathOrUrl.includes('/product-images/')) {
      path = pathOrUrl.split('/product-images/')[1];
    }

    const { error } = await supabase.storage
      .from('product-images')
      .remove([path]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Storage delete error:', err);
    return { success: false, error: err.message };
  }
}
