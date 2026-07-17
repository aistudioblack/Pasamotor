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
