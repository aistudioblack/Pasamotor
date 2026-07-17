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
