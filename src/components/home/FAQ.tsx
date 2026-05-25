import { useEffect, useState } from "react";
import { dbClient } from "@/lib/firebase-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import JsonLd from "@/components/seo/JsonLd";
import { HelpCircle } from "lucide-react";
import type { Tables } from "@/lib/firebase-types";

type FAQ = Tables<"faqs">;

const defaultFaqs: FAQ[] = [
  { id: "faq-1", question: "Motosiklet periyodik bakımı ne zaman yapılmalıdır?", answer: "Eğer motosikletiniz garanti kapsamındaysa servis kitapçığında belirtilen kilometre veya zaman aralıklarında (genelde her 5.000 - 6.000 km'de bir veya yılda 1 kez) yapılması gerekir. Kapasite ve segmente göre değişiklik gösterebilir.", category: "Servis Hizmetleri", is_active: true, sort_order: 1, created_at: "" },
  { id: "faq-2", question: "Sipariş ettiğim yedek parça ne zaman elime ulaşır?", answer: "Stoklarımızda bulunan parçalar ortalama 1-3 iş günü içerisinde kargoya teslim edilmekte olup, bulunmayan özel siparişler marka ve yurtdışı tedarik durumuna göre 15-45 gün arasında gelebilir.", category: "Yedek Parça", is_active: true, sort_order: 2, created_at: "" },
  { id: "faq-3", question: "Takas desteğiniz var mı?", answer: "Evet, belirli şartlara uyan marka ve modeldeki ikinci el motosikletlerinizi ekspertiz sonucu takas değerlendirmesinde kullanabiliyoruz.", category: "Motosiklet Satışı", is_active: true, sort_order: 3, created_at: "" },
  { id: "faq-4", question: "Garanti süresi devam eden motosikletimi dışarıda bakıma götürürsem garantiden çıkar mı?", answer: "Evet. Genellikle üreticiler, periyodik bakımların, arıza tespitinin ve müdahalenin sadece yetkili servislerde yapılmasını şart koşar.", category: "Genel", is_active: true, sort_order: 4, created_at: "" },
  { id: "faq-5", question: "Servis randevusunu nasıl alabilirim?", answer: "İnternet sitemizdeki İletişim sayfasından formu doldurarak veya doğrudan müşteri hizmetlerimizi arayarak (0212 586 85 98) servis randevusu oluşturabilirsiniz.", category: "Servis Hizmetleri", is_active: true, sort_order: 5, created_at: "" },
  { id: "faq-6", question: "Orijinal ve yan sanayi yedek parça arasındaki fark nedir?", answer: "Orijinal parçalar üretici firmanın garanti kapsamındadır ve motosikletinizin ömrünü uzatır. Yan sanayi parçalar daha uygun maliyetli olsa da, kalite standartları orijinali kadar yüksek olmayabilir. Paşa Motor olarak motosiklet sağlığı için her zaman orijinal parça kullanımını öneriyoruz.", category: "Yedek Parça", is_active: true, sort_order: 6, created_at: "" }
];

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await dbClient
          .from("faqs")
          .select("*")
          .eq("is_active", true)
          .order("sort_order")
          .order("created_at", { ascending: false });
        
        if (data && data.length > 0) {
          setFaqs(data as FAQ[]);
        } else {
          setFaqs(defaultFaqs);
        }
      } catch (err) {
        console.error("Error loading FAQs:", err);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ["Tümü", ...Array.from(new Set(faqs.map(f => f.category || "Genel")))];
  const filteredFaqs = activeCategory === "Tümü" 
    ? faqs 
    : faqs.filter(f => (f.category || "Genel") === activeCategory);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: filteredFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 md:py-24 border-t border-border bg-background/50">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3 sm:mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
            </p>
          </div>

          {faqs.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl">
              <HelpCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm md:text-base">Henüz soru bulunmuyor.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              {categories.length > 2 && (
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 hide-scrollbar">
                  {categories.map(c => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        activeCategory === c
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground scale-95 hover:scale-100"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id || `faq-${index}`}
                    value={faq.id || `faq-${index}`}
                    className="glass-card rounded-xl sm:rounded-2xl px-5 sm:px-6 md:px-8 border-none overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <AccordionTrigger className="text-left font-heading font-medium text-foreground hover:text-primary hover:no-underline py-4 sm:py-5 md:py-6 text-sm sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 md:pb-6 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                
                {filteredFaqs.length === 0 && (
                   <div className="text-center py-8">
                     <p className="text-muted-foreground">Bu kategoride soru bulunamadı.</p>
                   </div>
                )}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
