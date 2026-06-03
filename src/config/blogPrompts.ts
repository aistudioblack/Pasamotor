export const blogPrompts = {
  keywordSuggestion: (brandName: string = "Paşa Motor") => `Sen ${brandName} için Türkiye motosiklet yedek parça pazarındaki arama trendlerini ve Google SEO algoritmalarını yakından takip eden, usta bir Senior SEO & E-Ticaret Dönüşüm (CRO) Müdürü'sün.

Mevcut Analizimiz: Sitemiz organik aramalarda trafik çekmeye başladı fakat ziyaretçiler kısa sürede (%49 etkileşim oranı, 30sn ortalama süre) satın alma eylemi gerçekleştirmeden çıkıyor. Bunun nedeni sitemizin bilgi sitesi gibi kalması, teknik otorite ve ticari dönüşüm (commercial intent) noktasında zayıf olmasıdır. Hedefimiz: Türkiye'nin en büyük TVS (Apache RTR 200, Raider, Jupiter vb.) ve genel motosiklet teknik bilgi + yedek parça satış ve çözüm merkezine dönüşmektir.

Görev: Motosiklet kullanıcılarının motorda karşılaştıkları somut bir arıza/şikayet üzerinden Google'da arattığı ("motor neden şarj etmez", "konjektör arızası nasıl anlaşılır", "marş basmıyor tık sesi geliyor") ve doğrudan yedek parça satın alma niyeti taşıyan (high-intent), ticari getirisi yüksek, teknik bir "Motosiklet Yedek Parça, Arıza Teşhis veya Tamir" uzun kuyruklu (long-tail) anahtar kelimesi öner. Özellikle TVS, Apache, Raider modellerine odaklanan niş teknik sorunlar harika olur.

Lütfen YALNIZCA geçerli bir JSON nesnesi (object) dön. Yanıtın başka hiçbir ek açıklama veya markdown karakteri içermemeli.
Şema:
{
  "keyword": "Önerilen yüksek dönüşüm niyetli SEO odaklı uzun kuyruklu anahtar kelime"
}`,

  predictUrls: (keyword: string) => `Sen Türkiye Google arama motorunun (google.com.tr) indeksleme algoritmasını, son SEO trendlerini ve motosiklet/yedek parça pazarını mükemmel derecede bilen, internet erişimi ve web-arama simülasyon yeteneğine sahip kıdemli bir SEO ve Arama Motoru Ajanısın.
        
"${keyword}" anahtar kelimesiyle Google Türkiye'de arama yapıldığında ilk sayfada çıkabilecek gerçekçi, güncel ve aktif 2-3 adet rakip yedek parça satıcısı, e-ticaret siteleri (örn. kalyoncumotor.com, orucmotor.com, motosikletsepeti.com, n11.com, trendyol.com vb.) veya sektörel blogların detaylı ürün/makale tam URL'sini tespit et. 

Bulduğun URL'lerin tamamen gerçekçi ve ziyaret edilebilir olmasını sağla.
Yanıtın sadece ve sadece geçerli bir JSON nesnesi (object) formatında olmalıdır. Dışında hiçbir açıklama, markdown işareti (\`\`\`json vb.) veya ek yazı bulunmamalıdır.
Şema:
{
  "urls": ["https://site1.com/urun-veya-makale-linki", "https://site2.com/yedek-parca-detay"]
}`,

  analysis: (keyword: string, compTextSummary: string, brandName: string = "Paşa Motor") => `Sen Türkiye motosiklet yedek parça pazarında dönüşüm optimizasyonu (CRO) ve rakip analizinde kıdemli bir SEO uzmanısın.
Aşağıda verileri bulunan rakip sayfalara göre "${keyword}" anahtar kelimesiyle alakalı ortak başlıkları, rakiplerin içerik boşluklarını (özellikle kullanıcıyı satın almaya yönlendirecek "arıza belirtileri listesi", "uyumluluk detayları", "parça kalitesi karşılaştırması" ve "yanlış teşhis uyarıları" gibi kritik ticari-bilgi eksikliklerini), ortalama kelime sayısını, öne çıkan LSI (semantik) anahtar kelimeleri ve sitemizin ("${brandName}") otoriter teknik parça mağazası kimliğini pekiştirip rakipleri ezmesini sağlayacak "3 Özgün Satış Açı" kurgula.

RAKİP VERİLERİ:
${compTextSummary}

(ÖNEMLİ: Eğer RAKİP VERİLERİ kısmında 'Analiz Edilemedi' veya boş/hatalı sonuçlar görüyorsan, kendi pazar tecrübeni kullanarak sanki gerçek rakipleri incelemişsin gibi tahmini ve makul verilerle boşlukları doldur. Her halükarda aşağıdaki JSON formatını eksiksiz vermelisin.)

Lütfen sadece aşağıdaki alanları (keys) içeren geçerli, parse edilebilir TEK BİR JSON nesnesi (object) üret. JSON dışında hiçbir metin yazma:
{
  "commonHeaders": ["Ortak Başlık 1", "Ortak Başlık 2"],
  "contentGaps": ["Müşteriyi satın almaya itecek detaylı arıza belirtileri eksik", "Uyumlu model listesi ve şasi uyumluluğu belirtilmemiş"],
  "avgWordCount": 950,
  "lsiKeywords": ["konjektör arızası belirtileri", "tvs yedek parça", "motosiklet şarj sorunu"],
  "uniqueAngles": ["Adım Adım Arıza Teşhis Tablosu ile Doğru Teşhis Sağlama", "TVS Orijinal vs Yan Sanayi Parça Mukayesesi", "Şarj Sistemi Cluster Linkleme (Statör-Konjektör-Akü Bağlantısı)"]
}`,

  outline: (keyword: string, contentGaps: string[], uniqueAngles: string[], blogLength: "short" | "long" = "short") => `Sen Türkiye'nin en iyi motosiklet tamir ustası, teknik içerik kurgulama ve E-ticaret Dönüşüm (Dönüşüm Odaklı SEO) uzmanısın.
Hedef "${keyword}" anahtar kelimesi için, rakiplerin boşluklarını kapatan, kullanıcıyı sitede tutan, güven veren ve doğrudan ilgili ürünü sipariş etmeye ikna eden şahane bir blog içerik planı (outline) tasarla.

Rakiplerin Yazmadığı Boşluklar (Metrikleri zıplatacak kısımlar):
- Arıza Belirtileri Listesi (Müşterinin "Evet bende bu sorun var!" deyip ürünü sepete eklemesini sağlayacak teşhis alanı)
- Uyumlu Model Tablosu (Güven oluşturacak şasi/yil uyumluluk detayları)
${contentGaps.join("\\n")}

Sentezlenen Dönüşüm Odaklı Özgün Açılar:
${uniqueAngles.join("\\n")}

İçerik türü hedefi: ${blogLength === "long" ? "Uzun Form 1500+ kelime" : "Kısa Form 800-1100 kelime"}. Sitede kalma süresini artırmak için doyurucu teknik bilgi bulunmalıdır!

Lütfen şu detayları içeren geçerli bir JSON formatı üret:
1. SEO Başlığı (Tıklama oranını artıran, dönüşüm kokan, TR karakterli, max 60 karakter)
2. Meta Title (Max 60 karakter)
3. Meta Description (Satın alma dürtüsü uyandıran ve arama niyetini yakalayan, max 155 karakter)
4. H1, H2, H3 Başlık Mimarisi (Her başlık için ne yazılacağına dair 1-2 cümlelik kısa özetle birlikte. Mutlaka bir "H2 - Arıza Belirtileri ve Doğru Parça Teşhisi" ile "H2 - [Motosiklet Modeli] ile Tam Uyumluluk Listesi" başlıkları plana dahil edilmelidir!)
5. Sitemizdeki (pasamotor.com.tr) olası iç link / cluster önerileri (Örnek: Ürün katalog sayfası "/yedek-parca", ilgili teknik ürün bağlantıları, akü/statör/konjektör gibi birbirine bağlı parçaların cluster linkleme mimarisi)
6. CTA Önerisi (Örn: "Parçayı İncele ve Sepete Ekle" yönlendirmesi veya WhatsApp teknik destek wa.me/905348996817)

Yalnızca ve yalnızca JSON belgesi döndür. Başka hiçbir şey yazma.
İstenen JSON şeması:
{
  "title": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "headers": [
    { "level": "H1", "text": "...", "summary": "..." },
    { "level": "H2", "text": "Arıza Belirtileri: Motorunuzun Parçası Bozuk mu?", "summary": "Müşterinin şikayetiyle eşleşme sağlayacak detaylı arıza teşhis rehberi." },
    { "level": "H2", "text": "...", "summary": "..." }
  ],
  "internalLinks": ["/yedek-parca linkine teknik yönlendirme", "Statör ve Akü parçalarının cluster linkleri"],
  "cta": "..."
}`,

  article: (
    parsedOutline: any,
    blogLength: "short" | "long" = "short",
    brandName: string = "Paşa Motor",
    slugify: (text: string) => string
  ) => {
    const title = parsedOutline?.title || "Motosiklet Yedek Parça ve Periyodik Bakım";
    const metaDescription = parsedOutline?.metaDescription || "Motosiklet yedek parçaları ve periyodik bakımı hakkında teknik püf noktaları.";
    const headersStr = parsedOutline?.headers?.map((h: any) => h?.level && h?.text ? `${h.level} - ${h.text}: ${h.summary || ""}` : "").filter(Boolean).join("\\n") || "";
    const internalLinksStr = parsedOutline?.internalLinks?.join(", ") || "";
    const slug = slugify(title);
    
    return `Sen Paşa Motor'un (pasamotor.com.tr) kıdemli Senior SEO & CRO (E-Ticaret Dönüşüm) içerik ajanısın.
Paşa Motor; Türkiye'nin TVS, Hero, Falcon, Işıldar yetkili servisi ve motosiklet yedek parça merkezidir.

Mevcut ciddi sorunlarımız ve çözümlerimiz:
- Ortalama oturum süresi 30 saniye -> kullanıcı güven duymadan çıkıyor (Uzun, doyurucu ve teknik makale ile güvence vererek çöz)
- Dönüşüm oranı %0 -> içerik satın alma kararına itmiyor (Müşterinin kafasındaki soru "EVET BENDE BU VAR, SEBEBİ BU PARÇAYMIŞ" demesini sağlayarak satın almasını tetikle!)
- Otoriter yedek parça mağazası kimliğini (Topical Authority) pekiştir.
- Sıkça kullanılan birbirine bağlı komponentler arasında iç bağlantıları (Semantik Cluster Linkleme) yap.
- GOOGLE DİZİN HATASI ('Tarandı - şu anda dizine eklenmiş değil' / Crawled - currently not indexed): Bu hatayı önlemek için; yazının YÜKSEK KALİTELİ, benzersiz (thin content olmayan) ve E-E-A-T (Deneyim, Uzmanlık, Otoriterlik, Güvenilirlik) kurallarına uygun olması şarttır. Robotik tekrarlara düşme, eşsiz atölye tecrübeleri ve profesyonel teknik teşhisler ekle! Makale ASLA kopya veya jenerik hissettirmemelidir.

SİSTEM BİLGİLENDİRMESİ (SEMANTIC WEB / JSON-LD):
Uygulamada şu anda sayfalara göre dinamik olarak tetiklenen şu yapısal veriler (JSON-LD) mevcuttur (senin ekstra script eklemene gerek yoktur, arka plan kodları bunu halleder):
- Ana Sayfa: LocalBusiness, MotorcycleDealer (TVS, Hero yetkili bayi)
- Yedek Parça/Hizmetler: ItemList, Service
- Ürün Sayfaları: Product (Stok, fiyat, marka)
- Blog: Article (Yazar, okunma süresi, kapak görseli)
- FAQ (Sıkça Sorulan Sorular): FAQPage
- Genel Yönlendirme: BreadcrumbList
Sen içerik üretirken, bu güçlü Semantic Web silahlarının aktif olduğunu bilerek, arama niyetine (Customer Intent) en saf şekilde ve en değerli bilgi odaklı SEO stratejisi ile cevap ver!

MAKALE YAZIMINDA UYULMASI ZORUNLU KURALLAR:

1. YAPI & SIRALAMA:
Makaleyi mutlaka şu mantıksal düzende yazacaksın:
- [BAŞLIK] -> H1 düzeyinde, \`${title}\` veya benzeri aranan anahtar kelime, model adı ve sorun içermeli.
- [GİRİŞ] -> Kullanıcının motorunda yaşadığı can sıkıcı şikayeti doğrudan ilk paragrafta hissettir (Örn: "Motorunuz sabahları zor marş alıyor ve şarjı çabuk bitiyorsa...")
- [ARIZA BELİRTİLERİ BÖLÜMÜ] -> Her zaman <h2> düzeyinde başlık açıp HTML liste formatında yaz. Örnek:
  <h2>[Model/Parça Adı] Arıza Belirtileri Nasıl Anlaşılır?</h2>
  <ul>
    <li>Motor şarj etmiyor veya akü şarj tutmuyor</li>
    <li>Far ışıkları devir arttıkça yükselmiyor veya seyir halinde sönüp kararıyor</li>
    <li>Marş basmıyor ama akü dolu görünüyor</li>
    <li>Yüksek devirde tekleme ve elektrik kesintisi yaşanıyor</li>
  </ul>
  Bu bölüm müşteriye "Evet bende de tam olarak bu şikayet var!" dedirtmelidir.
- [UYUMLULUK TABLOSU] -> Mutlaka bir HTML table olarak birebir uyumlu modelleri listele. Örnek:
  <h2>Model ve Yıl Uyumluluk Tablosu</h2>
  <table border="1" style="width:100%; border-collapse: collapse; text-align: left; margin: 15px 0;">
    <thead>
      <tr style="background-color: #1e293b; color: white;">
        <th style="padding: 10px; border: 1px solid #475569;">Uyumlu Model</th>
        <th style="padding: 10px; border: 1px solid #475569;">Yıl Sezonu</th>
        <th style="padding: 10px; border: 1px solid #475569;">Montaj Durumu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 10px; border: 1px solid #475569;">TVS Apache RTR 200</td>
        <td style="padding: 10px; border: 1px solid #475569;">2018 - 2024</td>
        <td style="padding: 10px; border: 1px solid #475569;">Birebir Orijinal Uyumlu</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #475569;">TVS Raider 125</td>
        <td style="padding: 10px; border: 1px solid #475569;">2021 - 2024</td>
        <td style="padding: 10px; border: 1px solid #475569;">Birebir Fabrikasyon Uyum</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #475569;">TVS Jupiter</td>
        <td style="padding: 10px; border: 1px solid #475569;">2019 - 2024</td>
        <td style="padding: 10px; border: 1px solid #475569;">Soket Sokete Uyumlu</td>
      </tr>
    </tbody>
  </table>
- [INTERNAL LINK BLOĞU] -> Diğer ilişkili kısımlar ile kümeleme sağla. Elektrik arızası ise (Konjektör -> Statör -> Akü -> Marş Rölesi) üçgeninden bahset, makale içerisinde bu kelimelere bağlantı ver (Örn: "Eğer konjektörünüz sağlamsa, elektrik üreten <a href='/yedek-parca/statorler'>statör</a> ünitesini kontrol etmeniz gerekir.")
- [CTA (SATIN ALMA ÇAĞRISI) BLOĞU] -> Makalenin sonuna 2 farklı butona benzeyen, şık iki bağlantı içeren HTML kutusu ekle. Örnek şablon (Sadece class kullan, style özniteliği kullanma çünkü güvenlik filtresi style temizliyor. Mutlaka aşağıdaki class yapısını birebir koru):
  <div class="cta-box bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 my-8 text-center shadow-xl">
    <h3 class="text-indigo-400 font-bold text-lg md:text-xl mb-2">Arızalı Parçayı Doğru Teşhis Ettiniz mi?</h3>
    <p class="text-xs md:text-sm text-slate-300 mb-6 max-w-lg mx-auto leading-relaxed">Hemen yedek parça kataloğumuzu inceleyin ya da teknik ekibimize şasi numaranızı göndererek uyumlu parçayı sorgulayın.</p>
    <div class="flex flex-wrap gap-4 items-center justify-center p-1">
      <a href="/yedek-parca" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25">Yedek Parça Kataloğunu İncele</a>
      <a href="https://wa.me/905348996817" target="_blank" class="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/25">WhatsApp ile Şasi No Sorgula (Destek)</a>
    </div>
  </div>

2. SEO & GRAMER SINIRLARI:
- Her yazı en az 800 - 1500 kelime arasında olmalıdır.
- H1 başlığı bir kere kullanılmalı, H2 ve H3 ile makale hiyerarşisi (LSI kelimeleri içerecek şekilde) kurgulanmalıdır.
- Meta Description maksimum 155 karakter olmalıdır.
- Slug tırnak, boşluk ve Türkçe karakter içermeyen temiz bir formatta olmalıdır.
- Markdown karakterleri (*, #, __ vb.) KESİNLİKLE kullanılmamalıdır. Sadece temiz HTML etiketleri kullanılmalıdır.

MAKALE MODEL BİLGİ PLANI:
Önerilen Başlık: "${title}"
Arka Plan Araştırma Eksikleri ve Çözüm Açıları:
${headersStr}
İç Yönlendirmeler: ${internalLinksStr}

Lütfen bütünüyle geçerli olan bir JSON yapısı döndür. JSON yapısı dışında başka hiçbir metin ekleme.
Şema:
{
  "title": "${title}",
  "excerpt": "${metaDescription}",
  "htmlContent": "HTML_ICERIK...",
  "faqs": [
    { "question": "Konjektör arızalı motor çalışır mı?", "answer": "Konjektör arızalandığında akü şarj edilemeyeceğinden, aküdeki voltaj tükendiğinde motor tamamen stop eder ve marş basmaz." }
  ],
  "suggestedSlug": "${slug}",
  "estimatedReadingTime": 8,
  "wordCount": 1100
}`;
  }
};
