/* Cell2U Vanilla HTML/CSS/JS — Main Logic */

let storeData = {
  products: [],
  categories: [],
  brands: []
};

let cart = JSON.parse(localStorage.getItem('cell2u_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('cell2u_wishlist')) || [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('data/products.json');
    storeData = await res.json();
    
    // Initialize UI components depending on current page
    initNavbar();
    initCartDrawer();
    initFloatingActions();
    
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

// Update cart badge & state
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

// Navbar & Drawer
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
        <div class="cart-empty-icon">🛍️</div>
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
            <span style="font-size:0.85rem; font-weight:700; padding:0 0.25rem;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQty(${item.product.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.product.id})" style="background:none; border:none; color:#999; cursor:pointer; font-size:1rem;">×</button>
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

// Render Product Card HTML
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
        <button class="product-wishlist ${isWish ? 'active' : ''}" data-id="${product.id}" onclick="event.stopPropagation(); toggleWishlist(${product.id});" aria-label="Wishlist">❤️</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name line-clamp-2">${product.name}</div>
        <div class="product-rating">
          <div class="stars">
            ${Array.from({length: 5}).map((_, i) => `<span class="star ${i < Math.floor(product.rating) ? 'filled' : 'empty'}">★</span>`).join('')}
          </div>
          <span style="color:#999; font-size:0.75rem;">(${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-specs">
          ${product.specs.slice(0, 2).map(s => `<span class="spec-tag">${s}</span>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">R${product.price.toLocaleString()}</span>
            ${product.originalPrice ? `<span class="price-original">R${product.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-sm product-add-btn" onclick="event.stopPropagation(); addToCart(${product.id});">Add</button>
        </div>
      </div>
    </div>
  `;
}

// Page Inits
function initHomePage() {
  // Featured products grid
  const featuredGrid = document.getElementById('featured-products-grid');
  if (featuredGrid) {
    featuredGrid.innerHTML = storeData.products.slice(0, 8).map(renderProductCard).join('');
  }

  // Flash deals
  const flashGrid = document.getElementById('flash-deals-grid');
  if (flashGrid) {
    const deals = storeData.products.filter(p => p.isFlashDeal).slice(0, 4);
    flashGrid.innerHTML = deals.map(renderProductCard).join('');
  }

  // New arrivals
  const newGrid = document.getElementById('new-arrivals-grid');
  if (newGrid) {
    const news = storeData.products.filter(p => p.isNew).slice(0, 4);
    newGrid.innerHTML = news.map(renderProductCard).join('');
  }

  // Best sellers
  const bestGrid = document.getElementById('best-sellers-grid');
  if (bestGrid) {
    const bests = storeData.products.filter(p => p.isBestSeller).slice(0, 4);
    bestGrid.innerHTML = bests.map(renderProductCard).join('');
  }

  // Countdown timer simulation
  let hours = 4, minutes = 15, seconds = 36;
  setInterval(() => {
    seconds--;
    if (seconds < 0) { seconds = 59; minutes--; }
    if (minutes < 0) { minutes = 59; hours--; }
    if (hours < 0) { hours = 24; }
    
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function initShopPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('category') || 'all';
  const initialSearch = urlParams.get('search') || '';

  const searchInput = document.getElementById('shop-search-input');
  const sortSelect = document.getElementById('shop-sort-select');
  const pillsContainer = document.getElementById('shop-category-pills');
  const grid = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('shop-product-count');

  if (searchInput && initialSearch) searchInput.value = initialSearch;

  let currentCategory = initialCat;
  let currentSearch = initialSearch;
  let currentSort = 'featured';

  // Render pills
  if (pillsContainer) {
    let pillsHTML = `<button class="pill ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">All Products</button>`;
    pillsHTML += storeData.categories.map(c => `
      <button class="pill ${currentCategory === c.id ? 'active' : ''}" data-cat="${c.id}">${c.icon} ${c.name}</button>
    `).join('');
    pillsContainer.innerHTML = pillsHTML;

    pillsContainer.querySelectorAll('.pill').forEach(btn => {
      btn.addEventListener('click', () => {
        pillsContainer.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat');
        filterAndRender();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      filterAndRender();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndRender();
    });
  }

  function filterAndRender() {
    let list = [...storeData.products];
    if (currentCategory !== 'all') {
      list = list.filter(p => p.category === currentCategory);
    }
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    if (currentSort === 'price-asc') list.sort((a,b) => a.price - b.price);
    if (currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (currentSort === 'rating') list.sort((a,b) => b.rating - a.rating);

    if (countEl) countEl.textContent = `${list.length} products found`;
    if (grid) {
      if (list.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 4rem 0;"><p style="font-size:2rem; margin-bottom:1rem;">🔍</p><h3>No products found</h3><p style="color:#999;">Try a different search or filter.</p></div>`;
      } else {
        grid.innerHTML = list.map(renderProductCard).join('');
      }
    }
  }

  filterAndRender();
}

function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id') || '1');
  const product = storeData.products.find(p => p.id === productId) || storeData.products[0];

  if (!product) return;

  document.title = `${product.name} | Cell2U`;
  
  // Populate details
  document.getElementById('breadcrumb-product-name').textContent = product.name;
  document.getElementById('p-brand').textContent = product.brand;
  document.getElementById('p-name').textContent = product.name;
  document.getElementById('p-price').textContent = `R${product.price.toLocaleString()}`;
  document.getElementById('p-original-price').textContent = product.originalPrice ? `R${product.originalPrice.toLocaleString()}` : '';
  document.getElementById('p-save').textContent = product.originalPrice ? `Save R${(product.originalPrice - product.price).toLocaleString()}` : '';
  document.getElementById('p-desc').textContent = product.description;
  document.getElementById('p-main-img').src = product.image;
  document.getElementById('p-rating-num').textContent = product.rating;
  document.getElementById('p-reviews-count').textContent = `(${product.reviews.toLocaleString()} reviews)`;

  // Specs
  const specsContainer = document.getElementById('p-specs-list');
  if (specsContainer) {
    specsContainer.innerHTML = product.specs.map(s => `<span class="spec-item">${s}</span>`).join('');
  }

  // Tabs content
  const specsTab = document.getElementById('tab-specs');
  if (specsTab) {
    specsTab.innerHTML = `<div class="specs-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:1rem;">
      ${product.specs.map(s => `<div style="padding:1rem; background:#f9f9f9; border-radius:0.75rem; font-weight:600; text-align:center;">${s}</div>`).join('')}
    </div>`;
  }

  const featuresTab = document.getElementById('tab-features');
  if (featuresTab && product.features) {
    featuresTab.innerHTML = `<div class="features-list">
      ${product.features.map(f => `<div class="feature-item"><span class="feature-item-icon">✓</span><span class="feature-item-text">${f}</span></div>`).join('')}
    </div>`;
  }

  const boxTab = document.getElementById('tab-box');
  if (boxTab && product.whatsInBox) {
    boxTab.innerHTML = `<div class="box-items">
      ${product.whatsInBox.map(b => `<div class="box-item">📦 ${b}</div>`).join('')}
    </div>`;
  }

  // Related products
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
    const related = storeData.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    relatedGrid.innerHTML = related.map(renderProductCard).join('');
  }

  // Quantity controls & Add to Cart
  let qty = 1;
  const qtyInput = document.getElementById('product-qty-input');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; qtyInput.value = qty; }
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    qty++; qtyInput.value = qty;
  });

  document.getElementById('product-add-to-cart-btn')?.addEventListener('click', () => {
    addToCart(product.id, qty);
  });

  // Tabs behavior
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-target'))?.classList.add('active');
    });
  });
}

function initCheckoutPage() {
  const summaryContainer = document.getElementById('checkout-summary-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalEl = document.getElementById('checkout-total');

  if (cart.length === 0) {
    window.location.href = 'shop.html';
    return;
  }

  let subtotal = 0;
  if (summaryContainer) {
    summaryContainer.innerHTML = cart.map(item => {
      subtotal += item.product.price * item.quantity;
      return `
        <div class="summary-item">
          <div class="summary-item-image"><img src="${item.product.image}" alt=""></div>
          <div class="summary-item-info">
            <div class="summary-item-name">${item.product.name}</div>
            <div class="summary-item-qty">Qty: ${item.quantity}</div>
          </div>
          <div class="summary-item-price">R${(item.product.price * item.quantity).toLocaleString()}</div>
        </div>
      `;
    }).join('');
  }

  const shipping = subtotal >= 1000 ? 0 : 99;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = `R${subtotal.toLocaleString()}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `R${shipping}`;
  if (totalEl) totalEl.textContent = `R${total.toLocaleString()}`;

  // Multi-step form flow simulation
  let currentStep = 1;
  const nextBtn = document.getElementById('checkout-next-btn');
  const backBtn = document.getElementById('checkout-back-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < 4) {
        currentStep++;
        updateCheckoutStep(currentStep);
      } else {
        // Place order simulation
        cart = [];
        updateCartCount();
        localStorage.removeItem('cell2u_cart');
        document.getElementById('checkout-form-container').innerHTML = `
          <div style="text-align:center; padding: 3rem 0;">
            <div style="width:5rem; height:5rem; background:#dcfce7; color:#16a34a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin:0 auto 1.5rem;">✓</div>
            <h2 style="font-family:var(--font-display); font-size:1.75rem; margin-bottom:0.5rem;">Order Placed Successfully!</h2>
            <p style="color:var(--text-grey); margin-bottom:1.5rem;">Thank you for your purchase. We have received your order simulation.</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
          </div>
        `;
        nextBtn.style.display = 'none';
        if (backBtn) backBtn.style.display = 'none';
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateCheckoutStep(currentStep);
      }
    });
  }

  function updateCheckoutStep(step) {
    document.querySelectorAll('.checkout-step-content').forEach((el, i) => {
      el.style.display = (i + 1 === step) ? 'block' : 'none';
    });
    if (backBtn) {
      backBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    }
    if (nextBtn) {
      nextBtn.textContent = step === 4 ? 'Place Order' : 'Continue';
    }
  }
}
