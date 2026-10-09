/**
 * ============================================================
 * BOOK-DETAIL.JS — Open Books (GNDEC Library)
 * ============================================================
 * Fetches single book details from the API.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', async () => {

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  const detailContent = document.getElementById('book-detail-content');

  if (!bookId) {
    showError();
    return;
  }

  try {
    // Show loading skeleton
    detailContent.innerHTML = `
      <div class="book-detail-grid">
        <div class="book-detail-image" style="background: var(--bg-secondary); border-radius: 12px; min-height: 400px; animation: pulse 1.5s ease-in-out infinite;"></div>
        <div class="book-detail-info">
          <div style="background: var(--bg-secondary); height: 20px; width: 100px; border-radius: 4px; margin-bottom: 12px; animation: pulse 1.5s ease-in-out infinite;"></div>
          <div style="background: var(--bg-secondary); height: 32px; width: 80%; border-radius: 4px; margin-bottom: 8px; animation: pulse 1.5s ease-in-out infinite;"></div>
          <div style="background: var(--bg-secondary); height: 16px; width: 40%; border-radius: 4px; margin-bottom: 16px; animation: pulse 1.5s ease-in-out infinite;"></div>
          <div style="background: var(--bg-secondary); height: 14px; width: 100%; border-radius: 4px; margin-bottom: 8px; animation: pulse 1.5s ease-in-out infinite;"></div>
          <div style="background: var(--bg-secondary); height: 14px; width: 90%; border-radius: 4px; margin-bottom: 8px; animation: pulse 1.5s ease-in-out infinite;"></div>
          <div style="background: var(--bg-secondary); height: 14px; width: 70%; border-radius: 4px; margin-bottom: 24px; animation: pulse 1.5s ease-in-out infinite;"></div>
          <div style="background: var(--bg-secondary); height: 44px; width: 200px; border-radius: 8px; animation: pulse 1.5s ease-in-out infinite;"></div>
        </div>
      </div>
      <style>@keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }</style>
    `;

    // Fetch book details and reviews concurrently
    const [book, reviewsRes] = await Promise.all([
      fetchBookDetails(bookId),
      fetch(`/api/reviews/${bookId}`)
    ]);

    if (!book) {
      showError();
      return;
    }
    
    let reviews = [];
    if (reviewsRes.ok) {
      reviews = await reviewsRes.json();
    }

    // Add to global map so Add to Cart works
    window.currentBooksMap[book.id] = book;

    document.title = `${book.title} — Open Books | GNDEC Library`;
    const inWishlist = isInWishlist(book.id);

    detailContent.innerHTML = `
      <div class="book-detail-grid">
        <div class="book-detail-image">
          <img src="${book.image}" alt="${book.title} by ${book.author}" onerror="this.src='images/logo.jpg'">
        </div>
        <div class="book-detail-info">
          <span class="book-detail-category">${book.category}</span>
          <h1 class="book-detail-title">${book.title}</h1>
          <p class="book-detail-author">by <span>${book.author}</span></p>
          <div class="book-detail-rating">
            ${generateStars(book.rating)}
            <span class="rating-text">${book.rating} out of 5 (${reviews.length} reviews)</span>
          </div>
          <p class="book-detail-desc">${book.description}</p>
          <div class="book-detail-actions">
            <a href="${book.readUrl}" target="_blank" class="btn-primary" style="background: var(--accent); color: white; border: none; text-decoration: none;">
              📖 Read Online
            </a>
            <button class="btn-secondary" id="wishlist-btn" onclick="toggleDetailWishlist('${book.id}')">
              ${inWishlist ? '❤ In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
          <div class="reviews-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="margin: 0;">Student Reviews (${reviews.length})</h3>
            </div>
            
            <form id="review-form" style="margin-bottom: 24px; background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
              <h4 style="margin-bottom: 12px; font-size: 1rem;">Add a Review</h4>
              <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Rating</label>
                <select id="review-rating" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
                  <option value="5">⭐⭐⭐⭐⭐ - 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ - 4 Stars</option>
                  <option value="3">⭐⭐⭐ - 3 Stars</option>
                  <option value="2">⭐⭐ - 2 Stars</option>
                  <option value="1">⭐ - 1 Star</option>
                </select>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Comment</label>
                <textarea id="review-comment" required placeholder="What did you think about this book?" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); min-height: 80px;"></textarea>
              </div>
              <button type="submit" class="btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Post Review</button>
              <div id="review-error" style="color: var(--danger); margin-top: 8px; font-size: 0.9rem;"></div>
            </form>

            <div id="reviews-list">
              ${reviews.length > 0 ? reviews.map(review => `
                <div class="review-card">
                  <div class="review-header">
                    <span class="review-name">${review.userName}</span>
                    ${generateStars(review.rating)}
                  </div>
                  <p class="review-comment">${review.comment}</p>
                </div>
              `).join('') : '<p style="color: var(--text-muted); font-size: 0.95rem;">No reviews yet. Be the first to review this book!</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Attach review form event listener
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('openbooks_token');
      if (!token) {
        document.getElementById('review-error').innerText = 'Please login to post a review.';
        return;
      }
      
      const rating = document.getElementById('review-rating').value;
      const comment = document.getElementById('review-comment').value;
      
      try {
        const res = await fetch(`/api/reviews/${bookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${token}\`
          },
          body: JSON.stringify({ rating, comment })
        });
        
        if (res.ok) {
          window.location.reload(); // Quickest way to show the new review
        } else {
          const data = await res.json();
          document.getElementById('review-error').innerText = data.error || 'Failed to post review.';
        }
      } catch (err) {
        document.getElementById('review-error').innerText = 'Network error. Please try again.';
      }
    });
    
  } catch (error) {
    console.error(error);
    showError();
  }

  function showError() {
    detailContent.innerHTML = `
      <div class="no-results" style="padding: 80px 20px; text-align: center;">
        <div class="icon">📚</div>
        <h3>Book Not Found</h3>
        <p>The book you're looking for doesn't exist in our library database.</p>
        <a href="books.html" class="btn-browse" style="margin-top: 20px;">Browse All Books</a>
      </div>
    `;
  }
});

function toggleDetailWishlist(bookId) {
  toggleWishlist(bookId);
  const btn = document.getElementById('wishlist-btn');
  if (btn) {
    const inWishlist = isInWishlist(bookId);
    btn.innerHTML = inWishlist ? '❤ In Wishlist' : '🤍 Add to Wishlist';
  }
}
