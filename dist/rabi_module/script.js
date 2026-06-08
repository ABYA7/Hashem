document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');
  let entries = [];

  // Cargar el JSON del diccionario
  fetch('data/rabi_dictionary.json')
    .then(response => response.json())
    .then(data => {
      entries = data;
      displayEntries(entries);
    })
    .catch(err => {
      resultsDiv.innerHTML = `<p style="color:#ff6666;">Error al cargar el diccionario: ${err}</p>`;
    });

  // Función para mostrar entradas (puede filtrar)
  function displayEntries(list) {
    resultsDiv.innerHTML = '';
    if (list.length === 0) {
      resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }
    list.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'card';

      const term = document.createElement('div');
      term.className = 'term';
      term.textContent = entry.term;

      const def = document.createElement('div');
      def.className = 'definition';
      def.textContent = entry.definition;

      const versesDiv = document.createElement('div');
      versesDiv.className = 'verses';
      if (Array.isArray(entry.verses)) {
        entry.verses.forEach(v => {
          const a = document.createElement('a');
          a.href = v.url || '#';
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = v.ref || v.id;
          versesDiv.appendChild(a);
        });
      }

      card.appendChild(term);
      card.appendChild(def);
      if (versesDiv.childElementCount > 0) card.appendChild(versesDiv);
      resultsDiv.appendChild(card);
    });
  }

  // Búsqueda reactiva
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      displayEntries(entries);
    } else {
      const filtered = entries.filter(e => e.term.toLowerCase().includes(query));
      displayEntries(filtered);
    }
  });
});
