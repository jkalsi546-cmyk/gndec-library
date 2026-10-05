/**
 * ============================================================
 * WISHLIST.JS — Open Books (GNDEC Library)
 * ============================================================
 * Handles the Wishlist page (wishlist.html) functionality
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

function renderWishlist() {
  const wishlistContainer = document.getElementById('wishlist-content');
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🤍</div>
        <h3>Your Wishlist is Empty</h3>
        <p>Save books here that you'd like to issue later.</p>
        <a href="books.html" class="btn-browse">📚 Browse Books</a>
      </div>
    `;
    return;
  }

  const itemsHtml = wishlist.map(book => {
    // Inject the book into the current map so it can be added to cart from this page
    window.currentBooksMap[book.id] = book;

    return `
      <article class="book-card reveal" style="opacity: 1; transform: none;">
        <div class="book-card-image">
          <a href="book-detail.html?id=${book.id}">
            <img src="${book.image}" alt="${book.title} by ${book.author}" onerror="this.src='images/logo.jpg'">
          </a>
          <span class="book-card-category">${book.category}</span>
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
          <div class="book-card-footer">
            <span class="book-card-price">${formatPrice(book.price)}</span>
            <span class="book-card-copies ${book.copies === 0 ? 'unavailable' : ''}">
              ${book.copies > 0 ? book.copies + ' copies' : 'Unavailable'}
            </span>
          </div>
          <div class="wishlist-actions">
            <button class="btn-move-cart" onclick="moveToCart('${book.id}')" ${book.copies === 0 ? 'disabled' : ''}>
              Issue Book
            </button>
            <button class="btn-remove-wish" onclick="removeFromWishlistPage('${book.id}')" aria-label="Remove">
              ✕
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  wishlistContainer.innerHTML = `
    <h2 style="margin-bottom: 24px;">My Wishlist (${wishlist.length} books)</h2>
    <div class="books-grid">
      ${itemsHtml}
    </div>
  `;
}

function removeFromWishlistPage(bookId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(b => b.id !== bookId && b.id !== String(bookId));
  saveWishlist(wishlist);
  showToast('Book removed from wishlist', 'success');
  renderWishlist(); // Re-render page
}

function moveToCart(bookId) {
  addToCart(bookId); // From main.js
  removeFromWishlistPage(bookId);
}
