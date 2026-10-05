/**
 * ============================================================
 * HOME.JS — Open Books (GNDEC Library)
 * ============================================================
 * Fetches dynamic data from the API for homepage sections.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', async () => {

  const featuredGrid = document.getElementById('featured-books');
  const studyGrid = document.getElementById('study-books');
  const bestGrid = document.getElementById('bestseller-books');
  const newGrid = document.getElementById('new-arrivals');

  function showLoading(container) {
    if(container) container.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1/-1; padding: 40px; color: var(--text-muted);">Loading books from library database...</div>';
  }

  showLoading(featuredGrid);
  showLoading(studyGrid);
  showLoading(bestGrid);
  showLoading(newGrid);

  // Fetch data in parallel for speed
  const [featured, study, best, newArr] = await Promise.all([
    fetchBooksByCategory('fiction', 6),
    fetchBooksByCategory('engineering', 6),
    fetchBooksByCategory('bestseller', 6),
    fetchBooksByCategory('textbook', 6)
  ]);

  if (featuredGrid) {
    featuredGrid.innerHTML = featured.map(book => generateBookCard(book)).join('');
    initRevealAnimations(featuredGrid);
  }

  if (studyGrid) {
    studyGrid.innerHTML = study.map(book => generateBookCard(book)).join('');
    initRevealAnimations(studyGrid);
  }

  if (bestGrid) {
    bestGrid.innerHTML = best.map(book => generateBookCard(book)).join('');
    initRevealAnimations(bestGrid);
  }

  if (newGrid) {
    newGrid.innerHTML = newArr.map(book => generateBookCard(book)).join('');
    initRevealAnimations(newGrid);
  }
});

function initRevealAnimations(container) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
