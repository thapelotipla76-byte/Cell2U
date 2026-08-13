# Cell2U Vanilla HTML/CSS/JS Storefront

A 1:1 vanilla HTML, CSS, and JavaScript implementation of the **Cell2U** South African online cellphone and smart devices retailer storefront.

## ✨ Features

- **Pure Frontend Static Stack**: Built with semantic HTML5, modern CSS3 (Variables, Grid, Flexbox, Animations), and modular vanilla JavaScript.
- **Clean Commerce Kinetics Design**: Baby blue (`#8ED8FF`) primary branding, bright yellow (`#FFD84D`) deal accents, and Manrope/Inter typography.
- **Complete Pages**:
  - `index.html`: Homepage with hero section, trust bar, brand logos, category grid, featured products, flash deals countdown timer, why shop with us, customer reviews, newsletter, app banner, and contact form.
  - `shop.html`: Product catalogue with live search, sorting (price, rating, featured), and category filtering pills.
  - `product.html`: Product detail page with image gallery, specs, key features, what's in the box, and related products.
  - `checkout.html`: Multi-step checkout flow with order summary and success confirmation.
- **Interactive State**:
  - Slide-out cart drawer with quantity adjustment and local storage persistence.
  - Wishlist toggle and notification toasts.
  - Responsive mobile navigation menu.

---

## 🚀 How to Load onto GitHub (Without Frontend Hosting Service)

You can host this entire site for free directly on **GitHub Pages** using standard static hosting:

1. **Create a new repository** on GitHub (e.g., `cell2u-store`).
2. **Upload all files** from this folder directly into the root of your repository:
   - `index.html`
   - `shop.html`
   - `product.html`
   - `checkout.html`
   - `css/styles.css`
   - `js/app.js`
   - `data/products.json`
   - `README.md`
3. Go to your repository **Settings** → **Pages**.
4. Under **Build and deployment**, set the source branch to `main` (or `master`) and folder to `/ (root)`.
5. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repository-name>/`.

---

## 📦 Project Structure

```
cell2u-vanilla/
├── index.html        # Homepage
├── shop.html         # Catalogue & filters
├── product.html      # Product detail view
├── checkout.html     # Multi-step checkout
├── css/
│   └── styles.css    # Global design system & layout styles
├── js/
│   └── app.js        # Store state, cart, filtering, & UI logic
└── data/
    └── products.json # Product catalogue, specs, and categories
```

---

## 💡 Notes

- **Images**: Product images are bundled in the `images/` directory and sourced from free Unsplash photography. Replace them anytime in `data/products.json` with your own owned image files or URLs.
- **Checkout**: As requested, checkout is a fully interactive simulation with local storage cart clearance and success messaging—no backend payment gateway required.
