import { useState, useEffect } from "react";
import { dbClient } from "@/lib/db-client";

export function useSEO(pageKey: string, defaultTitle: string, defaultDesc: string) {
  const [seo, setSeo] = useState({ title: defaultTitle, description: defaultDesc });

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const { data } = await dbClient
          .from("site_content")
          .select("seo_title, seo_description")
          .eq("page_key", pageKey)
          .maybeSingle();

        if (data) {
          setSeo({
            title: data.seo_title || defaultTitle,
            description: data.seo_description || defaultDesc,
          });
        }
      } catch (err) {
        console.warn(`SEO fetch failed for key "${pageKey}", using default values.`, err);
      }
    };
    fetchSeo();
  }, [pageKey, defaultTitle, defaultDesc]);

  return seo;
}
