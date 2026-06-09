import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/layout/ScrollToTop";

import Index from "./pages/Index";
import Hakkimizda from "./pages/Hakkimizda";
import Hizmetler from "./pages/Hizmetler";
import Galeri from "./pages/Galeri";
import Iletisim from "./pages/Iletisim";
import YedekParca from "./pages/YedekParca";
import Blog from "./pages/Blog";
import SehirYedekParca from "./pages/SehirYedekParca";
import KubaServis from "./pages/seo/KubaServis";
import RksServis from "./pages/seo/RksServis";
import MondialServis from "./pages/seo/MondialServis";

// No admin pages, no dynamic slugs like /yedek-parca/:slug unless they are part of static site.
// The instructions say: prerender edilecek sayfalar: /, /hakkimizda, /hizmetler, /galeri, /iletisim, /yedek-parca, /blog 
// For SSG, only static routes can be easily prerendered if we don't fetch all slugs.

export function render(url: string) {
  try {
    const helmetContext: any = {};
    const queryClient = new QueryClient();

    const html = ReactDOMServer.renderToString(
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <StaticRouter location={url}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/hakkimizda" element={<Hakkimizda />} />
                <Route path="/hizmetler" element={<Hizmetler />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/iletisim" element={<Iletisim />} />
                <Route path="/yedek-parca" element={<YedekParca />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/sehir/:slug" element={<SehirYedekParca />} />
                <Route path="/kuba-motor-yetkili-servis" element={<KubaServis />} />
                <Route path="/rks-motor-yetkili-servis" element={<RksServis />} />
                <Route path="/mondial-motor-yetkili-servis" element={<MondialServis />} />
              </Routes>
            </StaticRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );

    const { helmet } = helmetContext;
    const headTags = helmet
      ? `
        ${helmet.title.toString()}
        ${helmet.priority.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      `
      : "";

    return { html, headTags };
  } catch (error) {
    console.error(`Error rendering ${url}:`, error);
    return { html: "", headTags: "" };
  }
}
