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
      });
  }, [pageKey, defaultTitle, defaultDesc]);

  return seo;
}
