import { Helmet } from "react-helmet";
import { Wrench, ShieldCheck, MapPin, PhoneCall, Clock } from "lucide-react";

export default function KubaServis() {
  return (
    <>
      <Helmet>
        <title>Kuba Motor Yetkili Servis | Paşa Motor İstanbul</title>
        <meta name="description" content="Kuba motor yetkili servis ve orijinal yedek parça merkezi Paşa Motor'da! İstanbul Fatih'te garantili bakım, tamir ve aksesuar değişimi hizmetlerimizden yararlanın." />
        <meta property="og:title" content="Kuba Motor Yetkili Servis | Paşa Motor İstanbul" />
        <meta property="og:description" content="Kuba motor yetkili servis ve orijinal yedek parça merkezi Paşa Motor'da! İstanbul Fatih'te garantili bakım, tamir ve aksesuar değişimi hizmetlerimizden yararlanın." />
      </Helmet>
      
      <div className="bg-background pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-6">
              Kuba Motor Yetkili Servis ve Yedek Parça Merkezi
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Kuba marka motosikletiniz için güvenilir, garantili ve profesyonel teknik servis hizmeti arıyorsanız, İstanbul Fatih'teki merkezimizle tanışın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="prose prose-lg dark:prose-invert">
              <h2 className="text-2xl font-bold font-heading">Neden Kuba Motor Yetkili Servisi?</h2>
              <p>
                Kuba Motor'un ileri teknolojisi ve sağlam yapısı, uzun yıllar sorunsuz kullanım sunmasıyla bilinir. Ancak her motorlu araç gibi periyodik bakıma ihtiyaç duyar. Piyasada yer alan yetkisiz tamirciler, kısa vadede çözüm sunuyormuş gibi görünse de uzun vadede orijinal olmayan parçalar ve yanlış işçilik ile daha yüksek maliyetli arızalara sebebiyet vermektedir. 
              </p>
              <p>
                <strong>Paşa Motor</strong> olarak biz, Kuba Motor üretici standartlarına tamamen uygun eğitimli teknisyenlerimizle, aracınızın performansını fabrika verisine ulaştırmayı garanti ederiz. Kullanılan her parça %100 orijinal yedek parça depolarımızdan tedarik edilir.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Ana Hizmetlerimiz
              </h3>
              <ul className="space-y-4">
                {[
                   "Periyodik Bakım ve Garanti Onayları",
                   "Orijinal Hava, Yağ, Yakıt Filtresi Değişimi",
                   "Mekanik ve Motor Bloğu Revizyonları",
                   "Fren, ABS ve Süspansiyon Testleri",
                   "Elektrik, Şarj ve Marş Dinamosu Tamirleri"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold font-heading text-center mb-10">Stokta Tuttuğumuz Orijinal Yedek Parçalar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Mekanik Aksam", desc: "Silindir kitleri, pistonlar, debriyaj balataları be Krank milleri" },
                { title: "Sarf Malzemeleri", desc: "Yağ filtreleri, hava filtreleri, fren balataları ve bujiler" },
                { title: "Elektrik ve Elektronik", desc: "Aküler, statörler, konjektörler, ateşleme bobinleri" }
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border p-6 rounded-xl hover:bg-muted/50 transition-colors">
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold font-heading mb-8">Bizi Ziyaret Edin</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                  <PhoneCall className="w-5 h-5" />
                  İletişim
                </div>
                <span className="text-foreground text-lg">0212 586 85 98</span>
                <span className="text-muted-foreground text-sm">Hızlı Randevu & Bilgi</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                  <Clock className="w-5 h-5" />
                  Çalışma Saatleri
                </div>
                <span className="text-foreground">Pazartesi - Cumartesi</span>
                <span className="text-muted-foreground text-sm">09:00 - 19:00</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                  <MapPin className="w-5 h-5" />
                  Konum
                </div>
                <span className="text-foreground">Fatih, İstanbul</span>
                <span className="text-muted-foreground text-sm">Kocamustafapaşa Mah, Kızılelma Cd.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
