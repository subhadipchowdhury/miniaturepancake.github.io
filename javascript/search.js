/**
 * Site search module
 * Indexes content and provides live search functionality
 */

const SearchModule = (() => {
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  
  if (!searchContainer || !searchInput || !searchResults) return;
  
  let pages = [];
  let isSearchOpen = false;
  
  // Initialize search
  init();
  
  function init() {
    // Fetch the search index (JSON file)
    fetch("/assets/search-index.json")
      .then(response => response.json())
      .then(data => {
        pages = data;
      })
      .catch(error => console.warn("Search index not found:", error));
    
    // Event listeners
    searchInput.addEventListener("input", debounce(handleSearch, 300));
    searchInput.addEventListener("focus", () => openSearch());
    document.addEventListener("click", (e) => {
      if (!searchContainer.contains(e.target)) {
        closeSearch();
      }
    });
    
    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    });
  }
  
  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
      closeSearch();
      return;
    }
    
    openSearch();
    const results = pages.filter(page => 
      page.title.toLowerCase().includes(query) || 
      page.content.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results
    
    renderResults(results, query);
  }
  
  function renderResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
        </div>
      `;
      return;
    }
    
    const html = results.map(page => {
      const excerpt = getExcerpt(page.content, query, 100);
      return `
        <a href="${page.url}" class="search-result-item">
          <div class="search-result-title">${highlightMatches(page.title, query)}</div>
          <div class="search-result-excerpt">${excerpt}</div>
        </a>
      `;
    }).join("");
    
    searchResults.innerHTML = html;
  }
  
  function openSearch() {
    isSearchOpen = true;
    searchResults.classList.add("show");
  }
  
  function closeSearch() {
    isSearchOpen = false;
    searchInput.value = "";
    searchResults.classList.remove("show");
  }
  
  // Utility functions
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  function highlightMatches(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }
  
  function getExcerpt(text, query, length) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, start + length);
    let excerpt = text.substring(start, end);
    
    if (start > 0) excerpt = "..." + excerpt;
    if (end < text.length) excerpt = excerpt + "...";
    
    return highlightMatches(excerpt, query);
  }
  
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  
  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  
  return { init };
})();
