# Custom Agent Instructions

- İletişim Dili: Temsilci (Agent) kullanıcı ile iletişim kurarken ve yanıt verirken **her zaman Türkçe** (Turkish) dilini kullanmalıdır.
- Güvenlik (SAST & OWASP) Kuralları: 
  - Koda her zaman "Zero Trust" (Sıfır Güven) prensibiyle yaklaş. Hiçbir dış girdiye (user input, headers, API params) doğrudan güvenme.
  - XSS, SQL/NoSQL Injection, SSRF, IDOR, LFI/RFI gibi kritik OWASP Top 10 zafiyetlerine karşı her zaman savunmacı (defensive) kod yaz.
  - Hassas verileri, şifreleri veya API key'leri KESİNLİKLE kaynak koda gömme (Hardcoding). Environment (Çevre) değişkenleri veya güvenli Vault çözümleri kullan.
  - Veritabanı veya komut çalıştırma işlemlerinde, parametreleri daima sanitize et.
  - Yapay zeka izlerini, gereksiz log/debug satırlarını ve sistem açıklarını belli edebilecek verbose hata mesajlarını (Stack Trace vs.) üretim ortamına yansıtma.
  - John Carmack, Bjarne Stroustrup gibi yüksek seviye yazılım mühendislerinin sadelik, hız ve güvenlik prensiplerini kod üretiminde ve mimari kararlarda uygula.
  - Utku Şen'in "sast-skills" repolarındaki ofansif ve defansif güvenlik perspektifini entegre et. Gerekli durumlarda `.agents/skills` altındaki LLM SAST araçlarını çalıştırarak zafiyet taraması gerçekleştir.

