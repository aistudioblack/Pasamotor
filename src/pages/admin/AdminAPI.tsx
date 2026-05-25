import AdminLayout from "@/components/admin/AdminLayout";
import { Server, Code, Download, Key } from "lucide-react";

const AdminAPI = () => {
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" /> API Bağlantıları
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paşa Motor verilerini dış sistemlere aktarmak veya ERP sistemlerinden veri almak için REST API uç noktaları.
          </p>
        </div>

        <div className="space-y-6">
          {/* Base URL */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-500" /> API Temel Bağlantısı (Base URL)
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Aşağıdaki uç noktaları ana domaine ekleyerek kullanabilirsiniz. Yerel ortamda: <code>http://localhost:3000/api</code></p>
            <div className="bg-muted p-3 rounded font-mono text-sm text-foreground">
              https://pasamotor.com.tr/api
            </div>
          </div>

          {/* Endpoints */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Products API */}
            <div className="glass-card p-6 rounded-xl border-l-4 border-l-green-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-md">Ürünleri Getir</h3>
                <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">GET</span>
              </div>
              <code className="text-sm text-muted-foreground block mb-4">/api/products</code>
              <p className="text-xs text-muted-foreground mb-4">Sistemdeki tüm ürünleri listeler. JSON formatında döner.</p>
              <div className="bg-muted p-2 rounded text-xs font-mono text-foreground overflow-x-auto">
                <pre>{`{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": "123",
      "name": "Fren Balatası",
      "price": 250
    }
  ]
}`}</pre>
              </div>
            </div>

            {/* Import Products API */}
            <div className="glass-card p-6 rounded-xl border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-md">Ürün İçe Aktar / Ekle (Bulk)</h3>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs font-bold">POST</span>
              </div>
              <code className="text-sm text-muted-foreground block mb-4">/api/products/import</code>
              <p className="text-xs text-muted-foreground mb-4">Toplu ürün import etmek için kullanılır. İstek gövdesinde (body) ürün veya ürün dizisi gönderin.</p>
              <div className="bg-muted p-2 rounded text-xs font-mono text-foreground overflow-x-auto">
                <pre>{`[
  {
    "id": "123", // Varsa günceller, yoksa oluşturur
    "name": "Yeni Ürün",
    "price": 500,
    "stock": 10
  }
]`}</pre>
              </div>
            </div>

          </div>

          {/* Authentication Note */}
          <div className="glass p-6 rounded-xl flex items-start gap-4">
            <Key className="w-8 h-8 text-yellow-500 shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-1">Güvenlik ve Yetkilendirme</h3>
              <p className="text-sm text-muted-foreground">
                Mevcut API yapısı geliştirme aşamasındadır ve dış dünyaya açıktır. Üretim (production) ortamında ERP sisteminizin dışarıdan erişimi için API anahtarı (x-api-key) veya Bearer token mekanizması <code>server.ts</code> dosyasına eklenmelidir.
              </p>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAPI;
