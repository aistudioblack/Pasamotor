// Blog görsel kapaklarını güvenli ve otomatik olarak çözen yardımcı fonksiyonlar

const COVER_FILES = [
  "besiktas-motosiklet-servisi-yerinde-tamir-kapak.webp",
  "falcon-motosiklet-servisi-bakim-kapak.webp",
  "fatih-kocamustafapasa-motosiklet-tamircisi-servis-rehberi-kapak.webp",
  "hero-motosiklet-bakimi-yedek-parca-kapak.webp",
  "honda-pcx-scooter-varyator-kayis-degisimi-ve-bakimi-kapak.webp",
  "istanbul-ikinci-el-motosiklet-ekspertiz-fiyatlari-kapak.webp",
  "istanbul-kurye-ekonomik-bakim-kapak.webp",
  "istanbul-kurye-motosiklet-servisi-acil-tamir-kapak.webp",
  "istanbul-motosiklet-akusu-degisimi-ve-bakim-fiyatlari-kapak.webp",
  "istanbul-motosiklet-fren-balata-degisimi-fiyatlari-kapak.webp",
  "istanbul-motosiklet-lastik-tamiri-fitil-ve-balans-fiyatlari-kapak.webp",
  "istanbul-motosiklet-muayene-oncesi-hazirlik-bakimi-kapak.webp",
  "istanbul-motosiklet-periyodik-bakim-fiyatlari-2026-kapak.webp",
  "istanbul-motosiklet-servisi-en-yakin-tamirci-kapak.webp",
  "istanbul-motosiklet-yol-yardim-mobil-servis-kapak.webp",
  "istanbul-motosiklet-zincir-temizleme-yaglama-ve-gergi-rehberi-kapak.webp",
  "istanbul-scooter-servisi-kayis-varyator-bakimi-kapak.webp",
  "kadikoy-motosiklet-servisi-bakim-onarim-kapak.webp",
  "kis-hazirlik-motosiklet-koruma-kapak.webp",
  "kurye-acil-motosiklet-bakim-kapak.webp",
  "kurye-kislik-motosiklet-bakim-kapak.webp",
  "kurye-lastik-secimi-guvenli-surus-kapak.webp",
  "kurye-motoru-egzoz-tamiri-kapak.webp",
  "kurye-motoru-elektrik-arizalari-kapak.webp",
  "kurye-motoru-fren-balatasi-degisimi-kapak.webp",
  "kurye-motoru-lastik-tamiri-kapak.webp",
  "kurye-motoru-omru-uzatma-kapak.webp",
  "kurye-motoru-sik-gorulen-arizalar-kapak.webp",
  "kurye-motosiklet-periyodik-bakim-kapak.webp",
  "kurye-motosiklet-sanziman-sorunlari-kapak.webp",
  "kurye-motosiklet-temizligi-bakim-kapak.webp",
  "kurye-motosiklet-yag-degisimi-kapak.webp",
  "kurye-motosiklet-zincir-bakimi-kapak.webp",
  "motosiklet-akusu-secimi-bakimi-kapak.webp",
  "motosiklet-amortisor-ve-suspansiyon-tamiri-kece-degisimi-kapak.webp",
  "motosiklet-aydinlatma-yedek-parcalari-kapak.webp",
  "motosiklet-bakim-hatalari-kapak.webp",
  "motosiklet-boya-koruma-temizlik-kapak.webp",
  "motosiklet-calismagidiyor-marz-basmiyor-elektrik-arizalari-kapak.webp",
  "motosiklet-debriyaj-sistemi-yedek-parcalari-kapak.webp",
  "motosiklet-degerini-koruma-ipuclari-kapak.webp",
  "motosiklet-detayli-yikama-motor-temizligi-ve-koruma-kapak.webp",
  "motosiklet-dogru-lastik-secimi-kapak.webp",
  "motosiklet-egzoz-patlatma-ve-yakit-karisimi-arizalari-kapak.webp",
  "motosiklet-egzoz-sistemi-yedek-parcalari-kapak.webp",
  "motosiklet-ekspertiz-ikinci-el-kapak.webp",
  "motosiklet-fren-hidroligi-degisimi-ve-hava-alma-kapak.webp",
  "motosiklet-fren-sistemi-yedek-parcalari-kapak.webp",
  "motosiklet-gaz-yemiyor-boguluyor-cekis-dusuklugu-kapak.webp",
  "motosiklet-gidon-bilyasi-degisimi-direksiyon-yalpalama-kapak.webp",
  "motosiklet-hararet-yapiyor-su-eksiltme-nedenleri-kapak.webp",
  "motosiklet-ilkbahar-bakimi-kapak.webp",
  "motosiklet-kis-bakimi-genel-kapak.webp",
  "motosiklet-konjektor-stator-yanmasi-sarj-arizalari-kapak.webp",
  "motosiklet-mavi-duman-atıyor-yağ-yakma-nedenleri-ve-tamiri-kapak.webp",
  "motosiklet-modifikasyon-aksesuar-montaj-kapak.webp",
  "motosiklet-motor-rektefiye-ve-silindir-piston-degisimi-kapak.webp",
  "motosiklet-motor-yedek-parcalari-kapak.webp",
  "motosiklet-omrunu-uzatan-parcalar-kapak.webp",
  "motosiklet-sarf-malzemeleri-kapak.webp",
  "motosiklet-sasi-govde-yedek-parcalari-kapak.webp",
  "motosiklet-sigorta-kasko-rehberi-kapak.webp",
  "motosiklet-sonbahar-bakimi-kapak.webp",
  "motosiklet-subap-ayari-belirtileri-ve-faydalari-kapak.webp",
  "motosiklet-suspansiyon-yedek-parcalari-kapak.webp",
  "motosiklet-uzun-sure-park-etme-rehberi-kapak.webp",
  "motosiklet-vitese-gecmiyor-sertlesme-nedenleri-cozumleri-kapak.webp",
  "motosiklet-yakit-enjeksiyon-ve-karburator-temizligi-kapak.webp",
  "motosiklet-yakit-sistemi-yedek-parcalari-kapak.webp",
  "motosiklet-yedek-parca-fiyatlari-kapak.webp",
  "motosiklet-yedek-parca-kargo-teslimat-kapak.webp",
  "online-yedek-parca-alisveris-rehberi-kapak.webp",
  "orijinal-muadil-parca-farklari-kapak.webp",
  "tvs-motosiklet-bakimi-servis-kapak.webp",
  "ust-segment-motosiklet-ariza-tespiti-kapak.webp",  "yamaha-nmax-xmax-periyodik-bakim-ve-kronik-arizalar-kapak.webp",
  "yaz-bakimi-motosiklet-hazirlik-kapak.webp",
  "yuksek-performans-motosiklet-bakimi-kapak.webp"
];

const DEFAULT_COVER = "/images/blog-cover-images/motosiklet-yedek-parca-fiyatlari-kapak.webp";

export function getPostCoverImage(post?: { slug?: string; title?: string; cover_image?: string | null } | null): string {
  if (!post) return DEFAULT_COVER;

  const slug = (post.slug || "").toLowerCase().trim();

  // 1. Slug mevcutsa, her zaman o slug için üretilen özel kapak görselini döndür
  if (slug) {
    return `/images/blog-cover-images/${slug}-kapak.webp`;
  }

  // 2. Eğer cover_image varsa ve geçerliyse kullan
  if (post.cover_image && typeof post.cover_image === "string" && post.cover_image.trim() !== "") {
    return post.cover_image.trim();
  }

  return DEFAULT_COVER;
}
