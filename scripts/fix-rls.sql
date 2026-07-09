-- =============================================
-- PAŞA MOTOR — RLS GÜVENLİK YAMASI
-- Supabase SQL Editor'de çalıştırın
-- =============================================

-- 1. site_content — TAMAMEN KAPALI (token içerebilir)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON site_content FROM anon;
REVOKE ALL ON site_content FROM authenticated;

-- Sadece service_role okuyabilir
CREATE POLICY "site_content_service_only"
ON site_content FOR ALL
USING (false);  -- hiç kimse erişemesin

-- 2. posts — PUBLIC okuma, sadece admin yazma
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_public_read" ON posts;
CREATE POLICY "posts_public_read"
ON posts FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "posts_admin_all" ON posts;
CREATE POLICY "posts_admin_all"
ON posts FOR ALL
USING (auth.role() = 'authenticated');

-- 3. products — PUBLIC okuma, sadece admin yazma
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read"
ON products FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all"
ON products FOR ALL
USING (auth.role() = 'authenticated');

-- 4. gallery_images — PUBLIC okuma, admin yazma
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gallery_public_read" ON gallery_images;
CREATE POLICY "gallery_public_read"
ON gallery_images FOR SELECT
USING (true);

DROP POLICY IF EXISTS "gallery_admin_write" ON gallery_images;
CREATE POLICY "gallery_admin_write"
ON gallery_images FOR ALL
USING (auth.role() = 'authenticated');

-- 5. pages — PUBLIC okuma, admin yazma
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_public_read" ON pages;
CREATE POLICY "pages_public_read"
ON pages FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "pages_admin_all" ON pages;
CREATE POLICY "pages_admin_all"
ON pages FOR ALL
USING (auth.role() = 'authenticated');

-- 6. faqs — PUBLIC okuma, admin yazma
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faqs_public_read" ON faqs;
CREATE POLICY "faqs_public_read"
ON faqs FOR SELECT
USING (true);

DROP POLICY IF EXISTS "faqs_admin_write" ON faqs;
CREATE POLICY "faqs_admin_write"
ON faqs FOR ALL
USING (auth.role() = 'authenticated');

-- 7. Diğer tüm tabloları tara ve RLS yoksa ekle
-- (messages, users, settings, ai_logs vb.)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_admin_only"
ON messages FOR ALL
USING (auth.role() = 'authenticated');

ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_logs_admin_only"
ON ai_logs FOR ALL
USING (auth.role() = 'authenticated');

-- Hangi tablolarda RLS olmadığını kontrol et
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC;
