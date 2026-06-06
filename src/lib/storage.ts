import { supabase } from './supabase-client';

const BUCKET = 'product-images'; // Adjust if different

export async function uploadToStorage(
  path: string,
  file: Blob,
  contentType: string = 'image/webp'
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType, upsert: false });

    if (error) return { url: null, error: error.message };

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Yükleme başarısız' };
  }
}

export async function deleteFromStorage(
  path: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);
    return { error: error?.message || null };
  } catch (err: any) {
    return { error: err.message };
  }
}
