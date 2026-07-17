# Change Log (Geliştirmeler & Güvenlik Güncellemeleri)

## [v1.1.0] - Güvenlik ve Performans Güncellemesi

### Güvenlik (Security)
* **Kritik İfşa Dosyalarının Temizliği**: Sistemin güvenlik tasarımını açığa çıkaran `security_spec.md`, `supabase_init.sql` ve `rls.txt` dosyaları tamamen projeden silinmiştir.
* **Rate-Limit (Brute-Force Koruması)**: Admin giriş panelinde limit aşıldığında sistemi 1 dakika süreyle kilitleyen Rate Limit (Hız Sınırı) mekanizması eklenmiştir. 5 başarısız giriş denemesi sonrası sistem IP/Session bazlı kendini kilitler.
* **Tedarikçi Şifreleme (Encryption)**: FCS tedarikçi sistemindeki düz metin şifre zafiyeti düzeltilmiştir. Şifreler artık `AES-256-CBC` standardı ile şifrelenmektedir. Doğrulama ve senkronizasyon esnasında anlık olarak çözülür.
* **Ortam Değişkeni Düzeltmesi**: Sunucu kodlarındaki (server.ts) environment variable mantığı sunucu tarafına uygun `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` formatına geçirilerek düzeltilmiştir.
* **Admin Şifrelerinin Yenilenmesi**: Sistemde yer alan 3 admin hesabının eski/zayıf şifreleri güçlü ve karmaşık şifrelerle yenilenmiştir.
* **SAST ve OWASP Standardı**: Güvenlik ve kodlama kurallarını (Zero Trust) standartlaştırmak üzere `eslint-plugin-security` projeye dahil edilip kuralları sisteme entegre edilmiştir.
* **Savunmacı Programlama Eğitimi**: Sistem temsilcisinin (Agent) gelecekteki geliştirmelerde OWASP ilkelerine sadık kalması adına `AGENTS.md` dosyası güncellenmiştir.

### Geliştirmeler (Features & Enhancements)
* **Blog Paneli Toplu İşlemler**: Blog içerikleri için "Toplu Seçme", "Toplu Yayınlama", "Toplu Taslağa Çekme" ve "Toplu Silme" özellikleri kullanıcı deneyimi gözetilerek (UX) eklenmiştir.
* **Otomatik SEO Ping Entegrasyonu**: Blog içerikleri yayınlandığı an arka planda arama motorlarına (Google, Bing, IndexNow) doğrudan bildirim (ping) atması sağlanmıştır.
* **Gelişmiş Bildirim Arayüzü (Toast)**: Admin panelindeki Toast bildirimlerinin tasarımı (ikon, renk uyumu ve animasyonlar) iyileştirilmiş ve ekranda bekleme süresi 3 saniye olarak optimize edilmiştir.

## [v1.1.1] - Vercel ve OWASP Güvenlik Sıkılaştırması

### Güvenlik (Security)
* **Vercel Güvenlik Header'ları**: Projeye `vercel.json` eklenerek `X-Frame-Options`, `Content-Security-Policy` (CSP), `X-Content-Type-Options`, `Referrer-Policy` ve `Permissions-Policy` header'ları global olarak zorunlu kılındı.
* **CORS Wildcard Koruması**: API rotalarındaki CORS ayarları `*` (wildcard) yerine yalnızca `https://pasamotor.com.tr` ve `http://localhost:3000` alan adlarına izin verecek şekilde (strict origin) sınırlandırıldı.
* **Supabase RLS Kuralları**: Supabase üzerindeki `products`, `posts`, `pages`, `users` ve admin tabloları (backups, suppliers, logs) için RLS (Row Level Security) SQL komutları hazırlanıp projeye (`supabase_rls.sql`) eklendi.
* **Form CSRF ve Zod Validation**: İletişim sayfasındaki form, istemci tarafında Supabase'e doğrudan insert etmek yerine güvenli bir POST API endpoint'ine (`/api/contact`) bağlandı. API'ye `express-rate-limit` (Dakikada max 3) ve `Zod` input validation eklendi.
* **Admin Modülü ve Bilgi Sızıntısı Koruması**: 
  - `robots.txt` güncellenerek `/admin` dizini arama motorlarına ve AI botlarına (GPTBot, ClaudeBot vb.) kapatıldı.
  - Hassas dosyalara (`.env` vb.) veya tanımlanmayan API rotalarına doğrudan erişim 404 hatası döndürecek şekilde `server.ts` içinde engellendi.
  - Kullanılmayan harici script'ler (Puter.js) ve mükerrer SEO meta etiketleri temizlendi.
* **Anti-Scraping E-posta Koruması**: İletişim adresindeki e-posta, statik okumayı ve spam botlarını engellemek adına Base64 decode yöntemiyle client-side çalışma (DOM hydration) mantığına çevrildi.
