import React, { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (error.message && (error.message.includes("Failed to fetch dynamically imported module") || error.message.includes("Importing a module script failed"))) {
      // Chunk loading failed (likely due to a new deployment or dev server restart)
      // Force a full site reload
      window.location.reload();
    }
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Uygulama yüklenirken bir hata oluştu</h2>
          <p className="text-muted-foreground mb-4">Sayfa yenileniyor, lütfen bekleyin...</p>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Hakkimizda = lazy(() => import("./pages/Hakkimizda.tsx"));
const Hizmetler = lazy(() => import("./pages/Hizmetler.tsx"));
const Galeri = lazy(() => import("./pages/Galeri.tsx"));
const Iletisim = lazy(() => import("./pages/Iletisim.tsx"));
const YedekParca = lazy(() => import("./pages/YedekParca.tsx"));
const YedekParcaDetay = lazy(() => import("./pages/YedekParcaDetay.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogDetay = lazy(() => import("./pages/BlogDetay.tsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.tsx"));
const KubaServis = lazy(() => import("./pages/seo/KubaServis.tsx"));
const RksServis = lazy(() => import("./pages/seo/RksServis.tsx"));
const MondialServis = lazy(() => import("./pages/seo/MondialServis.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts.tsx"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages.tsx"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery.tsx"));
const AdminFAQ = lazy(() => import("./pages/admin/AdminFAQ.tsx"));
const AdminAnimations = lazy(() => import("./pages/admin/AdminAnimations.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminAPI = lazy(() => import("./pages/admin/AdminAPI.tsx"));
const AdminAITester = lazy(() => import("./pages/admin/AdminAITester.tsx"));
const AdminChangelog = lazy(() => import("./pages/admin/AdminChangelog.tsx"));
const AdminBlogAgent = lazy(() => import("./pages/admin/AdminBlogAgent.tsx"));
const AdminNotes = lazy(() => import("./pages/admin/AdminNotes.tsx"));
const AdminGithub = lazy(() => import("./pages/admin/AdminGithub.tsx"));
const AdminDatabase = lazy(() => import("./pages/admin/AdminDatabase.tsx"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands.tsx"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices.tsx"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages.tsx"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/hakkimizda" element={<Hakkimizda />} />
                <Route path="/hizmetler" element={<Hizmetler />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/iletisim" element={<Iletisim />} />
                <Route path="/yedek-parca" element={<YedekParca />} />
                <Route path="/tvs-motosiklet-yedek-parca" element={<YedekParca />} />
                <Route path="/hero-motosiklet-yedek-parca" element={<YedekParca />} />
                <Route path="/honda-motosiklet-yedek-parca" element={<YedekParca />} />
                <Route path="/yamaha-motosiklet-yedek-parca" element={<YedekParca />} />
                <Route path="/falcon-motosiklet-yedek-parca" element={<YedekParca />} />
                <Route path="/isildar-motosiklet-yedek-parca" element={<YedekParca />} />
                <Route path="/yedek-parca/:slug" element={<YedekParcaDetay />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetay />} />
                <Route path="/sayfa/:slug" element={<LegalPage />} />
                <Route path="/kuba-motor-yetkili-servis" element={<KubaServis />} />
                <Route path="/rks-motor-yetkili-servis" element={<RksServis />} />
                <Route path="/mondial-motor-yetkili-servis" element={<MondialServis />} />
                <Route path="/admin/giris" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/urunler" element={<AdminProducts />} />
                <Route path="/admin/markalar" element={<AdminBrands />} />
                <Route path="/admin/hizmetler" element={<AdminServices />} />
                <Route path="/admin/blog" element={<AdminPosts />} />
                <Route path="/admin/blog-ajani" element={<AdminBlogAgent />} />
                <Route path="/admin/notlar" element={<AdminNotes />} />
                <Route path="/admin/sayfalar" element={<AdminPages />} />
                <Route path="/admin/mesajlar" element={<AdminMessages />} />
                <Route path="/admin/galeri" element={<AdminGallery />} />
                <Route path="/admin/faq" element={<AdminFAQ />} />
                <Route path="/admin/animasyonlar" element={<AdminAnimations />} />
                <Route path="/admin/ayarlar" element={<AdminSettings />} />
                <Route path="/admin/tedarikciler" element={<AdminSuppliers />} />
                <Route path="/admin/kullanicilar" element={<AdminUsers />} />
                <Route path="/admin/api" element={<AdminAPI />} />
                <Route path="/admin/yapay-zeka-test" element={<AdminAITester />} />
                <Route path="/admin/changelog" element={<AdminChangelog />} />
                <Route path="/admin/github" element={<AdminGithub />} />
                <Route path="/admin/veritabani" element={<AdminDatabase />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
