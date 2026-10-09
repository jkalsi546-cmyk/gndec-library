/**
 * ============================================================
 * MAIN.JS — Open Books (GNDEC Library)
 * ============================================================
 * Shared functionality used across all pages:
 * - Mobile navigation toggle (hamburger menu)
 * - Dark/Light mode toggle (saved to localStorage)
 * - Cart & Wishlist badge count updates
 * - Scroll-reveal animations (Intersection Observer)
 * - Toast notification system
 * - Star rating HTML generation
 * - Navbar search functionality
 * - Shared utility functions
 * ============================================================
 */

/* ========================================
 * NAVBAR — Mobile Hamburger Toggle
 * Toggles the mobile navigation menu
 * open/closed when hamburger is clicked.
 * ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ========================================
   * DARK MODE TOGGLE
   * Reads saved theme from localStorage.
   * Toggles between dark and light themes.
   * ======================================== */
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('openbooks-theme') || 'dark';

  // Apply saved theme on page load
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('openbooks-theme', newTheme);
    });
  }

  /* ========================================
   * BADGE COUNT UPDATES
   * Updates the cart and wishlist badge
   * numbers in the navbar on every page load.
   * ======================================== */
  updateBadges();

  /* ========================================
   * SCROLL-REVEAL ANIMATIONS
   * Uses Intersection Observer API to add
   * fade-in animations as elements scroll
   * into the viewport.
   * ======================================== */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  /* ========================================
   * NAVBAR SEARCH
   * Handles the search input in the navbar.
   * Redirects to books.html with search query.
   * ======================================== */
  const navSearchInput = document.querySelector('.nav-search input');
  if (navSearchInput) {
    navSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = navSearchInput.value.trim();
        if (query) {
          // Redirect to books page with search query
          window.location.href = `books.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  /* ========================================
   * ACTIVE NAV LINK
   * Highlights the current page's link in
   * the navigation menu.
   * ======================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});


/* ========================================
 * UTILITY: Generate Star Rating HTML
 * Creates filled/empty star icons based
 * on a numeric rating (0-5).
 * @param {number} rating — The rating value
 * @returns {string} — HTML string of stars
 * ======================================== */
function generateStars(rating) {
  let starsHtml = '<div class="stars">';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += '<span class="star">★</span>';
    } else if (i === fullStars + 1 && hasHalf) {
      starsHtml += '<span class="star">★</span>'; // Show full for half
    } else {
      starsHtml += '<span class="star empty">★</span>';
    }
  }

  starsHtml += '</div>';
  return starsHtml;
}


/* ========================================
 * UTILITY: Format Price
 * Formats a number as Indian Rupees (₹).
 * @param {number} price — The price value
 * @returns {string} — Formatted price string
 * ======================================== */
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}


/* ========================================
 * BACKEND SYNC FUNCTIONS
 * ======================================== */
function getToken() {
  return localStorage.getItem('openbooks_token');
}

async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = getToken();
  if (!token) return null; // Not logged in

  const headers = { 'Authorization': `Bearer ${token}` };
  if (body) headers['Content-Type'] = 'application/json';

  try {
    const res = await fetch(`/api/user/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    if (res.ok) return await res.json();
    return null;
  } catch(e) {
    console.error('API Error:', e);
    return null;
  }
}

// Global sync function called on load and after login
window.syncUserData = async function() {
  if (!getToken()) return;
  const wishlist = await apiRequest('wishlist');
  
  if (wishlist) localStorage.setItem('openbooks-wishlist-v2', JSON.stringify(wishlist));
  updateBadges();
  
  // Re-render if we are on wishlist page
  if (window.location.pathname.includes('wishlist.html') && typeof renderWishlist === 'function') renderWishlist();
};

// Auto-sync on page load
window.syncUserData();

/* ========================================
 * AUTH UI UPDATES
 * ======================================== */
function updateAuthUI() {
  const token = getToken();
  const authLinks = document.querySelectorAll('.nav-links a[href="login.html"]');
  
  authLinks.forEach(link => {
    if (token) {
      link.textContent = 'Logout';
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('openbooks_token');
        localStorage.removeItem('openbooks-wishlist-v2');
        showToast('Logged out successfully', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
      };
    } else {
      link.textContent = 'Login';
      link.href = 'login.html';
      link.onclick = null;
    }
  });
}

// Update UI on load
updateAuthUI();

/* ========================================
 * GLOBAL BOOK MAP
 * Temporarily stores book data for currently
 * displayed books so wishlist can access them.
 * ======================================== */
window.currentBooksMap = {};

/* ========================================
 * WISHLIST FUNCTIONS
 * Uses localStorage to persist wishlist.
 * Stored as an array of book Objects.
 * ======================================== */

function getWishlist() {
  return JSON.parse(localStorage.getItem('openbooks-wishlist-v2')) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('openbooks-wishlist-v2', JSON.stringify(wishlist));
  updateBadges();
}

function toggleWishlist(bookId) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex(b => b.id === bookId || b.id === String(bookId));
  const book = window.currentBooksMap[bookId] || wishlist[index];

  if (index !== -1) {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'success');
    if (getToken() && book) apiRequest('wishlist', 'POST', { book });
  } else {
    if (book) {
      wishlist.push(book);
      showToast('Added to wishlist! ❤️', 'success');
      if (getToken()) apiRequest('wishlist', 'POST', { book });
    }
  }

  saveWishlist(wishlist);
}

function isInWishlist(bookId) {
  return getWishlist().some(b => b.id === bookId || b.id === String(bookId));
}


/* ========================================
 * BADGE UPDATES
 * Updates cart and wishlist count badges
 * displayed in the navbar icons.
 * ======================================== */
function updateBadges() {
  // Update cart badge
  

  // Update wishlist badge
  const wishBadges = document.querySelectorAll('.wish-badge');
  const wishCount = getWishlist().length;
  wishBadges.forEach(badge => {
    badge.textContent = wishCount;
    badge.style.display = wishCount > 0 ? 'flex' : 'none';
  });
}


/* ========================================
 * TOAST NOTIFICATION SYSTEM
 * Shows a temporary notification message
 * at the bottom-right of the screen.
 * @param {string} message — The toast text
 * @param {string} type — 'success' or 'error'
 * ======================================== */
function showToast(message, type = 'success') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✗'}</span> ${message}`;
  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}


/* ========================================
 * UTILITY: Generate Book Card HTML
 * Creates the HTML for a single book card
 * used in grids across multiple pages.
 * @param {Object} book — The book data object
 * @returns {string} — HTML string for the card
 * ======================================== */
function generateBookCard(book) {
  // Store in global map for cart/wishlist
  window.currentBooksMap[book.id] = book;
  
  const inWishlist = isInWishlist(book.id);

  return `
    <article class="book-card reveal" data-category="${book.category}" data-price="${book.price}" data-rating="${book.rating}">
      <div class="book-card-image">
        <img src="${book.image}" alt="${book.title} by ${book.author}" loading="lazy" onerror="this.src='images/logo.jpg'">
        <span class="book-card-category">${book.category}</span>
        <button class="book-card-wishlist ${inWishlist ? 'active' : ''}" 
                onclick="toggleWishlist('${book.id}'); this.classList.toggle('active');" 
                aria-label="Toggle wishlist for ${book.title}"
                title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          ❤
        </button>
      </div>
      <div class="book-card-info">
        <h3 class="book-card-title">
          <a href="book-detail.html?id=${book.id}">${book.title}</a>
        </h3>
        <p class="book-card-author">by ${book.author}</p>
        <div class="book-card-rating">
          ${generateStars(book.rating)}
          <span class="rating-value">${book.rating}</span>
        </div>
        <div class="book-card-footer" style="justify-content: center; margin-top: 10px;">
          <a href="https://openlibrary.org/works/${book.id}" target="_blank" class="btn-primary" style="background: var(--accent); color: white; border: none; text-decoration: none; display: block; width: 100%; text-align: center; padding: 10px 0; border-radius: 4px;">
            📖 Read Online
          </a>
        </div>
      </div>
    </article>
  `;
}
