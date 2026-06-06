import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { dbClient } from "@/lib/db-client";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";

const InteractiveMap = lazy(() => import("@/components/contact/InteractiveMap"));
import SafeEmail from "@/components/ui/SafeEmail";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: "https://pasamotor.com.tr/iletisim",
  about: { "@type": "LocalBusiness", name: "Paşa Motor" },
  mainEntity: {
    "@type": "Organization",
    name: "Paşa Motor",
    telephone: ["+902125868598", "+905348996817"],
    email: "pasamotor@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kızılelma Cad. No:66/A, Kocamustafapaşa",
      addressLocality: "Fatih",
      addressRegion: "İstanbul",
      postalCode: "34104",
      addressCountry: "TR",
    },
  },
};

const Iletisim = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.subject.trim() || !form.message.trim()) {
      toast({ title: "Hata", description: "Lütfen tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { error } = await dbClient.from("messages").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      if (error) {
        toast({ title: "Hata", description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.", variant: "destructive" });
      } else {
        toast({ title: "Mesajınız alındı!", description: "En kısa sürede size dönüş yapacağız." });
        setForm({ name: "", phone: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      toast({ title: "Erişim Hatası", description: "Mesaj gönderilirken bağlantı hatası oluştu. Lütfen telefon veya WhatsApp hattımızla iletişime geçin.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="İletişim - Adres, Telefon ve Çalışma Saatleri"
        description="Orijinal Paşa Motor iletişim (pasamotor.com.tr): Kızılelma Cad. No:66/A Kocamustafapaşa - Fatih/İstanbul. ☎ 0212 586 85 98 / 0534 899 68 17."
        canonical="/iletisim"
        keywords="paşa motor iletişim, pasamotor.com.tr, motosiklet servisi adres, fatih kocamustafapaşa"
      />
      <JsonLd data={contactSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "İletişim", url: "/iletisim" },
        ])}
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">İletişim</h1>
            <p className="text-lg text-muted-foreground">Bize ulaşmak için aşağıdaki kanalları kullanabilirsiniz.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  <a href="tel:+902125868598" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Telefon</p>
                      <p className="text-sm">0212 586 85 98</p>
                    </div>
                  </a>
                  <a href="tel:+905348996817" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium">GSM (Nihat KAN)</p>
                      <p className="text-sm">0534 899 68 17</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium">E-posta</p>
                      <SafeEmail />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Adres</p>
                      <p className="text-sm">Kızılelma Cad. No:66/A, Kocamustafapaşa, 34104 Fatih/İstanbul</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Çalışma Saatleri</p>
                      <p className="text-sm">Hİ: 09:00-19:00 - Cmt: 09:00-17:00 - Paz: Kapalı</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
              href="https://wa.me/905348996817?text=Merhaba%2C%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20ve%20sipari%C5%9F%20vermek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ile İletişime Geçin
              </a>
            </div>

            <div className="glass-card rounded-xl p-6 md:p-8 h-fit">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-6">Bize Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Telefon</label>
                  <input
                    type="tel"
                    required
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Konu</label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Mesaj konusu"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Mesajınız</label>
                  <textarea
                    required
                    rows={4}
                    maxLength={1000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-12 w-full">
            <div id="harita" className="h-[400px] sm:h-[480px] w-full relative overflow-hidden rounded-[24px] border border-white/10 shadow-2xl bg-muted scroll-mt-24">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Harita Yükleniyor...</div>}>
                <InteractiveMap />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Iletisim;
