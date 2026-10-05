/**
 * ============================================================
 * BOOKS.JS — Open Books (GNDEC Library)
 * ============================================================
 * Fetches search results and category lists from the API.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const booksGrid = document.getElementById('all-books');
  const searchInput = document.getElementById('books-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const resultsInfo = document.getElementById('results-info');

  let currentCategory = 'All';
  let currentSort = 'default';
  let currentSearch = '';
  let currentBooksData = [];

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    currentSearch = searchQuery;
  }

  function showLoading() {
    booksGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1/-1; padding: 60px; color: var(--text-muted); font-size: 1.1rem;">Searching library database...</div>';
  }

  async function fetchAndRenderBooks() {
    showLoading();

    try {
      if (currentSearch) {
        currentBooksData = await searchBooksAPI(currentSearch, 24);
        resultsInfo.innerHTML = `Found <span>${currentBooksData.length}</span> results for "<span>${currentSearch}</span>"`;
      } else {
        const catQuery = currentCategory === 'All' ? 'library' : currentCategory.toLowerCase();
        currentBooksData = await fetchBooksByCategory(catQuery, 24);
        resultsInfo.innerHTML = `Showing <span>${currentBooksData.length}</span> books in <span>${currentCategory}</span>`;
      }
      
      applySortAndRender();

    } catch (err) {
      booksGrid.innerHTML = `<div class="no-results" style="grid-column: 1 / -1;"><div class="icon">❌</div><h3>Error fetching books</h3><p>Please try again later.</p></div>`;
    }
  }

  function applySortAndRender() {
    let sorted = [...currentBooksData];

    switch (currentSort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    if (sorted.length === 0) {
      booksGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <div class="icon">📚</div>
          <h3>No books found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
    } else {
      booksGrid.innerHTML = sorted.map(book => generateBookCard(book)).join('');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    booksGrid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Debounce search input
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        // Reset category when searching
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns[0].classList.add('active');
        currentCategory = 'All';
        
        fetchAndRenderBooks();
      }, 500); // 500ms delay
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentCategory = btn.dataset.category;
      
      // Clear search when clicking a category
      currentSearch = '';
      if(searchInput) searchInput.value = '';

      fetchAndRenderBooks();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applySortAndRender();
    });
  }

  // Initial render
  fetchAndRenderBooks();
});
