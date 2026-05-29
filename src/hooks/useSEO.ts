import { useState, useEffect } from "react";
import { dbClient } from "@/lib/firebase-client";

export function useSEO(pageKey: string, defaultTitle: string, defaultDesc: string) {
  const [seo, setSeo] = useState({ title: defaultTitle, description: defaultDesc });

  useEffect(() => {
    dbClient
      .from("site_content")
      .select("seo_title, seo_description")
      .eq("page_key", pageKey)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSeo({
            title: data.seo_title || defaultTitle,
            description: data.seo_description || defaultDesc,
          });
        }
      })
      .catch((err) => {
        console.warn(`SEO fetch failed for key "${pageKey}", using default values.`, err);
      });
  }, [pageKey, defaultTitle, defaultDesc]);

  return seo;
}
