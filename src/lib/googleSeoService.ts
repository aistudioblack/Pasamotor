// Google Search Console & Analytics API Service Layer

export async function fetchGSCSites(accessToken: string) {
  if (accessToken === "ya29.aistudio_simulated_service_token_pasamotor_2026") {
    return { siteEntry: [{ siteUrl: "https://pasamotor.com.tr" }] };
  }
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
  if (accessToken === "ya29.aistudio_simulated_service_token_pasamotor_2026") {
    return {
      rows: [
        { keys: ["motosiklet yedek parça"], clicks: 1240, impressions: 8500, ctr: 0.14, position: 2.3 },
        { keys: ["kuba motor servis fatih"], clicks: 850, impressions: 4200, ctr: 0.20, position: 1.1 },
        { keys: ["tvs jupiter 125 kronik sorunlar"], clicks: 430, impressions: 3100, ctr: 0.13, position: 3.5 }
      ]
    };
  }
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
  if (accessToken === "ya29.aistudio_simulated_service_token_pasamotor_2026") {
    return {
      accountSummaries: [
        {
          account: "accounts/123", displayName: "Paşa Motor GA4",
          propertySummaries: [{ property: "properties/538491562", displayName: "pasamotor.com.tr GA4" }]
        }
      ]
    };
  }
  const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error("GA4 hesapları okunamadı");
  }
  return await res.json();
}

export async function fetchGA4Report(accessToken: string, propertyId: string) {
  if (accessToken === "ya29.aistudio_simulated_service_token_pasamotor_2026") {
    return {
      rows: [
        { dimensionValues: [{ value: "/kuba-motor-servis" }], metricValues: [{ value: "850" }, { value: "620" }] },
        { dimensionValues: [{ value: "/yedek-parca" }], metricValues: [{ value: "720" }, { value: "510" }] },
        { dimensionValues: [{ value: "/blog/kronik-sorunlar" }], metricValues: [{ value: "430" }, { value: "390" }] }
      ]
    };
  }
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
