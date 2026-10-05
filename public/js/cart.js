/**
 * ============================================================
 * CART.JS — Open Books (GNDEC Library)
 * ============================================================
 * Handles the Issue List (Cart) page (cart.html)
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function renderCart() {
  const cartContainer = document.getElementById('cart-content');
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <div class="icon">📚</div>
        <h3>Your Issue List is Empty</h3>
        <p>You haven't selected any books to issue yet.</p>
        <a href="books.html" class="btn-browse">Browse Catalog</a>
      </div>
    `;
    return;
  }

  let subtotal = 0;

  const cartItemsHtml = cart.map(item => {
    const book = item.book; // Use the embedded book object
    const itemTotal = book.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item reveal">
        <img class="cart-item-image" src="${book.image}" alt="${book.title}" onerror="this.src='images/logo.jpg'">
        <div class="cart-item-info">
          <a href="book-detail.html?id=${book.id}" class="cart-item-title">${book.title}</a>
          <div class="cart-item-author">by ${book.author}</div>
          <div class="cart-item-price">${formatPrice(book.price)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-qty">
            <button class="cart-qty-btn" onclick="updateCartQuantity('${book.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="updateCartQuantity('${book.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-remove-btn" onclick="removeFromCartPage('${book.id}')" aria-label="Remove item">Remove</button>
        </div>
        <div class="cart-item-total">${formatPrice(itemTotal)}</div>
      </div>
    `;
  }).join('');

  // Max 4 books policy
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isOverLimit = totalItems > 4;

  cartContainer.innerHTML = `
    <h2 style="margin-bottom: 24px;">Issue List</h2>
    
    ${isOverLimit ? `
      <div style="background: rgba(255, 60, 60, 0.1); border-left: 4px solid var(--danger); padding: 16px; border-radius: 4px; margin-bottom: 20px;">
        <strong>Notice:</strong> Library policy allows a maximum of 4 books to be issued at a time. Please remove ${totalItems - 4} item(s) to proceed.
      </div>
    ` : ''}

    <div class="cart-layout">
      <div class="cart-items-container">
        ${cartItemsHtml}
      </div>
      
      <div class="cart-summary reveal">
        <h3>Issue Summary</h3>
        <div class="cart-summary-row">
          <span>Total Books</span>
          <span>${totalItems}</span>
        </div>
        <div class="cart-summary-row">
          <span>Security Deposit</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="cart-summary-row">
          <span>Late Fee (per day)</span>
          <span>₹5.00</span>
        </div>
        <div class="cart-summary-row total">
          <span>Amount Payable</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 24px;" onclick="checkout()" ${isOverLimit ? 'disabled' : ''}>
          Proceed to Issue
        </button>
        <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin-top: 16px;">
          Payable amount is a refundable security deposit. It will be returned when books are surrendered.
        </p>
      </div>
    </div>
  `;
}

function updateCartQuantity(bookId, change) {
  let cart = getCart();
  const item = cart.find(i => i.book.id === bookId || i.book.id === String(bookId));
  
  if (item) {
    const newQty = item.quantity + change;
    if (newQty > 0) {
      if (newQty > 4) {
        showToast('Maximum 4 copies allowed', 'error');
      } else {
        item.quantity = newQty;
        saveCart(cart);
        renderCart();
        // Sync with backend
        if (typeof apiRequest !== 'undefined') {
          apiRequest('cart', 'POST', { book: item.book, change: change });
        }
      }
    } else {
      removeFromCartPage(bookId);
    }
  }
}

function removeFromCartPage(bookId) {
  removeFromCart(bookId); // main.js
  showToast('Book removed from list', 'success');
  renderCart();
}

async function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;
  
  const token = localStorage.getItem('openbooks_token');
  if (!token) {
    showToast('Please login first to issue books', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  
  showToast('Processing request...', 'success');
  
  // Clear on backend
  if (typeof apiRequest !== 'undefined') {
    await apiRequest('cart', 'DELETE');
  }
  
  setTimeout(() => {
    localStorage.removeItem('openbooks-cart-v2');
    updateBadges();
    
    document.getElementById('cart-content').innerHTML = `
      <div class="cart-empty reveal">
        <div class="icon">✅</div>
        <h3>Request Submitted</h3>
        <p>Your book issue request has been forwarded to the library admin.</p>
        <p style="margin-top: 10px; color: var(--text-muted);">Please visit the library counter with your student ID card within 48 hours to collect your books.</p>
        <a href="books.html" class="btn-browse" style="margin-top: 24px;">Browse More Books</a>
      </div>
    `;
  }, 1000);
}
