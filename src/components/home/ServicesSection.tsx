import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dbClient } from "@/lib/db-client";
import { 
  Loader2, 
  ArrowRight,
  ShoppingBag,
  Wrench,
  Zap,
  Package,
  Settings,
  Shield
} from "lucide-react";

// Map utilized icons to preserve tree-shaking and avoid bundling 1000+ unused icons.
const iconMap: Record<string, any> = {
  ShoppingBag,
  Wrench,
  Zap,
  Package,
  Settings,
  Shield
};

interface Service {
  iconName: string;
  title: string;
  description: string;
  link: string;
}

const defaultServices: Service[] = [
  {
    iconName: "ShoppingBag",
    title: "Motosiklet Satışı",
    description: "TVS, Hero, Falcon ve Işıldar markalarının en güncel modellerini showroom'umuzda inceleyebilirsiniz. Kredi ve taksit seçenekleri mevcuttur.",
    link: "/hizmetler",
  },
  {
    iconName: "Wrench",
    title: "Motor Servisi",
    description: "Periyodik bakım, motor revizyon, debriyaj, şanzıman ve genel mekanik onarım hizmetleri sunuyoruz.",
    link: "/hizmetler",
  },
  {
    iconName: "Zap",
    title: "Elektrik & Elektronik",
    description: "Aküden aydınlatmaya, CDI'den beyin arızalarına kadar tüm elektrik sorunlarını çözüyoruz.",
    link: "/hizmetler",
  },
  {
    iconName: "Package",
    title: "Yedek Parça Satışı",
    description: "Orijinal ve muadil yedek parçalar geniş stoğumuzda. Bulunmayan parçalar kısa sürede temin edilir.",
    link: "/hizmetler",
  },
  {
    iconName: "Settings",
    title: "Bakım & Onarım",
    description: "Yağ değişimi, filtre, balata, zincir-dişli seti ve lastik değişimi gibi rutin bakım hizmetleri.",
    link: "/hizmetler",
  },
  {
    iconName: "Shield",
    title: "Garanti Kapsamı",
    description: "Yetkili servis bayi olarak tüm satış ve servis işlemlerimiz garanti kapsamında gerçekleştirilir.",
    link: "/hizmetler",
  }
];

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await dbClient.from("site_content").select("sections").eq("page_key", "services").maybeSingle();
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          setServices(data.sections as Service[]);
        }
      } catch (err) {
        console.error("Error loading services:", err);
      }
    };
    fetchServices();
  }, []);

  const renderIcon = (name: string, className?: string) => {
    const IconComp = iconMap[name] || Wrench;
    return <IconComp className={className} />;
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">
            Hizmetlerimiz
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Motosiklet satışından servise, yedek parçadan aksesuara kadar tüm ihtiyaçlarınız için buradayız.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.link}
              className="bg-card hover:bg-muted/40 border border-border/50 hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col group transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.07)]"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                {renderIcon(service.iconName, "w-7 h-7")}
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1 mb-6">
                {service.description}
              </p>
              <div className="mt-auto flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                <span>Hizmeti İncele</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
