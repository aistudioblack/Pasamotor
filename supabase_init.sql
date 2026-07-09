-- Supabase Schema & RLS Setup Script
-- Executing this in Supabase SQL Editor will create all required tables and permissions for your project.

-- 1. DROP EXISTING CONFLICTS (Optional - remove comment dashes if you want a clean slate)
-- DROP TABLE IF EXISTS public.users, public.pages, public.admin_backups, public.products, public.posts, public.messages, public.gallery_images, public.faqs, public.site_content, public.suppliers, public.sync_jobs, public.supplier_products, public.product_mappings, public.pricing_rules, public.ai_logs, public.admin_audit_logs CASCADE;
-- DROP TYPE IF EXISTS app_role CASCADE;

-- 2. CREATE ENUMS
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CREATE TABLES

-- users (public profile extension for auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role app_role DEFAULT 'user',
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL
);

-- pages
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_backups
CREATE TABLE IF NOT EXISTS public.admin_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
  description TEXT,
  content TEXT,
  price NUMERIC,
  original_price NUMERIC,
  stock INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- gallery_images
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- faqs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- site_content
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  body TEXT,
  hero_image TEXT,
  sections JSONB,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- suppliers 
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  feed_url TEXT,
  portal_url TEXT,
  customer_code TEXT,
  user_code TEXT,
  password_encrypted TEXT,
  field_mapping JSONB,
  margin_percent NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_interval_minutes INTEGER DEFAULT 1440,
  is_initialized BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  last_full_import_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- sync_jobs
CREATE TABLE IF NOT EXISTS public.sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  items_total INTEGER,
  items_created INTEGER,
  items_updated INTEGER,
  items_skipped INTEGER,
  items_failed INTEGER,
  details JSONB,
  error_message TEXT,
  duration_ms INTEGER,
  triggered_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ 
);

-- supplier_products
CREATE TABLE IF NOT EXISTS public.supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  supplier_sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  description TEXT,
  image_url TEXT,
  raw_price NUMERIC,
  final_price NUMERIC,
  stock INTEGER,
  published_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  last_price_check_at TIMESTAMPTZ,
  last_full_sync_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- product_mappings
CREATE TABLE IF NOT EXISTS public.product_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL, 
  supplier_sku TEXT NOT NULL,
  override_sku TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- pricing_rules
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  scope TEXT NOT NULL,
  category TEXT,
  margin_percent NUMERIC NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_orders
CREATE TABLE IF NOT EXISTS public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  km TEXT,
  complaint TEXT,
  status TEXT DEFAULT 'Açık',
  mechanic TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_order_parts
CREATE TABLE IF NOT EXISTS public.service_order_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ai_logs
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, 
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  input JSONB,
  output JSONB,
  error_message TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_audit_logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_slug TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENABLE ROW LEVEL SECURITY

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. APPLY POLICIES

-- Public Read Access Policies
CREATE POLICY "Public Read Access" ON public.pages FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Public Read Access" ON public.products FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Public Read Access" ON public.posts FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Public Read Access" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.faqs FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Public Read Access" ON public.site_content FOR SELECT USING (true);

-- Allow public to send messages (INSERT)
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Authenticated Admin Access Policies
CREATE POLICY "Auth Full Access users" ON public.users FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access user_roles" ON public.user_roles FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access pages" ON public.pages FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access admin_backups" ON public.admin_backups FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access posts" ON public.posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access messages" ON public.messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access gallery" ON public.gallery_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access faqs" ON public.faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access site" ON public.site_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access suppliers" ON public.suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access jobs" ON public.sync_jobs FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access supp_prod" ON public.supplier_products FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access prod_maps" ON public.product_mappings FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access price_rule" ON public.pricing_rules FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access service_orders" ON public.service_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access service_order_parts" ON public.service_order_parts FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access ailogs" ON public.ai_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Full Access audit" ON public.admin_audit_logs FOR ALL TO authenticated USING (true);

-- 6. BUCKET SETUP (Images)
-- If using Storage, enable policies. Provide insert/select permissions to authenticated.
-- Only execute if Storage API is active:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public read images" on storage.objects for SELECT using ( bucket_id = 'product-images' );
-- CREATE POLICY "Auth mod images" on storage.objects for ALL TO authenticated using ( bucket_id = 'product-images' );
