import { createClient } from "@supabase/supabase-js";

export async function runAutoSync() {
  const sbUrl = process.env.VITE_SUPABASE_URL || "";
  const sbKey = process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!sbUrl || !sbKey) return;

  const dbClient = createClient(sbUrl, sbKey);

  // Get active FCS auto-sync suppliers
  const { data: suppliers } = await dbClient
    .from("suppliers")
    .select("*")
    .eq("is_active", true)
    .eq("auto_sync_enabled", true)
    .ilike("name", "%fcs%");

  if (!suppliers || suppliers.length === 0) return;

  for (const supplier of suppliers) {
    console.log(`[AutoSync] Starting sync for supplier: ${supplier.name}`);
    try {
      const userCode = supplier.user_code;
      const password = supplier.password_encrypted;
      
      const getSetCookieSafe = (headers: Headers) => {
        const raw = headers.get("set-cookie");
        if (!raw) return [];
        const parts = raw.split(",");
        const results: string[] = [];
        let current = "";
        for (const part of parts) {
          if (current) {
            const lowerCurrent = current.toLowerCase();
            if (lowerCurrent.includes("expires=") && !lowerCurrent.endsWith("gmt") && !lowerCurrent.endsWith("utc")) {
              current += "," + part;
              continue;
            }
            results.push(current.trim());
          }
          current = part;
        }
        if (current) results.push(current.trim());
        return results;
      };

      // 1. FCS LOGIN
      const getReq = await fetch("https://siparis.fcs.com.tr/Login");
      const cookiesHeader = getSetCookieSafe(getReq.headers);
      const sessionCookie = cookiesHeader.length > 0 ? cookiesHeader.map(c => c.split(';')[0]).join('; ') : '';

      const loginRes = await fetch("https://siparis.fcs.com.tr/Login/Index", {
        method: "POST",
        headers: { "Content-Type": "Application/json;charset=utf-8", "Cookie": sessionCookie, "X-Requested-With": "XMLHttpRequest" },
        body: JSON.stringify({ "CustomerCode": userCode, "UserCode": userCode, "Password": password, "LanguageId": 1, "Captcha": "", "NewPassword": "", "NewPasswordRepeat": "", "ChangePassword": false }),
      });
      if (!loginRes.ok) throw new Error("FCS Login Request Failed: " + loginRes.status);
      
      const loginCookies = getSetCookieSafe(loginRes.headers).map(c => c.split(';')[0]);
      let allCookies = [sessionCookie, ...loginCookies].join('; ');
      
      const homeRes = await fetch("https://siparis.fcs.com.tr/Home", { headers: { "Cookie": allCookies, "Accept": "text/html" } });
      const homeCookies = getSetCookieSafe(homeRes.headers).map(c => c.split(';')[0]);
      allCookies = [allCookies, ...homeCookies].join('; ');

      // 2. Fetch existing local DB SKUs
      const allDbProducts: any[] = [];
      let pOffset = 0;
      let pHasMore = true;
      while (pHasMore) {
        const { data: pData, error: pErr } = await dbClient.from("products").select("sku, slug, price, stock").range(pOffset, pOffset + 999);
        if (pErr) break;
        if (pData && pData.length > 0) {
          allDbProducts.push(...pData);
          pOffset += pData.length;
        } else {
          pHasMore = false;
        }
      }
      const existingSkus = new Map((allDbProducts).filter((p: any) => p.sku).map((p: any) => [p.sku, p]));

      // 3. Search Loop
      const allowedBrands = ["BAJAJ", "KANUNİ", "PEUGEOT", "SYMPHONY", "TRW", "BOSCH", "MOTUL", "CASTROL", "NGK"];
      const marginMult = 1 + ((supplier.margin_percent || 0) / 100);
      let totalUpdated = 0;

      for (const brand of allowedBrands) {
        let fetchOffset = 0;
        let hasMore = true;
        
        while (hasMore) {
          const searchRes = await fetch("https://siparis.fcs.com.tr/Search/SearchProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=UTF-8", "Cookie": allCookies, "X-Requested-With": "XMLHttpRequest" },
            body: JSON.stringify({ "dataCount": fetchOffset, "manufacturer": brand, "orderby": "4", "productGroup1": "MOTOSİKLET", "productGroup2": "", "productGroup3": null, "vehicleBrand": "", "vehicleModel": null, "t9Text": "", "campaign": false, "newArrival": false, "newProduct": false, "comparsionProduct": false, "onQuantity": false, "onWay": false, "directSearch": false })
          });
          
          if (!searchRes.ok) break;
          const pageData = await searchRes.json() as any;
          const items = pageData?.ProductList || [];
          
          if (pageData.hasMore !== undefined) {
             hasMore = pageData.hasMore;
          } else {
             hasMore = items.length === 24;
          }
          fetchOffset += 24;
          if (items.length === 0) break;

          const toUpdate: any[] = [];

          for (const item of items) {
            const code = item.Code;
            if (!code) continue;
            
            const pPrice = item.PriceNetWithVatCustomer?.ValueFinal || 0;
            const pStock = item.AvailabilityText === "Var" ? 10 : 0;
            const newPrice = Number((pPrice * marginMult).toFixed(2));
            
            const existing = existingSkus.get(code);
            if (existing) {
              const priceDiff = Math.abs((existing.price || 0) - newPrice);
              const priceChanged = priceDiff > 0.01;
              const stockChanged = existing.stock !== pStock;

              if (priceChanged || stockChanged) {
                toUpdate.push({ sku: code, price: newPrice, stock: pStock });
              }
            }
          }

          if (toUpdate.length > 0) {
             for (let i = 0; i < toUpdate.length; i += 10) {
               const chunk = toUpdate.slice(i, i + 10);
               const promises = chunk.map(up => 
                  dbClient.from("products").update({ price: up.price, stock: up.stock }).eq('sku', up.sku)
               );
               await Promise.all(promises);
               totalUpdated += chunk.length;
             }
          }
        }
      }
      
      console.log(`[AutoSync] Completed for ${supplier.name}. Updated ${totalUpdated} items.`);
      // Update supplier status
      await dbClient.from("suppliers").update({ 
         last_sync_at: new Date().toISOString(),
         last_sync_status: "success"
      }).eq("id", supplier.id);

    } catch (e: any) {
      console.error(`[AutoSync] Error syncing supplier ${supplier.name}:`, e);
      await dbClient.from("suppliers").update({ 
         last_sync_status: `error: ${e.message}`
      }).eq("id", supplier.id);
    }
  }
}
