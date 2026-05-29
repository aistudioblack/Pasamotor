import { useEffect, useState, ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { dbClient } from "@/lib/firebase-client";
import type { User } from "@supabase/supabase-js";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Loader2,
  Menu,
  X,
  Sparkles,
  Settings,
  Activity,
  Truck,
  Globe,
  Database,
  Briefcase,
  Store,
  Terminal,
  Wrench,
  Server,
  Github,
  StickyNote
} from "lucide-react";
import logo from "@/assets/pasa-motor-logo.webp";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: ReactNode;
}

const navGroups = [
  {
    title: "Gösterge Paneli",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ]
  },
  {
    title: "E-Ticaret & Katalog",
    items: [
      { to: "/admin/urunler", label: "Ürünler", icon: Package },
      { to: "/admin/markalar", label: "Markalar", icon: Store },
      { to: "/admin/hizmetler", label: "Hizmetler", icon: Wrench },
    ]
  },
  {
    title: "İçerik & İletişim",
    items: [
      { to: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare },
      { to: "/admin/faq", label: "Sıkça Sorulan Sorular", icon: HelpCircle },
      { to: "/admin/blog", label: "Blog Yazıları", icon: FileText },
      { to: "/admin/galeri", label: "Medya Galerisi", icon: ImageIcon },
      { to: "/admin/sayfalar", label: "Yasal Sayfalar", icon: FileText },
    ]
  },
  {
    title: "Araçlar",
    items: [
      { to: "/admin/tedarikciler", label: "Tedarikçi Entegrasyonları", icon: Truck },
      { to: "/admin/blog-ajani", label: "🤖 Blog Ajanı", icon: Sparkles },
      { to: "/admin/notlar", label: "Not Defteri", icon: StickyNote },
    ]
  },
  {
    title: "Sistem & Ayarlar",
    items: [
      { to: "/admin/ayarlar", label: "Genel Ayarlar", icon: Settings },
      { to: "/admin/api", label: "API Bağlantıları", icon: Server },
      { to: "/admin/yapay-zeka-test", label: "Yapay Zeka API Testi", icon: Terminal },
      { to: "/admin/github", label: "Yazılım Güncellemeleri", icon: Github },
      { to: "/admin/kullanicilar", label: "Kullanıcı Yönetimi", icon: ShieldAlert },
      { to: "/admin/veritabani", label: "Veritabanı", icon: Database },
      { to: "/admin/animasyonlar", label: "Arayüz Animasyonları", icon: Sparkles },
    ]
  }
];

const systemRoutes = [
  "/admin/ayarlar",
  "/admin/api",
  "/admin/github",
  "/admin/kullanicilar",
  "/admin/veritabani",
  "/admin/animasyonlar"
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async (currentUser: User | null) => {
      if (!currentUser) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(true);
        }
        navigate("/admin/giris");
        return;
      }
      const { data: userData, error: userError } = await dbClient
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user role:', userError);
      }
      
      const hasAdminAccess = userData?.role === 'admin' || currentUser.email === 'ahmetcafoglu@hotmail.com' || currentUser.email === 'pasamotor@gmail.com';

      if (mounted) {
        setIsAdmin(hasAdminAccess);
        setLoading(false);
      }
    };

    const { data: sub } = dbClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAccess(session?.user ?? null);
    });

    dbClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAccess(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await dbClient.auth.signOut();
    navigate("/admin/giris");
  };

  const isSuperAdmin = user?.email === "ahmetcafoglu@hotmail.com";
  const isSystemRoute = systemRoutes.some((route) => location.pathname.startsWith(route));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin || (isSystemRoute && !isSuperAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card rounded-xl p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h1 className="font-heading font-bold text-xl text-foreground mb-2">Erişim Reddedildi</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {!isAdmin 
              ? "Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekiyor."
              : "Sistem ve Ayarlar alanına sadece Süper Yönetici (ahmetcafoglu@hotmail.com) erişebilir."}
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 animate-pulse"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const filteredNavGroups = navGroups.filter((group) => {
    if (group.title === "Sistem & Ayarlar") {
      return isSuperAdmin;
    }
    return true;
  });

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="border-b border-border/50 p-4">
          <div className="flex items-center gap-3">
            <motion.img 
              src={logo} 
              alt="Paşa Motor" 
              className="h-10 w-auto transform origin-bottom-right cursor-pointer" 
              style={{ mixBlendMode: "screen" }}
              whileHover={{ 
                rotate: [0, -10, 15, -5, 0],
                scale: 1.1,
                y: -4,
                transition: { duration: 0.5 }
              }}
              whileTap={{ scale: 0.9, rotate: 10 }}
            />
            <div>
              <p className="font-heading font-bold text-foreground">Paşa Motor</p>
              <p className="text-xs text-muted-foreground">Yönetim Paneli</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {filteredNavGroups.map((group, idx) => (
            <SidebarGroup key={idx}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isActive(item.to, item.end);
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={active} 
                          tooltip={item.label}
                          className={active ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" : ""}
                        >
                          <Link to={item.to}>
                            <item.icon className={active ? "text-primary" : ""} />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-border/50 p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2 truncate px-2">{user?.email}</p>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Globe />
                    <span>Siteye Dön</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut />
                  <span>Çıkış Yap</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <span className="font-heading font-semibold text-foreground">
              {(navGroups.flatMap(g => g.items) as any[]).find(i => isActive(i.to, i.end))?.label || "Yönetim Paneli"}
            </span>
          </div>
          <Link to="/" className="text-xs text-muted-foreground mr-2 md:hidden">Siteye dön</Link>
        </header>
        <main className="flex-1 p-4 md:p-8 xl:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

