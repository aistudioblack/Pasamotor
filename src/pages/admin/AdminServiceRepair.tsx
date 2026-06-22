import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Wrench, Plus, Car, Tag, Trash2, Shield, Hammer, FileText, ShoppingCart, User, Smartphone, Printer, Loader2, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dbClient } from "@/lib/db-client";

// Types
type ServicePart = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isCustom: boolean;
};

type ServiceOrder = {
  id: string;
  plate: string;
  customerName: string;
  customerPhone: string;
  vehicleBrand: string;
  vehicleModel: string;
  km: string;
  status: 'Açık' | 'Onarımda' | 'Kapatıldı';
  mechanic: string;
  notes: string;
  parts: ServicePart[];
  createdAt: string;
};

export default function AdminServiceRepair() {
  const { toast } = useToast();
  
  // Storage and State
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'liste' | 'yeni'>('liste');
  
  // Modal for Order Detail/Editing
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  
  // Custom dialog confirmations for Iframe / Sandbox reliability
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [whatsappConfirm, setWhatsappConfirm] = useState<{ phone: string; message: string } | null>(null);
  
  // DB parts
  const [dbParts, setDbParts] = useState<{id: string, name: string, price: number}[]>([]);
  const [loadingParts, setLoadingParts] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");

  // Current User Simulation (Usually fetched from Context/Supabase Auth)
  const [simulatedRole, setSimulatedRole] = useState<'mechanic' | 'manager'>('manager');
  const proformaRef = useRef<HTMLDivElement>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [mechanicsList, setMechanicsList] = useState<{ email: string; name: string; appRole: string }[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<ServiceOrder>>({
    plate: '', customerName: '', customerPhone: '', vehicleBrand: '', vehicleModel: '', km: '', notes: '', mechanic: ''
  });

  useEffect(() => {
    // Determine real role from localStorage or dbClient if we want to integrate it smoothly
    dbClient.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setCurrentUserEmail(data.user.email || "");
        
        setFormData(prev => ({
          ...prev,
          mechanic: prev.mechanic || data.user.email || "Servis Ekibi"
        }));

        let { data: dbUser } = await dbClient.from('users').select('role, name').eq('id', data.user.id).maybeSingle();
        if (!dbUser && data.user) {
          try {
            const { data: inserted } = await dbClient
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email || '',
                role: 'user',
                name: 'user'
              })
              .select('role, name')
              .maybeSingle();
            if (inserted) {
              dbUser = inserted;
            }
          } catch (e) {
            console.warn("Failed to auto-create user entry:", e);
          }
        }
        const userRole = (dbUser?.name && ['admin', 'senior_manager', 'manager', 'mechanic', 'editor', 'user'].includes(dbUser.name)) 
          ? dbUser.name 
          : (dbUser?.role || 'user');
          
        if (userRole === 'mechanic') {
          setSimulatedRole('mechanic');
        } else if (userRole === 'admin' || userRole === 'senior_manager' || userRole === 'manager' || data.user.email === 'ahmetcafoglu@hotmail.com') {
          setSimulatedRole('manager');
        }
      }
    });

    const loadData = async () => {
      setLoadingParts(true);
      try {
        const { data: products } = await dbClient.from('products').select('id, name, price');
        if (products) {
          setDbParts(products.map(p => ({ id: p.id, name: p.name, price: p.price })));
        }

        // Fetch registered users to list as mechanics
        const { data: dbUsers } = await dbClient.from('users').select('email, name, role');
        if (dbUsers) {
          const list = dbUsers.map((u: any) => {
            const appRole = (u.name && ['admin', 'senior_manager', 'manager', 'mechanic', 'editor', 'user'].includes(u.name))
              ? u.name
              : (u.role || 'user');
            return {
              email: u.email,
              name: u.email.split('@')[0],
              appRole: appRole
            };
          });
          setMechanicsList(list);
        }

        // Fetch Orders
        const { data: dbOrders } = await dbClient.from('service_orders' as any).select('*, service_order_parts(*)').order('created_at', { ascending: false });
        if (dbOrders && dbOrders.length > 0) {
          const formatted = dbOrders.map((o: any) => ({
             id: o.id,
             plate: o.plate,
             customerName: o.customer_name,
             customerPhone: o.customer_phone || '',
             vehicleBrand: o.vehicle_brand || '',
             vehicleModel: o.vehicle_model || '',
             km: o.km || '',
             status: o.status || 'Açık',
             mechanic: o.mechanic || '',
             notes: o.notes || '',
             createdAt: o.created_at,
             parts: (o.service_order_parts || []).map((p: any) => ({
               id: p.id,
               name: p.name,
               price: Number(p.price),
               quantity: p.quantity,
               isCustom: p.is_custom
             }))
          }));
          setOrders(formatted);
        } else if (!dbOrders || dbOrders.length === 0) {
           setOrders([]);
         }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingParts(false);
      }
    };
    loadData();
  }, []);

  const saveOrders = (newOrders: ServiceOrder[]) => {
    // Left for backwards compatibility in local state if needed.
    setOrders(newOrders);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plate || !formData.customerName) {
       toast({ title: "Hata", description: "Plaka ve Müşteri Adı zorunludur.", variant: "destructive" });
       return;
    }
    
    // Insert to DB
    const { data: inserted, error } = await dbClient.from('service_orders' as any).insert({
      plate: formData.plate.toUpperCase(),
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone || '',
      vehicle_brand: formData.vehicleBrand || '',
      vehicle_model: formData.vehicleModel || '',
      km: formData.km || '',
      status: 'Açık',
      mechanic: formData.mechanic || 'Atanmadı',
      notes: formData.notes || ''
    }).select().single();

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    const newOrder: ServiceOrder = {
      id: inserted.id, // Using DB UUID
      plate: inserted.plate,
      customerName: inserted.customer_name,
      customerPhone: inserted.customer_phone,
      vehicleBrand: inserted.vehicle_brand,
      vehicleModel: inserted.vehicle_model,
      km: inserted.km,
      status: inserted.status,
      mechanic: inserted.mechanic,
      notes: inserted.notes,
      parts: [],
      createdAt: inserted.created_at
    };
    
    setOrders([newOrder, ...orders]);
    setFormData({ plate: '', customerName: '', customerPhone: '', vehicleBrand: '', vehicleModel: '', km: '', notes: '', mechanic: formData.mechanic });
    setActiveTab('liste');
    toast({ title: "Başarılı", description: "Yeni iş emri açıldı." });
  };

  // --- Part Addition States ---
  const [partAddMode, setPartAddMode] = useState<'db' | 'custom'>('db');
  const [selectedDbPart, setSelectedDbPart] = useState('');
  const [customPartName, setCustomPartName] = useState('');
  const [customPartPrice, setCustomPartPrice] = useState('');
  const [partQty, setPartQty] = useState('1');

  const handleAddPartToOrder = async () => {
    if (!selectedOrder) return;

    let product_id: string | null = null;
    let name = '';
    let price = 0;
    const quantity = parseInt(partQty) || 1;
    let is_custom = false;
    
    if (partAddMode === 'db') {
      const dbPart = dbParts.find(p => p.id === selectedDbPart);
      if (dbPart) {
        product_id = dbPart.id;
        name = dbPart.name;
        price = dbPart.price;
        is_custom = false;
      }
    } else {
      if (customPartName && customPartPrice) {
        name = customPartName;
        price = parseFloat(customPartPrice);
        is_custom = true;
      }
    }

    if (name) {
      const { data: inserted, error } = await dbClient.from('service_order_parts' as any).insert({
        order_id: selectedOrder.id,
        product_id: product_id,
        name: name,
        price: price,
        quantity: quantity,
        is_custom: is_custom
      }).select().single();

      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
        return;
      }

      const partToAdd: ServicePart = {
        id: inserted.id,
        name: inserted.name,
        price: Number(inserted.price),
        quantity: inserted.quantity,
        isCustom: inserted.is_custom
      };

      const updatedOrder = { ...selectedOrder, parts: [...selectedOrder.parts, partToAdd] };
      setSelectedOrder(updatedOrder);
      
      const updatedOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      setOrders(updatedOrders);
      
      setCustomPartName('');
      setCustomPartPrice('');
      setPartQty('1');
      toast({ title: "Parça Eklendi", description: "Sepete başarıyla eklendi." });
    } else {
      toast({ title: "Hata", description: "Eksik bilgi girdiniz.", variant: "destructive" });
    }
  };

  const handleRemovePart = async (partId: string) => {
    if (!selectedOrder) return;
    const { error } = await dbClient.from('service_order_parts' as any).delete().eq('id', partId);
    if(error){
       toast({ title: "Hata", description: error.message, variant: "destructive" });
       return;
    }
    const updatedOrder = { ...selectedOrder, parts: selectedOrder.parts.filter(p => p.id !== partId) };
    setSelectedOrder(updatedOrder);
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleStatusChange = async (newStatus: 'Açık' | 'Onarımda' | 'Kapatıldı') => {
    if (!selectedOrder) return;
    
    // YÖNETİCİ KONTROLÜ
    if (newStatus === 'Kapatıldı' && simulatedRole !== 'manager') {
      toast({ title: "Yetki Hatası", description: "Sadece Yöneticiler (Manager/Admin) iş emirlerini kapatabilir.", variant: "destructive" });
      return;
    }

    const { error } = await dbClient.from('service_orders' as any).update({ status: newStatus }).eq('id', selectedOrder.id);
    if(error){
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    const updatedOrder = { ...selectedOrder, status: newStatus };
    setSelectedOrder(updatedOrder);
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    
    toast({ 
      title: "Durum Güncellendi", 
      description: `İş emri durumu ${newStatus} olarak değiştirildi. Müşteriye bildirim gönderebilirsiniz.`,
    });

    if (updatedOrder.customerPhone) {
       let phoneNum = updatedOrder.customerPhone.replace(/\D/g, '');
       if (phoneNum.startsWith('0')) phoneNum = '9' + phoneNum;
       else if (!phoneNum.startsWith('90')) phoneNum = '90' + phoneNum;
       const msg = `Sayın ${updatedOrder.customerName}, ${updatedOrder.plate} plakalı aracınızın servis durumu güncellenmiştir: *${updatedOrder.status}*. Teşekkür ederiz.`;
       
       setWhatsappConfirm({ phone: phoneNum, message: msg });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      // First, delete related parts to ensure integrity even if DB CASCADE has issues
      await dbClient.from('service_order_parts' as any).delete().eq('order_id', orderToDelete);

      const { error } = await dbClient.from('service_orders' as any).delete().eq('id', orderToDelete);
      if (error) {
         toast({ title: "Hata", description: error.message, variant: "destructive" });
         setOrderToDelete(null);
         return;
      }
      setOrders(orders.filter(o => o.id !== orderToDelete));
      if (selectedOrder && selectedOrder.id === orderToDelete) {
         setSelectedOrder(null);
      }
      toast({ title: "Başarılı", description: "İş emri silindi." });
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setOrderToDelete(null);
    }
  };

  const calculateTotal = (parts: ServicePart[]) => {
    return parts.reduce((acc, part) => acc + (part.price * part.quantity), 0);
  };

  const handlePrintProforma = () => {
    if (!selectedOrder) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const partsHtml = selectedOrder.parts.map((p, i) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${i + 1}. ${p.name} ${p.isCustom ? '(Harici)' : ''}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${p.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₺${p.price.toLocaleString('tr-TR')}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₺${(p.price * p.quantity).toLocaleString('tr-TR')}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Proforma Fatura - ${selectedOrder.plate}</title>
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #222; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; }
            .info-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
            .info-value { font-size: 16px; font-weight: bold; }
            table { w-full; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; background: #f0f0f0; border-bottom: 2px solid #ddd; }
            .total-row { font-size: 18px; font-weight: bold; text-align: right; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <div>
              <h1 class="title">PAŞA MOTOR</h1>
              <p style="margin: 5px 0 0 0; color: #666;">Proforma Fatura & Servis İş Emri</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0;"><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
              <p style="margin: 5px 0 0 0;"><strong>İş Emri No:</strong> ${selectedOrder.id}</p>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Müşteri Bilgileri</div>
              <div class="info-value">${selectedOrder.customerName}</div>
              <div style="margin-top: 5px; color: #555;">${selectedOrder.customerPhone || 'Telefon Yok'}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Araç Bilgileri</div>
              <div class="info-value">${selectedOrder.plate} - ${selectedOrder.vehicleBrand} ${selectedOrder.vehicleModel}</div>
              <div style="margin-top: 5px; color: #555;">KM: ${selectedOrder.km || 'Bilinmiyor'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Parça / İşçilik Açıklaması</th>
                <th style="text-align: right;">Adet</th>
                <th style="text-align: right;">Birim Fiyat</th>
                <th style="text-align: right;">Toplam</th>
              </tr>
            </thead>
            <tbody>
              ${partsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-row" style="padding: 20px 12px;">GENEL TOPLAM:</td>
                <td class="total-row" style="padding: 20px 12px; color: #e11d48;">₺${calculateTotal(selectedOrder.parts).toLocaleString('tr-TR')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 50px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>Bu belge mali yasal bir fatura değildir, bilgilendirme amaçlı proforma (ön fatura) mahiyetindedir.</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pb-10">
        
        {/* Header & Role Simulator */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Servis & Tamir</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> 
                Mobil Uyumlu İş Emri & Proforma Yönetimi
              </p>
            </div>
          </div>
          
          <div className="flex bg-muted/50 p-1.5 rounded-lg border border-border items-center">
            <span className="text-xs font-medium text-muted-foreground px-3">Yetki Testi:</span>
            <button 
              onClick={() => setSimulatedRole('mechanic')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${simulatedRole === 'mechanic' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Mekanik Ustası
            </button>
            <button 
              onClick={() => setSimulatedRole('manager')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${simulatedRole === 'manager' ? 'bg-background shadow text-emerald-600' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Yönetici (Admin)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => { setActiveTab('liste'); setSelectedOrder(null); }}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'liste' && !selectedOrder ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50 text-foreground hover:bg-muted border border-border'}`}
          >
            <FileText className="w-4 h-4" /> Açık İş Emirleri
          </button>
          <button 
            onClick={() => { setActiveTab('yeni'); setSelectedOrder(null); }}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'yeni' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50 text-foreground hover:bg-muted border border-border'}`}
          >
            <Plus className="w-4 h-4" /> Yeni Kabul (Check-in)
          </button>
        </div>

        {/* --- YENİ KAYIT FORMU --- */}
        {activeTab === 'yeni' && !selectedOrder && (
          <div className="glass-card rounded-2xl p-4 md:p-6 sm:max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-4">
              <Car className="w-5 h-5 text-primary" /> Müşteri & Araç Kabul Tutanağı
            </h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Araç Plakası *</label>
                  <input type="text" required value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-primary/20 outline-none" placeholder="34 ABC 123" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Kilometre</label>
                  <input type="text" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none" placeholder="15.420" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Marka</label>
                  <input type="text" value={formData.vehicleBrand} onChange={e => setFormData({...formData, vehicleBrand: e.target.value})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Örn: Honda" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Model</label>
                  <input type="text" value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Örn: PCX 125" />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-xl space-y-4 border border-border mt-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Müşteri Adı *</label>
                  <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ad Soyad" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Telefon</label>
                  <input type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="05XX XXX XX XX" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Kabul Eden / Atanan Usta *</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select 
                    value={formData.mechanic || ''} 
                    onChange={e => setFormData({...formData, mechanic: e.target.value})} 
                    required
                    className="w-full sm:w-1/2 px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  >
                    <option value="">-- Usta Seçiniz --</option>
                    {mechanicsList.map(m => (
                      <option key={m.email} value={m.email}>
                        {m.email.split('@')[0]} ({m.appRole === 'mechanic' ? 'Usta' : m.appRole === 'admin' ? 'Admin' : m.appRole === 'senior_manager' ? 'S. Manager' : 'Yönetici'})
                      </option>
                    ))}
                    {!mechanicsList.some(m => m.email === currentUserEmail) && currentUserEmail && (
                      <option value={currentUserEmail}>{currentUserEmail.split('@')[0]} (Siz)</option>
                    )}
                    <option value="Servis Ekibi">Genel Servis Ekibi</option>
                    <option value="Fatih Usta">Fatih Usta</option>
                    <option value="Ahmet Usta">Ahmet Usta</option>
                    <option value="Mustafa Usta">Mustafa Usta</option>
                  </select>
                  <input 
                    type="text" 
                    value={formData.mechanic || ''} 
                    onChange={e => setFormData({...formData, mechanic: e.target.value})}
                    placeholder="Veya elle isim girin..." 
                    className="w-full sm:flex-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Servis kaydını açan usta veya yetkilinin seçilmesi operasyonel takip için zorunludur.</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Servis Notu / Arıza Şikayeti</label>
                <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Müşteri şikayeti: ..."></textarea>
              </div>

              <div className="pt-4 border-t border-border flex gap-4 items-center">
                <button type="submit" className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md">
                  İş Emrini Başlat
                </button>
                <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">🟢 Supabase Canlı Veritabanı Sistemine Bağlı</span>
              </div>
            </form>
          </div>
        )}

        {/* --- İŞ EMRİ LİSTESİ (Mobil Uyumlu) --- */}
        {activeTab === 'liste' && !selectedOrder && (
          <div className="space-y-4">
            
            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Plaka, İsim veya İş Emri No..." 
                  className="w-full bg-background border border-border rounded-xl text-sm pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select 
                  className="w-full bg-background border border-border rounded-xl text-sm pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="Tümü">Tüm Durumlar</option>
                  <option value="Açık">Açık</option>
                  <option value="Onarımda">Onarımda</option>
                  <option value="Kapatıldı">Kapatıldı</option>
                </select>
              </div>
            </div>

            {/* Mobil Liste / Masaüstü Tablo Görünümü */}
            <div className="w-full">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto glass-card rounded-xl border border-border">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-medium">İş Emri & Plaka</th>
                      <th className="px-4 py-3 font-medium">Müşteri</th>
                      <th className="px-4 py-3 font-medium">Araç</th>
                      <th className="px-4 py-3 font-medium">Usta</th>
                      <th className="px-4 py-3 font-medium">Durum</th>
                      <th className="px-4 py-3 font-medium text-right">Tutar</th>
                      <th className="px-4 py-3 font-medium text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders
                      .filter(o => 
                        (statusFilter === "Tümü" || o.status === statusFilter) &&
                        (o.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.id.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map(order => (
                        <tr key={`dt-${order.id}`} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <div className="font-mono text-[10px] text-muted-foreground mb-1">{order.id.slice(0,12)}{order.id.length > 12 ? '...' : ''}</div>
                            <div className="font-bold text-foreground uppercase">{order.plate}</div>
                          </td>
                          <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <div className="font-medium text-foreground text-xs">{order.customerName}</div>
                          </td>
                          <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <div className="text-xs text-muted-foreground">{order.vehicleBrand}</div>
                            <div className="font-medium text-foreground text-xs">{order.vehicleModel}</div>
                          </td>
                          <td className="px-4 py-4 text-xs cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            {order.mechanic}
                          </td>
                          <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                               order.status === 'Kapatıldı' ? 'bg-emerald-500/10 text-emerald-500' : 
                               order.status === 'Onarımda' ? 'bg-amber-500/10 text-amber-500' : 
                               'bg-primary/10 text-primary'
                             }`}>
                               {order.status}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-right cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <span className="font-bold text-foreground text-sm">₺{calculateTotal(order.parts).toLocaleString('tr-TR')}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                             <div className="flex justify-end gap-1">
                               <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20" title="Görüntüle/Düzenle">
                                 <FileText className="w-4 h-4" />
                               </button>
                               {simulatedRole === 'manager' && (
                                 <button onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20" title="Sil">
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               )}
                             </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden flex flex-col gap-3">
                {orders
                  .filter(o => 
                    (statusFilter === "Tümü" || o.status === statusFilter) &&
                    (o.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     o.id.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(order => (
                    <div 
                      key={`mob-${order.id}`}
                      onClick={() => setSelectedOrder(order)}
                      className={`glass-card rounded-xl p-4 flex flex-col gap-3 border-l-4 ${order.status === 'Kapatıldı' ? 'border-l-emerald-500 opacity-80' : order.status === 'Onarımda' ? 'border-l-amber-500' : 'border-l-primary'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                           <div className="font-mono text-[10px] text-muted-foreground mb-1">{order.id.slice(0,8)}...</div>
                           <div className="font-bold text-lg text-foreground uppercase">{order.plate}</div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                          order.status === 'Kapatıldı' ? 'bg-emerald-500/10 text-emerald-500' : 
                          order.status === 'Onarımda' ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-primary/10 text-primary'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground border-y border-border py-3">
                        <div className="flex items-center gap-1.5 min-w-[120px]"><User className="w-3.5 h-3.5" /> <span className="font-medium">{order.customerName}</span></div>
                        <div className="flex items-center gap-1.5 min-w-[120px]"><Car className="w-3.5 h-3.5" /> <span>{order.vehicleBrand} {order.vehicleModel}</span></div>
                        <div className="flex items-center gap-1.5 min-w-[120px]"><Hammer className="w-3.5 h-3.5" /> <span>{order.mechanic}</span></div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-bold text-foreground text-base">₺{calculateTotal(order.parts).toLocaleString('tr-TR')}</span>
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg">Aç</button>
                          {simulatedRole === 'manager' && (
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }} className="p-1.5 text-destructive bg-destructive/10 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {orders.filter(o => 
                  (statusFilter === "Tümü" || o.status === statusFilter) &&
                  (o.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   o.id.toLowerCase().includes(searchQuery.toLowerCase()))
                ).length === 0 && (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed border-border m-4 rounded-xl">
                  Arama kriterlerine uygun servis kaydı bulunmuyor.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- DETAY & YEDEK PARÇA MODÜLÜ --- */}
        {selectedOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Sol: Bilgiler & Durum */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-5 border-t-4 border-primary">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-foreground font-mono">{selectedOrder.plate}</h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-1 px-3 bg-muted rounded-lg text-xs hover:bg-muted/80">Kapat</button>
                </div>
                
                <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                  <p><span className="text-muted-foreground">Araç:</span> <span className="font-medium text-foreground float-right">{selectedOrder.vehicleBrand} {selectedOrder.vehicleModel}</span></p>
                  <p><span className="text-muted-foreground">KM:</span> <span className="font-medium text-foreground float-right">{selectedOrder.km}</span></p>
                  <p><span className="text-muted-foreground">Müşteri:</span> <span className="font-medium text-foreground float-right">{selectedOrder.customerName}</span></p>
                  <p><span className="text-muted-foreground">Telefon:</span> <span className="font-medium text-foreground float-right">{selectedOrder.customerPhone || '-'}</span></p>
                  <p><span className="text-muted-foreground">Usta:</span> <span className="font-medium text-foreground float-right">{selectedOrder.mechanic}</span></p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase opacity-70">Durum İşlemleri</label>
                  {simulatedRole === 'mechanic' ? (
                     <button 
                       onClick={() => handleStatusChange('Onarımda')} 
                       className={`w-full text-sm py-3 rounded-xl font-medium transition-all shadow-md ${selectedOrder.status === 'Onarımda' ? 'bg-amber-500 text-white cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                       disabled={selectedOrder.status === 'Onarımda' || selectedOrder.status === 'Kapatıldı'}
                     >
                        {selectedOrder.status === 'Onarımda' ? 'Onarım Devam Ediyor' : selectedOrder.status === 'Kapatıldı' ? 'İş Emri Kapalı' : 'Onarıma Başla / Güncelle'}
                     </button>
                  ) : (
                     <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleStatusChange('Onarımda')} className={`text-sm py-3 rounded-xl font-medium transition-all ${selectedOrder.status === 'Onarımda' ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Onarımda</button>
                        <button onClick={() => handleStatusChange('Kapatıldı')} className={`text-sm py-3 rounded-xl font-medium transition-all ${selectedOrder.status === 'Kapatıldı' ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'}`}>
                          İş Emri Kapat
                        </button>
                     </div>
                  )}
                  {simulatedRole === 'mechanic' && selectedOrder.status !== 'Kapatıldı' && (
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5"><Shield className="w-3 h-3 text-amber-500" /> İş emrini yalnızca yetkili yöneticiler kapatabilir.</p>
                  )}
                </div>

                <div className="space-y-2 mt-6 pt-4 border-t border-border">
                  <label className="text-xs font-semibold text-muted-foreground uppercase opacity-70">Müşteriye Bildir</label>
                  <p className="text-[11px] text-muted-foreground mb-2">Değişiklikleri veya güncel durumu müşteriye bildirin.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        if (!selectedOrder.customerPhone) {
                          toast({ title: "Hata", description: "Müşteri telefon numarası girilmemiş.", variant: "destructive" });
                          return;
                        }
                        let phoneNum = selectedOrder.customerPhone.replace(/\D/g, '');
                        if (phoneNum.startsWith('0')) phoneNum = '9' + phoneNum;
                        else if (!phoneNum.startsWith('90')) phoneNum = '90' + phoneNum;
                        
                        const msg = `Sayın ${selectedOrder.customerName}, ${selectedOrder.plate} plakalı aracınızın servis durumu güncellenmiştir: *${selectedOrder.status}*. Teşekkür ederiz.`;
                        window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="text-xs py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (!selectedOrder.customerPhone) {
                          toast({ title: "Hata", description: "Müşteri telefon numarası girilmemiş.", variant: "destructive" });
                          return;
                        }
                        const msg = `Sayın ${selectedOrder.customerName}, ${selectedOrder.plate} plakali aracinizin servis durumu guncellenmistir: ${selectedOrder.status}.`;
                        window.open(`sms:${selectedOrder.customerPhone}?body=${encodeURIComponent(msg)}`, '_self');
                      }}
                      className="text-xs py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" /> SMS
                    </button>
                  </div>
                  <button 
                      onClick={() => {
                        const msg = `Sayın ${selectedOrder.customerName},\n\n${selectedOrder.plate} plakalı aracınızın servis durumu güncellenmiştir: ${selectedOrder.status}.\n\nİyi günler dileriz.`;
                        window.open(`mailto:?subject=Servis Durumu Bilgilendirmesi&body=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-full mt-2 text-[11px] py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      E-posta Gönder
                  </button>
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-5">
                <h4 className="text-sm font-semibold mb-2">Müşteri Şikayeti / Servis Notu</h4>
                <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg border border-border whitespace-pre-wrap min-h-[60px]">{selectedOrder.notes || 'Not girilmemiş.'}</p>
              </div>
            </div>

            {/* Sağ: Proforma / Yedek Parça */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-0 overflow-hidden h-full flex flex-col">
                <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-center flex-wrap gap-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary" /> Yedek Parça & İşçilik Sepeti</h3>
                  <div className="text-right flex items-center gap-4">
                    <button onClick={handlePrintProforma} className="px-3 py-1.5 bg-background border border-border shadow flex items-center gap-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                      <Printer className="w-4 h-4" /> Proforma Yazdır
                    </button>
                    <div>
                      <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Ara Toplam</span>
                      <span className="text-xl font-mono font-bold text-primary">₺{calculateTotal(selectedOrder.parts).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>

                {/* Parça Ekleme Konsolu */}
                {selectedOrder.status !== 'Kapatıldı' && (
                  <div className="p-4 md:p-5 bg-background border-b border-border">
                    <div className="flex gap-2 mb-3 bg-muted/50 p-1 rounded-lg w-fit border border-border">
                      <button onClick={() => setPartAddMode('db')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${partAddMode === 'db' ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>Sistem Parçası Ekle</button>
                      <button onClick={() => setPartAddMode('custom')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${partAddMode === 'custom' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>Harici Parça / İşçilik</button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      {partAddMode === 'db' ? (
                        <select className="flex-1 w-full sm:w-auto bg-background border border-border rounded-lg text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" value={selectedDbPart} onChange={e => setSelectedDbPart(e.target.value)}>
                          <option value="">-- Veritabanından Parça Seçiniz --</option>
                          {dbParts.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (₺{p.price})</option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                          <input type="text" placeholder="Parça veya İşçilik Adı (Örn: Diğer Marka Buji)" className="flex-1 bg-background border border-border rounded-lg text-sm px-3 py-2.5 outline-none" value={customPartName} onChange={e => setCustomPartName(e.target.value)} />
                          <div className="relative w-full sm:w-32 shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium opacity-50">₺</span>
                            <input type="number" placeholder="Fiyat" className="w-full bg-background border border-border rounded-lg text-sm pl-7 pr-3 py-2.5 outline-none" value={customPartPrice} onChange={e => setCustomPartPrice(e.target.value)} />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        <input type="number" min="1" className="w-20 bg-background border border-border rounded-lg text-sm px-3 py-2.5 outline-none" value={partQty} onChange={e => setPartQty(e.target.value)} placeholder="Adet" />
                        <button onClick={handleAddPartToOrder} className="flex-1 sm:flex-none bg-foreground text-background hover:bg-foreground/90 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
                          Listeye Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sepet İçeriği */}
                <div className="p-4 md:p-5 flex-1 overflow-y-auto min-h-[300px]">
                  {selectedOrder.parts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-10">
                      <Wrench className="w-12 h-12 mb-3" />
                      <p>Kullanılan parça veya işçilik eklenmedi.</p>
                      {selectedOrder.status === 'Kapatıldı' && <p className="text-xs mt-2">Bu iş emri parça eklenmeden kapatılmıştır.</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.parts.map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center p-3 rounded-xl border border-border hover:bg-muted/30 group transition-colors">
                          <div className="flex-1 pr-4">
                            <p className="text-sm font-medium text-foreground flex items-center flex-wrap gap-2">
                              {idx + 1}. {p.name}
                              {p.isCustom && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">HARİCİ DEPO</span>}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{p.quantity} adet x ₺{p.price}</p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-mono font-bold text-foreground">₺{(p.price * p.quantity).toLocaleString('tr-TR')}</span>
                            {selectedOrder.status !== 'Kapatıldı' && (
                              <button onClick={() => handleRemovePart(p.id)} className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Custom Confirmation Modals for Delete Order */}
        {orderToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">İş Emri Silinsin mi?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Bu iş emrini ve buna bağlı tüm parça ve işçilik kayıtlarını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-sm font-semibold rounded-xl transition-all"
                >
                  Vazgeç
                </button>
                <button 
                  onClick={confirmDeleteOrder}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-semibold rounded-xl transition-all shadow-md shadow-destructive/10"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modals for WhatsApp notification */}
        {whatsappConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-550/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">WhatsApp Bildirimi</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Müşteriye iş emri durumunun güncellendiğine dair otomatik durum bildirim mesajı göndermek ister misiniz?
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setWhatsappConfirm(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-sm font-semibold rounded-xl transition-all"
                >
                  Geç ve İptal Et
                </button>
                <button 
                  onClick={() => {
                    window.open(`https://wa.me/${whatsappConfirm.phone}?text=${encodeURIComponent(whatsappConfirm.message)}`, '_blank');
                    setWhatsappConfirm(null);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
                >
                  Evet, Gönder
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
