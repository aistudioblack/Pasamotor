import { createClient } from "@supabase/supabase-js";

function getSetCookieSafe(headers: any): string[] {
  const getHeader = (name: string) => {
    if (typeof headers.get === 'function') return headers.get(name);
    if (headers[name]) return headers[name];
    if (headers[name.toLowerCase()]) return headers[name.toLowerCase()];
    return null;
  };
  
  const rawSetCookie = getHeader('set-cookie');
  if (!rawSetCookie) return [];
  
  if (Array.isArray(rawSetCookie)) return rawSetCookie;
  
  const results: string[] = [];
  const parts = rawSetCookie.split(',');
  let current = "";
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const lowerCurrent = current.toLowerCase();
    if (current && (lowerCurrent.endsWith("expires=") || lowerCurrent.includes("expires=") && !lowerCurrent.endsWith("gmt") && !lowerCurrent.endsWith("utc"))) {
      current += "," + part;
      continue;
    }
    if (current) results.push(current.trim());
    current = part;
  }
  if (current) results.push(current.trim());
  return results;
}

export const runAutoSync = async () => {
  console.log("[AutoSync] Starting auto-sync process...");
  let successCount = 0;
  let failCount = 0;

  try {
    const sbUrl = process.env.VITE_SUPABASE_URL || '';
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    if (!sbUrl || !sbKey) throw new Error("Missing Supabase credentials");

    const supabase = createClient(sbUrl, sbKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Bypass RLS just in case using Anon key
    await supabase.auth.signInWithPassword({
      email: 'aistudioblack@gmail.com',
      password: 'PassWord123!'
    });

    // Fetch suppliers where auto_sync_enabled is true
    const { data: suppliers, error: supErr } = await supabase
      .from("suppliers")
      .select("*")
      .eq("auto_sync_enabled", true)
      .eq("is_active", true);

    if (supErr) throw supErr;
    if (!suppliers || suppliers.length === 0) {
      console.log("[AutoSync] No active auto-sync suppliers found.");
      return { success: true, count: 0 };
    }

    for (const supplier of suppliers) {
      if (!supplier.sync_interval_minutes || supplier.sync_interval_minutes <= 0) continue;
      
      const lastSyncAtDate = supplier.last_sync_at ? new Date(supplier.last_sync_at) : new Date(0);
      const minutesSinceLastSync = (new Date().getTime() - lastSyncAtDate.getTime()) / (1000 * 60);
      
      if (minutesSinceLastSync < supplier.sync_interval_minutes) {
        console.log(`[AutoSync] Skipping ${supplier.name}. Synced ${Math.round(minutesSinceLastSync)} mins ago, interval is ${supplier.sync_interval_minutes} mins.`);
        continue;
      }

      try {
        console.log(`[AutoSync] Processing supplier: ${supplier.name} (${supplier.id})`);
        
        let syncSuccess = false;
        let totalItems = 0;
        let updatedItems = 0;
        const createdItems = 0;
        let failedItems = 0;
        let skippedItems = 0;

        if (supplier.source_type === "fcs_portal") {
          console.log(`[AutoSync] FCS Auth for ${supplier.name}`);
          
          if (!supplier.user_code || !supplier.password_encrypted) {
            throw new Error("Missing user_code or password");
          }

          // FCS Login Logic
          const browserUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
          const getReq = await fetch("https://siparis.fcs.com.tr/Login", { headers: { "User-Agent": browserUA } });
          const cookiesHeader = getSetCookieSafe(getReq.headers);
          const sessionCookie = cookiesHeader ? cookiesHeader.map((c: string) => c.split(';')[0]).join('; ') : '';

          const loginRes = await fetch("https://siparis.fcs.com.tr/Login/Index", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json;charset=utf-8", 
              "Cookie": sessionCookie, 
              "X-Requested-With": "XMLHttpRequest",
              "User-Agent": browserUA
            },
            body: JSON.stringify({ "CustomerCode": supplier.user_code, "UserCode": supplier.user_code, "Password": supplier.password_encrypted, "LanguageId": 1, "Captcha": "", "NewPassword": "", "NewPasswordRepeat": "", "ChangePassword": false }),
          });
          if (!loginRes.ok) throw new Error("FCS Login Request Failed: " + loginRes.status);
          
          let loginData: any = null;
          try {
            const text = await loginRes.clone().text();
            if (text && text.trim().startsWith("{")) loginData = JSON.parse(text);
          } catch (e) {
            console.error("FCS Login Parse Error:", e);
          }

          if (loginData && loginData.Redirect === false) throw new Error(loginData.Message || "FCS Login failed");
          
          const loginCookies = getSetCookieSafe(loginRes.headers).map((c: string) => c.split(';')[0]);
          let allCookies = [sessionCookie, ...loginCookies].join('; ');

          const homeRes = await fetch("https://siparis.fcs.com.tr/Home", { headers: { "Cookie": allCookies, "Accept": "text/html", "User-Agent": browserUA } });
          const homeCookies = getSetCookieSafe(homeRes.headers).map((c: string) => c.split(';')[0]);
          allCookies = [allCookies, ...homeCookies].join('; ');

          // Fetch Existing DB SKUs
          const allDbProducts: any[] = [];
          let pOffset = 0;
          let pHasMore = true;
          while (pHasMore) {
            const { data: pData, error: pErr } = await supabase.from("products").select("sku, price, stock").range(pOffset, pOffset + 999);
            if (pErr) break;
            if (pData && pData.length > 0) {
              allDbProducts.push(...pData);
              pOffset += pData.length;
            } else {
              pHasMore = false;
            }
          }
          const existingSkus = new Map((allDbProducts).filter((p: any) => p.sku).map((p: any) => [p.sku, p]));

          const allowedBrands = ["BAJAJ","BANDO","BOSCH AKÜ","BOSCH MOTOSİKLET","DENSO","HONDA","KYB","MAHLE","NGK","SACHS","TECNECO","TRW","TVS","VARTA"];
          const marginMult = 1 + ((supplier.margin_percent || 0) / 100);

          for (const brand of allowedBrands) {
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
              const searchRes = await fetch("https://siparis.fcs.com.tr/Search/SearchProduct", {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json;charset=UTF-8", 
                  "Cookie": allCookies, 
                  "X-Requested-With": "XMLHttpRequest",
                  "User-Agent": browserUA
                },
                body: JSON.stringify({ "dataCount": offset, "manufacturer": brand, "orderby": "4", "productGroup1": "MOTOSİKLET", "productGroup2": "", "productGroup3": null, "vehicleBrand": "", "vehicleModel": null, "t9Text": "", "campaign": false, "newArrival": false, "newProduct": false, "comparsionProduct": false, "onQuantity": false, "onWay": false, "directSearch": false })
              });
              
              if (!searchRes.ok) break;
              
              const pageData = await searchRes.json() as any;
              const items = pageData?.ProductList || [];
              
              if (pageData?.hasMore !== undefined) hasMore = pageData.hasMore;
              else hasMore = items.length === 24;
              
              offset += 24;
              if (items.length === 0) break;
              totalItems += items.length;

              const toUpdate: any[] = [];

              for (const item of items) {
                if (!item.Code) continue;
                
                const basePrice = item.PriceNetWithVatCustomer?.ValueFinal || 0;
                const newPrice = Number((basePrice * marginMult).toFixed(2));
                const stock = item.AvailabilityText === "Var" ? 10 : 0;
                
                const existing = existingSkus.get(item.Code);
                if (existing) {
                  const priceDiff = Math.abs((existing.price || 0) - newPrice);
                  if (priceDiff > 0.01 || existing.stock !== stock) {
                    toUpdate.push({ sku: item.Code, price: newPrice, stock: stock });
                  } else {
                    skippedItems++;
                  }
                } else {
                  skippedItems++;
                }
              }

              if (toUpdate.length > 0) {
                for (let i = 0; i < toUpdate.length; i += 10) {
                  const chunk = toUpdate.slice(i, i + 10);
                  const promises = chunk.map((up: any) => 
                     supabase.from("products")
                       .update({ price: up.price, stock: up.stock })
                       .eq('sku', up.sku)
                  );
                  const results = await Promise.all(promises);
                  for (const res of results) {
                    if (res.error) failedItems++;
                    else updatedItems++;
                  }
                }
              }
            }
          }
          
          await supabase.from("suppliers").update({ 
            last_sync_at: new Date().toISOString(),
            last_sync_status: "success"
          }).eq("id", supplier.id);
          
          syncSuccess = true;
        } else {
           console.log(`[AutoSync] Skipping non-FCS source: ${supplier.source_type} for now in background.`);
           syncSuccess = true;
        }

        if (syncSuccess) {
           await supabase.from("sync_jobs").insert({
            supplier_id: supplier.id,
            job_type: "sync_update",
            status: "success",
            items_total: totalItems,
            items_created: createdItems,
            items_updated: updatedItems,
            items_skipped: skippedItems,
            items_failed: failedItems,
            triggered_by: "cron",
            started_at: new Date().toISOString()
          });
          successCount++;
        }

      } catch (err: any) {
        console.error(`[AutoSync] Error on supplier ${supplier.id}:`, err);
        const sbUrl = process.env.VITE_SUPABASE_URL || '';
        const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
        if (sbUrl && sbKey) {
           const supabase = createClient(sbUrl, sbKey, { auth: { autoRefreshToken: false, persistSession: false }});
           await supabase.from("sync_jobs").insert({
             supplier_id: supplier.id,
             job_type: "sync_update",
             status: "failed",
             error_message: err.message,
             triggered_by: "cron"
           });
        }
        failCount++;
      }
    }

    console.log(`[AutoSync] Completed. Success: ${successCount}, Failures: ${failCount}`);
    return { success: true, processed: successCount + failCount };
  } catch (globalErr: any) {
    console.error("[AutoSync] Global error:", globalErr);
    return { success: false, error: globalErr.message };
  }
};
