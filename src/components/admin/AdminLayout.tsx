import { useEffect, useState, ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { dbClient } from "@/lib/db-client";
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
  StickyNote,
  Search
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
    icon: LayoutDashboard,
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ]
  },
  {
    title: "E-Ticaret & Katalog",
    icon: Package,
    items: [
      { to: "/admin/urunler", label: "Ürünler", icon: Package },
      { to: "/admin/markalar", label: "Markalar", icon: Store },
      { to: "/admin/hizmetler", label: "Hizmetler", icon: Wrench },
      { to: "/admin/servis-tamir", label: "Servis & Tamir", icon: Briefcase },
    ]
  },
  {
    title: "İçerik & Иletişim",
    icon: MessageSquare,
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
    icon: Wrench,
    items: [
      { to: "/admin/tedarikciler", label: "Tedarikçi Entegrasyonları", icon: Truck },
      { to: "/admin/notlar", label: "Not Defteri", icon: StickyNote },
    ]
  },
  {
    title: "Sistem & Ayarlar",
    icon: Settings,
    items: [
      { to: "/admin/ayarlar", label: "Genel Ayarlar", icon: Settings },
      { to: "/admin/api", label: "API Bağlantıları", icon: Server },
      { to: "/admin/yapay-zeka-test", label: "Yapay Zeka API Testi", icon: Terminal },
      { to: "/admin/github", label: "Yazılım Güncellemeleri", icon: Github },
      { to: "/admin/kullanicilar", label: "Kullanıcı Yönetimi", icon: ShieldAlert },
      { to: "/admin/veritabani", label: "Veritabanı", icon: Database },
      { to: "/admin/animasyonlar", label: "Arayüz Animasyonları", icon: Sparkles },
      { to: "/admin/changelog", label: "Change Log", icon: Activity },
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
  const [userRole, setUserRole] = useState("user");
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      const { data: initialData, error: userError } = await dbClient
        .from('users')
        .select('role, name')
        .eq('id', currentUser.id)
        .maybeSingle();

      let userData = initialData;

      if (!userData && !userError && currentUser) {
        try {
          const { data: insertedUser } = await dbClient
            .from('users')
            .insert({
              id: currentUser.id,
              email: currentUser.email || '',
              role: 'user',
              name: 'user'
            })
            .select('role, name')
            .maybeSingle();
          if (insertedUser) {
            userData = insertedUser;
          }
        } catch (e) {
          console.warn("Failed to auto-create user entry:", e);
        }
      }
        
      if (userError) {
        console.error('Error fetching user role:', userError);
      }
      
      const role = (userData?.name && ['admin', 'senior_manager', 'manager', 'mechanic', 'editor', 'user'].includes(userData.name))
        ? userData.name 
        : (userData?.role || 'user');
        
      const isSuper = currentUser.email === 'ahmetcafoglu@hotmail.com' || currentUser.email === 'pasamotor@gmail.com';
      
      const hasAccess = role === 'admin' || role === 'senior_manager' || role === 'manager' || role === 'mechanic' || role === 'editor' || isSuper;

      if (mounted) {
        setIsAdmin(hasAccess);
        setUserRole(isSuper ? 'super_admin' : role);
        setLoading(false);
      }
    };

    const { data: sub } = dbClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAccess(session?.user ?? null);
    });

    dbClient.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("Session err:", error.message);
        dbClient.auth.signOut();
      }
      setUser(session?.user ?? null);
      checkAccess(session?.user ?? null);
    }).catch(() => {
      // ignore
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await dbClient.auth.signOut();
    } catch (err) {
      console.warn("Logout warning:", err);
    } finally {
      setUser(null);
      navigate("/admin/giris");
    }
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

  const isMechanicError = userRole === 'mechanic' && !location.pathname.startsWith('/admin/servis-tamir');

  if (!isAdmin || (isSystemRoute && !isSuperAdmin) || isMechanicError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card rounded-xl p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h1 className="font-heading font-bold text-xl text-foreground mb-2">Erişim Reddedildi</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {!isAdmin 
              ? "Bu sayfayı görüntülemek için yetkiniz bulunmuyor."
              : isMechanicError 
                ? "Mekanik ustaları sadece Servis & Tamir sayfasına erişebilir." 
                : "Sistem ve Ayarlar alanına sadece Süper Yönetici erişebilir."}
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

  const filteredNavGroups = navGroups
    .map((group) => {
      if (group.title === "Sistem & Ayarlar" && !isSuperAdmin) {
        return null;
      }
      
      let itemsToFilter = group.items;
      if (userRole === 'mechanic') {
        itemsToFilter = itemsToFilter.filter(item => item.to === '/admin/servis-tamir');
      }

      const filteredItems = itemsToFilter.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const correctedTitle = group.title === "İçerik & Иletişim" ? "İçerik & İletişim" : group.title;
      return {
        ...group,
        title: correctedTitle,
        items: filteredItems
      };
    })
    .filter((group): group is NonNullable<typeof group> => {
      return group !== null && group.items.length > 0;
    });

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="border-b border-border/50 p-4 space-y-3 bg-card">
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
              <p className="font-heading font-bold text-foreground tracking-tight">Paşa Motor</p>
              <p className="text-[10px] text-primary/85 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest font-extrabold w-max mt-0.5">Yönetici Paneli</p>
            </div>
          </div>

          {/* Menü İçi Arama Çubuğu (Gelişmiş UX) */}
          <div className="relative group/search">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Menüde hızlıca ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/65 focus:bg-muted text-xs pl-8 pr-7 py-1.5 rounded-lg border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground font-semibold px-1 rounded hover:bg-muted transition-colors animate-fade-in"
                title="Aramayı Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 space-y-1 bg-card">
          {filteredNavGroups.map((group, idx) => {
            const GroupIcon = group.icon;
            return (
              <SidebarGroup key={idx} className="pb-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1">
                  {GroupIcon && <GroupIcon className="w-3.5 h-3.5 text-primary/75" />}
                  <SidebarGroupLabel className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/80 font-heading p-0 h-auto">
                    {group.title}
                  </SidebarGroupLabel>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {group.items.map((item) => {
                      const active = isActive(item.to, (item as any).end);
                      return (
                        <SidebarMenuItem key={item.to}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={active} 
                            tooltip={item.label}
                            className={`relative overflow-hidden transition-all duration-300 rounded-lg group/btn h-10 ${
                              active 
                                ? "bg-primary/12 text-primary font-bold shadow-[0_2px_10px_rgba(239,68,68,0.06)] border-l-2 border-primary" 
                                : "text-muted-foreground/90 hover:text-foreground hover:bg-muted/85 border-l-2 border-transparent"
                            }`}
                          >
                            <Link to={item.to} className="w-full flex items-center">
                              <motion.div
                                className="flex items-center gap-2.5 w-full"
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              >
                                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                                  active 
                                    ? "text-primary scale-110" 
                                    : "text-muted-foreground group-hover/btn:text-foreground group-hover/btn:scale-110"
                                }`} />
                                <span className="truncate text-[13px] font-sans">{item.label}</span>
                                
                                {active && (
                                  <motion.span 
                                    layoutId="activeGlow"
                                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#ef4444]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  />
                                )}
                              </motion.div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>

        <SidebarFooter className="border-t border-border/50 p-4 bg-card/90">
          <div className="space-y-3">
            {/* Kullanıcı Bilgisi ve Rol Rozeti */}
            <div className="p-2.5 rounded-xl bg-muted/60 border border-border/40 space-y-1.5 shadow-sm">
              <p className="text-[11px] text-muted-foreground font-mono truncate px-1" title={user?.email || ""}>
                {user?.email}
              </p>
              <div className="flex items-center gap-1.5 px-1">
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-red-500/15 text-red-500 border border-red-500/25 px-2 py-0.5 rounded-md tracking-wider font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Super Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-amber-500/15 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded-md tracking-wider font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Yönetici
                  </span>
                )}
              </div>
            </div>

            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="transition-all hover:bg-muted/70 group/back h-9"
                >
                  <Link to="/">
                    <Globe className="w-4 h-4 text-muted-foreground group-hover/back:text-foreground transition-colors" />
                    <span className="text-xs font-sans text-muted-foreground group-hover/back:text-foreground">Siteye Dön</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout} 
                  className="text-destructive/90 hover:text-destructive hover:bg-destructive/10 group/logout h-9 transition-all"
                >
                  <LogOut className="w-4 h-4 text-destructive/80 group-hover/logout:text-destructive transition-colors" />
                  <span className="text-xs font-semibold font-sans">Çıkış Yap</span>
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

