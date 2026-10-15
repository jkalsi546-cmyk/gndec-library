/**
 * ============================================================
 * BOOK-DETAIL.JS — Open Books (GNDEC Library)
 * ============================================================
 * Fetches and displays book details and student reviews.
 * ============================================================
 */

async function loadBookDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = urlParams.get('id');
  const detailContent = document.getElementById('book-detail-content');

  if (!rawId || !detailContent) {
    showError();
    return;
  }

  const bookId = String(rawId).replace(/^\/?works\//, '').replace(/\.json$/, '');

  // 1. Check if we have instant preview in sessionStorage
  let previewData = null;
  try {
    const rawPreview = sessionStorage.getItem(`book_preview_${bookId}`);
    if (rawPreview) {
      previewData = JSON.parse(rawPreview);
    }
  } catch (e) {}

  // If preview is available, render immediately so user sees NO blank screen or delay!
  if (previewData) {
    renderBook(previewData, [], true);
  } else {
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
  }

  try {
    // Fetch full book details and reviews in parallel
    const [book, reviews] = await Promise.all([
      fetchBookDetails(bookId),
      fetchReviews(bookId)
    ]);

    if (!book && !previewData) {
      showError();
      return;
    }

    const finalBook = book || {
      ...previewData,
      readUrl: `https://openlibrary.org/works/${bookId}`
    };

    renderBook(finalBook, reviews, false);
  } catch (err) {
    console.error('Error loading details:', err);
    if (!previewData) {
      showError();
    }
  }

  async function fetchReviews(id) {
    try {
      const res = await fetch(`/api/reviews/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Reviews could not be loaded:', e);
    }
    return [];
  }

  function renderBook(book, reviews = [], isPreviewOnly = false) {
    if (!window.currentBooksMap) window.currentBooksMap = {};
    window.currentBooksMap[book.id] = book;

    document.title = `${book.title} — Open Books | GNDEC Library`;
    const inWishlist = typeof isInWishlist === 'function' ? isInWishlist(book.id) : false;
    const readUrl = book.readUrl || `https://openlibrary.org/works/${book.id}`;

    detailContent.innerHTML = `
      <div class="book-detail-grid">
        <div class="book-detail-image">
          <img src="${book.image}" alt="${book.title} by ${book.author}" onerror="this.src='images/logo.jpg'">
        </div>
        <div class="book-detail-info">
          <span class="book-detail-category">${book.category || 'General'}</span>
          <h1 class="book-detail-title">${book.title}</h1>
          <p class="book-detail-author">by <span>${book.author}</span></p>
          <div class="book-detail-rating">
            ${typeof generateStars === 'function' ? generateStars(book.rating) : '⭐⭐⭐⭐'}
            <span class="rating-text">${book.rating || '4.5'} out of 5 (${reviews.length} reviews)</span>
          </div>
          <p class="book-detail-desc">${book.description || 'Digital edition available through GNDEC library catalog.'}</p>
          <div class="book-detail-actions">
            <a href="${readUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--accent); color: white; border: none; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
              📖 Read Online Free
            </a>
            <button class="btn-secondary" id="wishlist-btn" onclick="toggleDetailWishlist('${book.id}')" style="padding: 12px 20px; border-radius: 6px;">
              ${inWishlist ? '❤ In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
          <div class="reviews-section" style="margin-top: 32px;">
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
                <div class="review-card" style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                  <div class="review-header" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span class="review-name" style="font-weight: 600;">${review.userName || 'Student'}</span>
                    ${typeof generateStars === 'function' ? generateStars(review.rating) : '⭐'}
                  </div>
                  <p class="review-comment" style="margin: 0; color: var(--text-muted);">${review.comment}</p>
                </div>
              `).join('') : '<p style="color: var(--text-muted); font-size: 0.95rem;">No reviews yet. Be the first to review this book!</p>'}
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach review form listener
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('openbooks_token');
        if (!token) {
          const errBox = document.getElementById('review-error');
          if (errBox) errBox.innerText = 'Please login to post a review.';
          return;
        }

        const rating = document.getElementById('review-rating').value;
        const comment = document.getElementById('review-comment').value;

        try {
          const res = await fetch(`/api/reviews/${book.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ rating, comment })
          });

          if (res.ok) {
            window.location.reload();
          } else {
            const data = await res.json();
            const errBox = document.getElementById('review-error');
            if (errBox) errBox.innerText = data.error || 'Failed to post review.';
          }
        } catch (err) {
          const errBox = document.getElementById('review-error');
          if (errBox) errBox.innerText = 'Network error. Please try again.';
        }
      });
    }
  }

  function showError() {
    detailContent.innerHTML = `
      <div class="no-results" style="padding: 80px 20px; text-align: center;">
        <div class="icon" style="font-size: 3rem; margin-bottom: 16px;">📚</div>
        <h3>Book Not Found</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">The book you're looking for doesn't exist or could not be reached.</p>
        <a href="books.html" class="btn-browse" style="display: inline-block; padding: 10px 20px; background: var(--accent); color: white; border-radius: 6px; text-decoration: none;">Browse Catalog</a>
      </div>
    `;
  }
}

function toggleDetailWishlist(bookId) {
  if (typeof toggleWishlist === 'function') {
    toggleWishlist(bookId);
    const btn = document.getElementById('wishlist-btn');
    if (btn && typeof isInWishlist === 'function') {
      const inWishlist = isInWishlist(bookId);
      btn.innerHTML = inWishlist ? '❤ In Wishlist' : '🤍 Add to Wishlist';
    }
  }
}

// Ensure execution immediately or upon DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBookDetailPage);
} else {
  loadBookDetailPage();
}
