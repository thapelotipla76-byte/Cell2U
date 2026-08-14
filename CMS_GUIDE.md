# Cell2U CMS & Customization Guide

Welcome to the **Cell2U** content management guide. This document explains how to update your store catalogue, pricing, contact details, and WhatsApp ordering flow without needing a backend server or database.

---

## 1. Store Business Settings & WhatsApp Number

All store-wide configuration, operating hours, support email, and your primary WhatsApp contact number are managed in a single configuration file:

📁 **Location:** `data/config.js`

Open `data/config.js` in any text editor to customize:
* **`whatsappPool`**: An array of multiple WhatsApp numbers with `label`, `enabled` status, and `priority`. When customers click "Order via WhatsApp" or enquiry buttons, the store automatically rotates incoming inquiries between enabled numbers using a persistent round-robin distribution.
* **`whatsappFallback`**: A dedicated backup number used if all numbers in the pool are disabled.
* **`whatsappDisplay`**: The customer-facing phone number shown in the header, footer, and contact section.
* **Customer Support**: Managed via WhatsApp and telephone enquiries.
* **`operatingHours`**: Your store hours.
* **`enableOnlinePayment`**: Kept `false` to ensure the storefront operates exclusively on direct WhatsApp enquiries and orders.

---

## 2. Managing Products and Pricing

All device models, brands, and prices are stored in a structured JSON file:

📁 **Location:** `data/products.json`

To add, remove, or update device prices (for Huawei, Samsung, Honor, Oppo, or any other brand):
1. Open `data/products.json`.
2. Locate the product object inside the `"products"` array.
3. Edit the `"name"`, `"model"`, `"brand"`, or `"price"` value.
4. Save the file. The shop, search, category filters, and product detail pages update instantly in the browser.

### Example Product Entry:
```json
{
  "id": 1,
  "name": "Huawei Y60",
  "model": "Y60",
  "brand": "HUAWEI",
  "category": "smartphones",
  "price": 1950,
  "originalPrice": null,
  "image": "images/phone-light.jpg",
  "inStock": true,
  "specs": ["6.6\" Display", "5000mAh Battery"],
  "description": "Huawei Y60 smartphone catalogue listing.",
  "features": ["Long-lasting battery", "Clear dual camera"],
  "whatsInBox": ["Huawei Y60 Handset", "Charger", "Quick Start Guide"]
}
```

---

## 3. Deploying Updates to GitHub Pages

Because Cell2U is built as a pure static site (HTML, CSS, JavaScript, and JSON), you can host it for free on GitHub Pages:
1. Push all files from your working directory to your GitHub repository (`thapelotipla76-byte/Cell2U`).
2. Go to your repository **Settings** → **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` branch and `/ (root)` folder, then click **Save**.
4. Your live store will update within seconds whenever you push new changes or catalogue updates.


---

## 4. Making Your Store Easy to Find on Google (SEO & Indexing)

To ensure your GitHub Pages store appears prominently in Google search results:

1. **Submit to Google Search Console**:
   * Go to [Google Search Console](https://search.google.com/search-console).
   * Add your GitHub Pages URL (e.g., `https://thapelotipla76-byte.github.io/Cell2U/`).
   * Verify ownership via HTML tag or file upload.
   * Submit your sitemap (`https://thapelotipla76-byte.github.io/Cell2U/sitemap.xml`) for fast crawling.

2. **Custom Domain (Recommended for Top Rankings)**:
   * While GitHub Pages URLs (`*.github.io`) rank on Google, purchasing a custom domain (e.g., `cell2u.co.za`) and binding it in your repository Settings → Pages significantly improves brand trust and search ranking potential.

3. **SEO Meta Tags & Sitemap**:
   * The included `robots.txt` and `sitemap.xml` files guide search engine bots automatically.
   * Every page includes optimized title tags, meta descriptions, Open Graph data, and canonical links.
