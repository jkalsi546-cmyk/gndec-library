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
        <p>Save books here that you'd like to read later.</p>
        <a href="books.html" class="btn-browse">📚 Browse Books</a>
      </div>
    `;
    return;
  }

  const itemsHtml = wishlist.map(book => {
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
          <div class="wishlist-actions" style="margin-top: 12px; display: flex; gap: 8px;">
            <a href="book-detail.html?id=${book.id}" class="btn-primary" style="flex: 1; background: var(--accent); color: white; border: none; text-decoration: none; text-align: center; padding: 10px 0; border-radius: 4px;">
              📖 Read Online
            </a>
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
  renderWishlist();
}
