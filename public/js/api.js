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
 * Fetch helper with timeout to avoid hanging requests.
 */
async function fetchWithTimeout(url, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Helper to generate a consistent mock price based on the book key.
 * @param {string} key - The unique book key from the API
 */
function getMockPrice(key) {
  let hash = 0;
  const str = String(key || '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 200 + (Math.abs(hash) % 1300);
}

/**
 * Helper to generate a consistent random rating between 3.5 and 5.0
 */
function getMockRating(key) {
  let hash = 0;
  const str = String(key || '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 3) - hash);
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
  
  const book = {
    id: id,
    title: doc.title || 'Unknown Title',
    author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
    rating: getMockRating(id),
    category: doc.subject ? doc.subject[0] : defaultCategory,
    description: doc.first_sentence ? (typeof doc.first_sentence === 'string' ? doc.first_sentence : doc.first_sentence.value) : 'A fascinating book available at the GNDEC library.',
    image: doc.cover_i ? `${COVERS_BASE}/${doc.cover_i}-L.jpg` : 'images/logo.jpg',
    copies: 3 + (Math.abs(getMockPrice(id)) % 5)
  };

  // Cache preview so book detail page can render immediately upon click
  try {
    sessionStorage.setItem(`book_preview_${id}`, JSON.stringify(book));
  } catch (e) {}

  return book;
}

/**
 * Fetches books matching a search query.
 * @param {string} query - The search term
 * @param {number} limit - Number of results to return
 */
async function searchBooksAPI(query, limit = 20) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`, 6000);
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
  const cacheKey = `openbooks_cat_${category}_${limit}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  try {
    const response = await fetchWithTimeout(`${API_BASE}/search.json?subject=${encodeURIComponent(category)}&limit=${limit}`, 6000);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const books = data.docs.map(doc => formatBook(doc, category));
    
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(books));
    } catch (e) {}
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
  if (!id) return null;
  const cleanId = String(id).replace(/^\/?works\//, '').replace(/\.json$/, '');

  // 1. Check detail cache first for instant load
  const cacheKey = `openbooks_detail_${cleanId}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  // 2. Check preview cache if available
  let preview = null;
  try {
    const previewRaw = sessionStorage.getItem(`book_preview_${cleanId}`);
    if (previewRaw) preview = JSON.parse(previewRaw);
  } catch (e) {}

  try {
    // Fetch work details with timeout
    const workRes = await fetchWithTimeout(`${API_BASE}/works/${cleanId}.json`, 4500);
    if (!workRes.ok) throw new Error('Work not found');
    const workData = await workRes.json();

    const authorKey = workData.authors && workData.authors.length > 0 
      ? workData.authors[0].author.key : null;

    // Run author and editions in parallel with timeout
    const [authorName, readUrl] = await Promise.all([
      // Author name fetch
      (async () => {
        if (!authorKey) return preview ? preview.author : 'Unknown Author';
        try {
          const res = await fetchWithTimeout(`${API_BASE}${authorKey}.json`, 3000);
          if (res.ok) {
            const d = await res.json();
            return d.name || 'Unknown Author';
          }
        } catch (e) {}
        return preview ? preview.author : 'Unknown Author';
      })(),
      // Editions fetch
      (async () => {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/works/${cleanId}/editions.json?limit=5`, 3500);
          if (res.ok) {
            const data = await res.json();
            if (data.entries && data.entries.length > 0) {
              for (const ed of data.entries) {
                if (ed.ocaid) return `https://archive.org/details/${ed.ocaid}`;
              }
              return `${API_BASE}${data.entries[0].key}`;
            }
          }
        } catch (e) {}
        return `${API_BASE}/works/${cleanId}`;
      })()
    ]);
    
    let description = 'Explore this title through Open Books GNDEC Library digital collection. Read online anytime for coursework, research, or personal enrichment.';
    if (workData.description) {
      if (typeof workData.description === 'string') {
        description = workData.description;
      } else if (workData.description.value) {
        description = workData.description.value;
      }
    } else if (preview && preview.description) {
      description = preview.description;
    }
    
    const coverImage = (workData.covers && workData.covers.length > 0)
      ? `${COVERS_BASE}/${workData.covers[0]}-L.jpg`
      : (preview && preview.image ? preview.image : 'images/logo.jpg');

    const bookResult = {
      id: cleanId,
      title: workData.title || (preview ? preview.title : 'Unknown Title'),
      author: authorName,
      rating: preview ? preview.rating : getMockRating(cleanId),
      category: (workData.subjects && workData.subjects[0]) ? workData.subjects[0] : (preview ? preview.category : 'General'),
      description: description,
      image: coverImage,
      copies: 5,
      readUrl: readUrl || `${API_BASE}/works/${cleanId}`
    };

    // Cache the result
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(bookResult));
    } catch (e) {}

    return bookResult;
  } catch (error) {
    console.warn('Network detail fetch failed, checking preview fallback:', error);
    // If work API failed or timed out, fall back to preview data if available
    if (preview) {
      return {
        ...preview,
        readUrl: `https://openlibrary.org/works/${cleanId}`
      };
    }
    return null;
  }
}
