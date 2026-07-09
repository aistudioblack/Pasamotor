// Google Search Console & Analytics API Service Layer

export async function fetchGSCSites(accessToken: string) {
  try {
    const res = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) {
      console.warn("GSC siteleri çekilemedi. Bağlı siteniz olmayabilir.", await res.text());
      return { siteEntry: [] };
    }
    return await res.json();
  } catch(e) {
    console.error("GSC fetch error:", e);
    return { siteEntry: [] };
  }
}

export async function fetchGSCSearchAnalytics(accessToken: string, siteUrl: string, startDate: string, endDate: string) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 50
    })
  });
  if (!res.ok) {
    throw new Error("GSC arama istatistikleri okunamadı");
  }
  return await res.json();
}

export async function fetchGA4Accounts(accessToken: string) {
  const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error("GA4 hesapları okunamadı");
  }
  return await res.json();
}

export async function fetchGA4Report(accessToken: string, propertyId: string) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${accessToken}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: 15
    })
  });
  if (!res.ok) {
    throw new Error("GA4 raporu okunamadı");
  }
  return await res.json();
}
