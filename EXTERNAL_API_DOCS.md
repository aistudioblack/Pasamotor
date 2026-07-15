# Pasa Motor Blog Management API - For External AI Agents

This document describes the API endpoints available for external AI agents (like Manus.ai, Make, n8n) to manage blog posts on the Paşa Motor website. 

With this API, an external AI agent can:
1. List all existing blog posts to review titles and check for missing thumbnails.
2. Read the content of existing posts to evaluate their SEO quality.
3. Update existing posts to add generated thumbnails (`cover_image`), improve SEO (`meta_title`, `meta_description`), or enhance content.
4. Create new blog posts as drafts, optimized for SEO and GEO (e.g., targeting Istanbul/Fatih).

## Authentication

All requests **MUST** include an `Authorization` header with a valid API key (Bearer token).
You will need to provide the `EXTERNAL_DRAFT_API_KEY` to your AI agent.

**Header Format:**
```
Authorization: Bearer YOUR_API_KEY_HERE
```

## Base URL

```
https://pasamotor.com.tr/api/external
```
*(Or your development/preview URL if testing)*

---

## Endpoints

### 1. List Blog Posts (GET /api/external/posts)
Retrieves a list of all blog posts, or a specific post if `slug` is provided.

**Endpoint:** `GET /api/external/posts`
**Query Parameters (Optional):** 
- `slug` (string) - Fetch a specific post by its slug.

**Response (200 OK):**
```json
{
  "success": true,
  "posts": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Short excerpt...",
      "content": "Full markdown content...",
      "meta_title": "SEO Title",
      "meta_description": "SEO Description",
      "cover_image": "https://example.com/image.webp",
      "is_published": true,
      "created_at": "2026-07-15T12:00:00Z"
    }
  ]
}
```

### 2. Update a Blog Post (PUT /api/external/posts/:slug)
Updates an existing blog post. Use this to update the thumbnail (`cover_image`) or improve the SEO content.

**Endpoint:** `PUT /api/external/posts/:slug`
**Body (JSON):**
Provide only the fields you wish to update. Allowed fields: `title`, `excerpt`, `content`, `meta_title`, `meta_description`, `cover_image`, `is_published`.

```json
{
  "cover_image": "https://url-to-your-generated-thumbnail.webp",
  "meta_title": "Better SEO Title for Istanbul Kurye",
  "meta_description": "Updated SEO description targeting local searches in Fatih."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog post updated successfully.",
  "post": {
    "id": "uuid",
    "title": "Post Title",
    "slug": "post-title",
    "cover_image": "https://url-to-your-generated-thumbnail.webp",
    "is_published": true
  }
}
```

### 3. Create a Draft Blog Post (POST /api/external/draft-blog)
Creates a new blog post. It will always be saved as a draft (`is_published: false`).

**Endpoint:** `POST /api/external/draft-blog`
**Body (JSON):**
```json
{
  "title": "Yeni Motosiklet Bakım Rehberi 2026",
  "excerpt": "Kısa bir özet cümlesi.",
  "content": "Blog içeriği Markdown formatında burada yer almalıdır...",
  "meta_title": "Yeni Motosiklet Bakım Rehberi 2026 - Paşa Motor Fatih",
  "meta_description": "Motosiklet bakım rehberi ile ilgili detaylı SEO uyumlu açıklama.",
  "cover_image": "https://url-to-your-generated-thumbnail.webp"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Draft blog post created successfully.",
  "post": {
    "id": "uuid",
    "title": "Yeni Motosiklet Bakım Rehberi 2026",
    "slug": "yeni-motosiklet-bakim-rehberi-2026"
  }
}
```

---

## Instructions for AI Agents (e.g. Manus.ai)

When an AI agent is instructed to "review existing blog posts, generate thumbnails, and test SEO quality":

1. **Fetch Existing Content:**
   Make a `GET /api/external/posts` request. Analyze the titles, content, and `cover_image` field.
2. **Identify Missing Thumbnails:**
   For posts where `cover_image` is `null` or empty, use your image generation capabilities to create an appropriate thumbnail.
3. **Upload/Host the Thumbnail:**
   Host the generated image somewhere accessible via URL (or if you generate a URL, you can use that directly). 
   *(Note: The `cover_image` field accepts absolute URLs like `https://...`)*
4. **Update the Post (Thumbnail + SEO):**
   Evaluate the `meta_title` and `meta_description` for SEO and GEO (e.g., targeting Fatih, Istanbul, motorcycle repair). If it needs improvement, include the new SEO metadata along with the new `cover_image` in a `PUT /api/external/posts/:slug` request.
5. **Create New Content:**
   If instructed to create completely new SEO/GEO optimized content, use the `POST /api/external/draft-blog` endpoint. Ensure the content uses proper Markdown, targets the specific local region contextually, and has high-quality SEO meta fields.
