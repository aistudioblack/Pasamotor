import DOMPurify from "isomorphic-dompurify";

const SAFE_HOSTS = [
  "pasamotor.com.tr",
  "www.pasamotor.com.tr",
  "images.unsplash.com",
  "plus.unsplash.com",
  "images.ctfassets.net",
];

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "em", "b", "i", "u", "s",
  "a", "blockquote", "code", "pre",
  "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title"];

export const isSafeExternalUrl = (value: string | null | undefined) => {
  if (!value) return false;

  try {
    const url = new URL(value, window.location.origin);
    const protocolAllowed = url.protocol === "https:" || url.protocol === "http:";
    const sameOrigin = url.origin === window.location.origin;
    const trustedHost = SAFE_HOSTS.includes(url.hostname);

    return protocolAllowed && (sameOrigin || trustedHost);
  } catch {
    return false;
  }
};

export const sanitizeHtml = (dirty: string | null | undefined): string => {
  if (!dirty) return "";

  const sanitized = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input", "button", "textarea", "select"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
  });

  const doc = new DOMParser().parseFromString(`<div>${sanitized}</div>`, "text/html");

  doc.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!isSafeExternalUrl(href)) {
      anchor.removeAttribute("href");
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
      return;
    }
    anchor.setAttribute("rel", "noopener noreferrer nofollow");
    anchor.setAttribute("target", "_blank");
  });

  doc.querySelectorAll("img").forEach((image) => {
    const src = image.getAttribute("src");
    if (!isSafeExternalUrl(src)) {
      image.remove();
      return;
    }
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
    if (!image.getAttribute("alt")) image.setAttribute("alt", "Paşa Motor görseli");
  });

  return doc.body.innerHTML;
};
