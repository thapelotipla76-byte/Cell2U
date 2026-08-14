let storeData = {
  products: [],
  categories: [],
  brands: []
};

let cart = JSON.parse(localStorage.getItem('cell2u_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('cell2u_wishlist')) || [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('data/products.json');
    storeData = await res.json();
    
    initNavbar();
    initCartDrawer();
    initFloatingActions();
    initWhatsAppRouting();
    
    const path = window.location.pathname;
    if (path.includes('shop.html')) {
      initShopPage();
    } else if (path.includes('product.html')) {
      initProductPage();
    } else if (path.includes('checkout.html')) {
      initCheckoutPage();
    } else {
      initHomePage();
    }
  } catch (err) {
    console.error('Failed to load store data:', err);
  }
});

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
  localStorage.setItem('cell2u_cart', JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const product = storeData.products.find(p => p.id === productId);
  if (!product) return;
  
  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ product, quantity: qty });
  }
  
  updateCartCount();
  renderCartDrawer();
  openCartDrawer();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  updateCartCount();
  renderCartDrawer();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.product.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartCount();
      renderCartDrawer();
    }
  }
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(productId);
    showToast('Added to wishlist!');
  }
  localStorage.setItem('cell2u_wishlist', JSON.stringify(wishlist));
  document.querySelectorAll(`.wishlist-btn[data-id="${productId}"], .product-wishlist[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', wishlist.includes(productId));
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: #111; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem;
      font-size: 0.9rem; font-weight: 600; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

function initNavbar() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  const searchBtn = document.getElementById('search-toggle-btn');
  const searchBar = document.getElementById('search-bar');
  if (searchBtn && searchBar) {
    searchBtn.addEventListener('click', () => {
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        searchBar.querySelector('input').focus();
      }
    });
  }

  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  const cartBtn = document.getElementById('cart-toggle-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  updateCartCount();
}

function initCartDrawer() {
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close-btn');
  
  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }
  
  renderCartDrawer();
}

function openCartDrawer() {
  document.getElementById('cart-drawer')?.classList.add('active');
  document.getElementById('cart-overlay')?.classList.add('active');
  renderCartDrawer();
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.getElementById('cart-overlay')?.classList.remove('active');
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');
  
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">${icon('cart', 'icon-xl')}</div>
        <p style="font-weight:700; margin-bottom:0.5rem;">Your cart is empty</p>
        <p style="font-size:0.85rem; color:#999;">Add some items to get started!</p>
        <a href="shop.html" class="btn btn-primary btn-sm" style="margin-top:1rem;">Start Shopping</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = 'R0';
    if (shippingEl) shippingEl.textContent = 'R0';
    if (totalEl) totalEl.textContent = 'R0';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    subtotal += item.product.price * item.quantity;
    return `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.product.image}" alt="${item.product.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-price">R${item.product.price.toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQty(${item.product.id}, -1)">-</button>
            <span style="padding:0 0.5rem; font-weight:600;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQty(${item.product.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.product.id})" style="background:none; border:none; color:#999; cursor:pointer; font-size:1rem;">${icon('x')}</button>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = `R${subtotal.toLocaleString()}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `R${shipping}`;
  if (totalEl) totalEl.textContent = `R${total.toLocaleString()}`;
}

function initFloatingActions() {
  const backToTop = document.getElementById('back-to-top-btn');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.remove('hidden');
      } else {
        backToTop.classList.add('hidden');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initWhatsAppRouting() {
  const getNum = () => {
    return (typeof window.getCell2UWhatsAppNumber === 'function') 
      ? window.getCell2UWhatsAppNumber().replace(/[^0-9]/g, '') 
      : '27123456789';
  };

  const floating = document.getElementById('floating-whatsapp-link');
  if (floating) {
    floating.href = `https://wa.me/${getNum()}?text=` + encodeURIComponent("Hello Cell2U! I have an enquiry about your devices.");
  }

  const footerLink = document.getElementById('footer-whatsapp-link');
  if (footerLink) {
    footerLink.href = `https://wa.me/${getNum()}?text=` + encodeURIComponent("Hello Cell2U! I need support with an order.");
  }
}

function renderProductCard(product) {
  const isWish = wishlist.includes(product.id);
  const badgeColorMap = {
    blue: 'badge-blue-bg',
    yellow: 'badge-yellow-bg',
    red: 'badge-red-bg',
    green: 'badge-green-bg'
  };
  const badgeClass = badgeColorMap[product.badgeColor || 'blue'];

  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
        ${product.discount ? `<div class="product-discount">-${product.discount}%</div>` : ''}
        <button class="product-wishlist ${isWish ? 'active' : ''} wishlist-btn" data-id="${product.id}" onclick="event.stopPropagation(); toggleWishlist(${product.id});">
          ${icon('heart')}
        </button>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-title">${product.name}</div>
        <div class="product-rating">
          <div class="stars">${icon('star', 'icon-sm fill')}</div>
          <span>(${product.reviews || 0})</span>
        </div>
        <div class="product-specs">
          ${(product.specs || []).slice(0, 2).map(s => `<span>${s}</span>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="current-price">R${product.price.toLocaleString()}</span>
            ${product.originalPrice ? `<span class="original-price">R${product.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); addToCart(${product.id});">
            ${icon('cart')} Add
          </button>
        </div>
      </div>
    </div>
  `;
}

function initHomePage() {
  const grid = document.getElementById('featured-products-grid');
  if (grid) {
    const featured = storeData.products.slice(0, 8);
    grid.innerHTML = featured.map(p => renderProductCard(p)).join('');
  }

  const flashGrid = document.getElementById('flash-deals-grid');
  if (flashGrid) {
    const flash = storeData.products.slice(0, 4);
    flashGrid.innerHTML = flash.map(p => renderProductCard(p)).join('');
  }

  const newGrid = document.getElementById('new-arrivals-grid');
  if (newGrid) {
    const news = storeData.products.slice(4, 8);
    newGrid.innerHTML = news.map(p => renderProductCard(p)).join('');
  }

  const bestGrid = document.getElementById('best-sellers-grid');
  if (bestGrid) {
    const best = storeData.products.slice(8, 12);
    bestGrid.innerHTML = best.map(p => renderProductCard(p)).join('');
  }
}

function initShopPage() {
  const grid = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('product-count');
  const searchInput = document.getElementById('shop-search-input');
  const categoryFilters = document.getElementById('shop-category-filters');

  const params = new URLSearchParams(window.location.search);
  let activeCat = params.get('category') || 'all';
  let searchTerm = params.get('search') || '';

  if (searchInput && searchTerm) {
    searchInput.value = searchTerm;
  }

  function renderShop() {
    if (!grid) return;
    let filtered = storeData.products;

    if (activeCat !== 'all') {
      filtered = filtered.filter(p => p.category === activeCat);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q));
    }

    if (countEl) countEl.textContent = `${filtered.length} products found`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 4rem 0;">
          <div style="font-size:3rem; margin-bottom:1rem; color:var(--text-grey);">${icon('search', 'icon-xl')}</div>
          <h3 style="font-family:var(--font-display); font-size:1.25rem; margin-bottom:0.5rem;">No products found</h3>
          <p style="color:var(--text-grey); font-size:0.9rem;">Try a different search term or category filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
  }

  if (categoryFilters) {
    categoryFilters.innerHTML = `
      <button class="filter-pill ${activeCat === 'all' ? 'active' : ''}" data-cat="all">All Products</button>
      ${(storeData.categories || []).map(c => `
        <button class="filter-pill ${activeCat === c.id ? 'active' : ''}" data-cat="${c.id}">
          ${icon(c.icon || 'smartphone')} ${c.name}
        </button>
      `).join('')}
    `;

    categoryFilters.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCat = btn.getAttribute('data-cat');
        categoryFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderShop();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderShop();
    });
  }

  renderShop();
}

function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id') || '1');
  const product = storeData.products.find(p => p.id === id) || storeData.products[0];
  if (!product) return;

  const container = document.getElementById('product-detail-container');
  if (!container) return;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
      <div>
        <div style="background:white; border-radius:1.5rem; overflow:hidden; border:1px solid var(--border-grey); aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; padding:2rem;">
          <img src="${product.image}" alt="${product.name}" style="max-height:100%; object-fit:contain;">
        </div>
      </div>
      <div>
        <div style="color:var(--brand-blue); font-weight:700; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">${product.brand}</div>
        <h1 style="font-family:var(--font-display); font-size:2rem; font-weight:800; color:#111; margin-bottom:1rem;">${product.name}</h1>
        
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.25rem; color:#F59E0B;">${icon('star', 'icon-sm fill')} <span style="font-weight:700; color:#111;">${product.rating || 4.8}</span></div>
          <span style="color:var(--text-grey); font-size:0.9rem;">(${product.reviews || 120} reviews)</span>
          <span style="background:#dcfce7; color:#16a34a; font-size:0.75rem; font-weight:700; padding:0.25rem 0.75rem; border-radius:999px;">In Stock</span>
        </div>

        <div style="display:flex; align-items:baseline; gap:1rem; margin-bottom:1.5rem; background:#F8F9FB; padding:1.25rem; border-radius:1rem;">
          <span style="font-family:var(--font-display); font-size:2rem; font-weight:800; color:#111;">R${product.price.toLocaleString()}</span>
          ${product.originalPrice ? `<span style="font-size:1.1rem; color:var(--text-grey); text-decoration:line-through;">R${product.originalPrice.toLocaleString()}</span>` : ''}
          ${product.discount ? `<span style="background:var(--brand-yellow); color:#111; font-weight:800; font-size:0.8rem; padding:0.2rem 0.5rem; border-radius:0.5rem;">-${product.discount}%</span>` : ''}
        </div>

        <p style="color:var(--text-grey); line-height:1.6; margin-bottom:1.5rem;">${product.description || 'Premium device stock available for fast delivery across South Africa.'}</p>

        <div style="display:flex; gap:1rem; margin-bottom:2rem;">
          <button class="btn btn-primary" onclick="addToCart(${product.id})" style="flex:1; padding:1rem; font-size:1.05rem;">
            ${icon('cart')} Add to Cart
          </button>
          <button class="btn" onclick="toggleWishlist(${product.id})" style="background:white; border:1px solid var(--border-grey); padding:1rem; border-radius:1rem;">
            ${icon('heart')}
          </button>
        </div>

        <div style="border-top:1px solid var(--border-grey); padding-top:1.5rem;">
          <h4 style="font-family:var(--font-display); font-weight:700; margin-bottom:0.75rem;">Key Specifications</h4>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
            ${(product.specs || []).map(s => `
              <div style="background:#F8F9FB; padding:0.5rem 0.75rem; border-radius:0.5rem; font-size:0.85rem; color:#333; display:flex; align-items:center; gap:0.5rem;">
                <span style="width:6px; height:6px; background:var(--brand-blue); border-radius:50%;"></span>
                ${s}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const relatedContainer = document.getElementById('related-products-grid');
  if (relatedContainer) {
    const related = storeData.products.filter(p => p.id !== product.id).slice(0, 4);
    relatedContainer.innerHTML = related.map(p => renderProductCard(p)).join('');
  }
}

window.Cell2UStore = {
  getCart: () => cart,
  getWishlist: () => wishlist,
  addToCart,
  toggleWishlist
};
