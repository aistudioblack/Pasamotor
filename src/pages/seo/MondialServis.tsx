import { Helmet } from "react-helmet";
import { Wrench, ShieldCheck, MapPin, PhoneCall, Clock } from "lucide-react";

export default function MondialServis() {
  return (
    <>
      <Helmet>
        <title>Mondial Yetkili Servis ve Yedek Parça | Paşa Motor İstanbul</title>
        <meta name="description" content="Mondial motosikletiniz için güvenilir garanti hizmetleri, periyodik bakım ve orijinal Türkiye geneli yedek parça noktası Paşa Motor. İstanbul Fatih'te." />
        <meta property="og:title" content="Mondial Yetkili Servis ve Yedek Parça | Paşa Motor İstanbul" />
        <meta property="og:description" content="Mondial motosikletiniz için güvenilir garanti hizmetleri, periyodik bakım ve orijinal Türkiye geneli yedek parça noktası Paşa Motor. İstanbul Fatih'te." />
      </Helmet>
      
      <div className="bg-background pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-6">
              Mondial Yetkili Servis ve Yedek Parça
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Türkiye’nin en çok tercih edilen motosiklet markalarından biri olan Mondial motosikletinize, üretici onaylı en yüksek kalitede yetkili onarım hizmeti veriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="prose prose-lg dark:prose-invert">
              <h2 className="text-2xl font-bold font-heading">Neden Mondial Onaylı Servis?</h2>
              <p>
                Mondial motor modellerinin yaygın kullanımı, piyasada sayısız yan sanayi parça üretilmesine ve yetkisiz müdahalelere neden olmuştur. Yan sanayi parçalar ve amatör atölyeler, motor ömrünü kritik oranlarda kısaltır, yakıt tüketimini artırır ve sürüş güvenliğinizi tehlikeye atar.
              </p>
              <p>
                <strong>Paşa Motor</strong> olarak, Mondial mühendisleri tarafından onaylı periyodik tablolar ve orijinal fabrika kodlu yedek parça ile çalışıyoruz. Hem cub, hem scooter, hem de touring modelleri için kusursuz motor ayarları sağlamaktayız. Şeffaf fiyatlandırma politikamız ile orijinal olmayan sürpriz hiçbir faturayla karşılaşmazsınız.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Ana Hizmetlerimiz
              </h3>
              <ul className="space-y-4">
                {[
                   "Fabrika Onaylı Garanti Bakımları",
                   "Debriyaj ve Şanzıman Revizyon İşlemleri",
                   "Orijinal Hava Filtresi & Motul Yağ Değişimi",
                   "Amortisör, Süspansiyon Yağ Değişimleri",
                   "Sibop Ayarı ve Karbüratör Temizliği/Senkronizasyon"
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
                { title: "Mekanik Aksam", desc: "Silindir kitleri, pistonlar, eksantrik zincirleri" },
                { title: "Yakıt Sistemleri", desc: "Karbüratörler, enjektörler, benzin otomatikleri ve filtreler" },
                { title: "Aksesuar & Koruma", desc: "Koruma demirleri, çantalar, orijinal vizör ve ayna setleri" }
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
