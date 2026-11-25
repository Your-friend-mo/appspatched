// AppsPatched International Standard Fuzzy Search Engine
(function() {
  'use strict';

  function initSearch() {
    const input = document.getElementById('searchInput');
    const grid = document.getElementById('appsGrid');
    if (!input || !grid) return;

    const cards = Array.from(grid.querySelectorAll('a.group'));
    const items = cards.map(card => {
      const titleEl = card.querySelector('h3');
      const title = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
      return { card, title };
    });

    let counter = document.getElementById('searchCountBadge');
    if (!counter) {
      counter = document.createElement('div');
      counter.id = 'searchCountBadge';
      counter.className = 'text-center text-xs text-purple-300 mb-6 font-medium';
      grid.parentNode.insertBefore(counter, grid);
    }

    function levenshtein(a, b) {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }

    function isMatch(query, title) {
      if (!query) return true;
      if (title.includes(query)) return true;

      const words = title.split(/\s+/);
      for (const w of words) {
        if (w.startsWith(query)) return true;
      }

      if (query.length >= 3) {
        for (const w of words) {
          const maxDist = query.length <= 4 ? 1 : 2;
          if (levenshtein(query, w) <= maxDist) return true;
          if (w.length > query.length && levenshtein(query, w.substring(0, query.length)) <= maxDist) return true;
        }
      }

      return false;
    }

    function performSearch() {
      const q = input.value.trim().toLowerCase();
      let visibleCount = 0;

      items.forEach(item => {
        if (isMatch(q, item.title)) {
          item.card.style.display = '';
          visibleCount++;
        } else {
          item.card.style.display = 'none';
        }
      });

      if (q) {
        counter.textContent = `Showing ${visibleCount} of ${items.length} mobile games matching "${input.value.trim()}"`;
        counter.style.display = 'block';
      } else {
        counter.style.display = 'none';
      }
    }

    input.addEventListener('input', performSearch);
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        performSearch();
      }
    });

    console.log(`AppsPatched Fuzzy Search Engine initialized for ${items.length} titles.`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
