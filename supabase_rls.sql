-- 3a. Products tablosu
CREATE OR REPLACE VIEW public.products_public AS
SELECT
  id, brand, category, title, slug,
  LEFT(description, 200) as description_preview,
  images, is_active, is_featured, created_at
FROM public.products
WHERE is_active = true;

-- (Not: View için RLS kurmak Supabase/PostgreSQL'de view sahipliği ile ilgili ayarlara bağlıdır. Supabase default'ta table-level kullanır)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products only" ON public.products
  FOR SELECT USING (is_active = true);

-- 3b. Posts tablosu
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON public.posts
  FOR SELECT USING (is_published = true OR is_published IS NULL);

-- 3c. Pages tablosu
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pages" ON public.pages
  FOR SELECT USING (true);

-- 3d. Admin tablolarını koru
ALTER TABLE public.admin_backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No anon access" ON public.admin_backups FOR ALL USING (false);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No anon access" ON public.suppliers FOR ALL USING (false);

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No anon access" ON public.ai_logs FOR ALL USING (false);

ALTER TABLE public.service_order_parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No anon access" ON public.service_order_parts FOR ALL USING (false);

-- 3e. Users tablosu (Eğer varsa)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 3f. site_content tablosu (Popup, Hizmetler, Duyurular, Markalar, Animasyonlar)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all site_content" ON public.site_content;
DROP POLICY IF EXISTS "Public read non-sensitive site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin full access site_content" ON public.site_content;

-- Anonim/Ziyaretçi kullanıcılar sadece hassas olmayan site içeriklerini okuyabilir (Token ve ayarlar gizli kalır)
CREATE POLICY "Public read non-sensitive site_content" ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (page_key NOT IN ('github_settings', 'google_oauth_settings', 'admin_settings'));

-- Tüm yazma ve hassas okuma işlemleri sadece sunucu (service_role) veya yetkili adminler tarafından yapılabilir
CREATE POLICY "Service role full access site_content" ON public.site_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3g. Supabase Storage (Görsel ve Dosya Yükleme RLS İzinleri)
-- "new row violates row-level security policy" hatasını çözmek için Supabase SQL Editor'de çalıştırın:
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, service_role;

-- product-images bucket'ını otomatik oluştur (yoksa)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage nesneleri için tam erişim politikası
DROP POLICY IF EXISTS "Allow All Storage Objects" ON storage.objects;
CREATE POLICY "Allow All Storage Objects" ON storage.objects
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Storage bucket'ları için tam erişim politikası
DROP POLICY IF EXISTS "Allow All Storage Buckets" ON storage.buckets;
CREATE POLICY "Allow All Storage Buckets" ON storage.buckets
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);
