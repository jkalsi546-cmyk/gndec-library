/**
 * ============================================================
 * API.JS — Open Books (GNDEC Library)
 * ============================================================
 * Handles communication with the public Open Library API
 * to fetch millions of books asynchronously.
 * ============================================================
 */

const API_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b/id';

/**
 * Helper to generate a consistent mock price based on the book key.
 * @param {string} key - The unique book key from the API
 */
function getMockPrice(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 200 + (Math.abs(hash) % 1300);
}

/**
 * Helper to generate a consistent random rating between 3.5 and 5.0
 */
function getMockRating(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 3) - hash);
  }
  return (3.5 + ((Math.abs(hash) % 15) / 10)).toFixed(1);
}

/**
 * Formats a raw Open Library API doc into our standard book object.
 * @param {Object} doc - The raw API document
 * @param {string} defaultCategory - Fallback category
 */
function formatBook(doc, defaultCategory = 'General') {
  // The key usually looks like "/works/OL12345W". We just want the ID.
  const id = doc.key ? doc.key.split('/').pop() : Math.random().toString(36).substr(2, 9);
  
  return {
    id: id,
    title: doc.title || 'Unknown Title',
    author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
    
    rating: getMockRating(id),
    category: doc.subject ? doc.subject[0] : defaultCategory,
    description: doc.first_sentence ? (typeof doc.first_sentence === 'string' ? doc.first_sentence : doc.first_sentence.value) : 'A fascinating book available at the GNDEC library.',
    image: doc.cover_i ? `${COVERS_BASE}/${doc.cover_i}-L.jpg` : 'images/logo.jpg', // Fallback to logo if no cover
    copies: 3 + (Math.abs(getMockPrice(id)) % 5) // Mock 3-7 copies
  };
}

/**
 * Fetches books matching a search query.
 * @param {string} query - The search term
 * @param {number} limit - Number of results to return
 */
async function searchBooksAPI(query, limit = 20) {
  try {
    const response = await fetch(`${API_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.docs.map(doc => formatBook(doc, 'General'));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

/**
 * Fetches books by subject category.
 * @param {string} category - The subject (e.g., 'engineering', 'fiction')
 * @param {number} limit - Number of results
 */
async function fetchBooksByCategory(category, limit = 12) {
  // Use session cache so homepage loads instantly when navigating back
  const cacheKey = `openbooks_cat_${category}_${limit}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await fetch(`${API_BASE}/search.json?subject=${encodeURIComponent(category)}&limit=${limit}`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const books = data.docs.map(doc => formatBook(doc, category));
    
    // Save to cache
    sessionStorage.setItem(cacheKey, JSON.stringify(books));
    return books;
  } catch (error) {
    console.error('Error fetching category:', error);
    return [];
  }
}

/**
 * Fetches full details for a single book.
 * @param {string} id - The work ID (e.g., OL1865037W)
 */
async function fetchBookDetails(id) {
  try {
    // Fetch work details first (we need it to get author key)
    const workRes = await fetch(`${API_BASE}/works/${id}.json`);
    if (!workRes.ok) throw new Error('Work not found');
    const workData = await workRes.json();

    // Now run author + editions fetches IN PARALLEL
    const authorKey = workData.authors && workData.authors.length > 0 
      ? workData.authors[0].author.key : null;

    const [authorName, readUrl] = await Promise.all([
      // Author fetch
      (async () => {
        if (!authorKey) return 'Unknown Author';
        try {
          const res = await fetch(`${API_BASE}${authorKey}.json`);
          if (res.ok) { const d = await res.json(); return d.name; }
        } catch(e) {}
        return 'Unknown Author';
      })(),
      // Editions fetch (find readable URL)
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/works/${id}/editions.json?limit=5`);
          if (res.ok) {
            const data = await res.json();
            if (data.entries && data.entries.length > 0) {
              for (const ed of data.entries) {
                if (ed.ocaid) return `https://archive.org/details/${ed.ocaid}`;
              }
              return `${API_BASE}${data.entries[0].key}`;
            }
          }
        } catch(e) {}
        return `${API_BASE}/works/${id}`;
      })()
    ]);
    
    let description = 'No description available for this book.';
    if (workData.description) {
      description = typeof workData.description === 'string' 
        ? workData.description 
        : workData.description.value;
    }
    
    return {
      id: id,
      title: workData.title,
      author: authorName,
      rating: getMockRating(id),
      category: workData.subjects ? workData.subjects[0] : 'General',
      description: description,
      image: workData.covers && workData.covers.length > 0 
        ? `${COVERS_BASE}/${workData.covers[0]}-L.jpg` 
        : 'images/logo.jpg',
      copies: 3 + (Math.abs(getMockPrice(id)) % 5),
      readUrl: readUrl
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
}
