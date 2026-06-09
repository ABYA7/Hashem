let dictionaryDB = [];
let baseDictionaryMap = {};
const DICTIONARY_STORAGE_KEY = 'hashemDictionary';
const DICTIONARY_DELETED_KEY = 'hashemDictionaryDeleted';
// DICTIONARY_API_BASE puede venir de `window.HASHEM_CONFIG.DICTIONARY_API_BASE`
// (defínela en `index.html` antes de cargar `app.js`). Por defecto vacío.
let DICTIONARY_API_BASE = '';
if (typeof window !== 'undefined' && window.HASHEM_CONFIG && window.HASHEM_CONFIG.DICTIONARY_API_BASE) {
    DICTIONARY_API_BASE = window.HASHEM_CONFIG.DICTIONARY_API_BASE;
}

const bookNames = {
    "gn": "Génesis", "ex": "Éxodo", "lv": "Levítico", "nm": "Números", "dt": "Deuteronomio",
    "js": "Josué", "jud": "Jueces", "rt": "Rut", "1sm": "1 Samuel", "2sm": "2 Samuel",
    "1kgs": "1 Reyes", "2kgs": "2 Reyes", "1ch": "1 Crónicas", "2ch": "2 Crónicas",
    "ezr": "Esdras", "ne": "Nehemías", "et": "Ester", "job": "Job", "ps": "Salmos",
    "prv": "Proverbios", "ec": "Eclesiastés", "so": "Cantares", "is": "Isaías",
    "jr": "Jeremías", "lm": "Lamentaciones", "ez": "Ezequiel", "dn": "Daniel",
    "ho": "Oseas", "jl": "Joel", "am": "Amós", "ob": "Abdías", "jn": "Jonás",
    "mi": "Miqueas", "na": "Nahúm", "hk": "Habacuc", "zp": "Sofonías", "hg": "Hageo",
    "zc": "Zacarías", "ml": "Malaquías", "mt": "Mateo", "mk": "Marcos", "lk": "Lucas",
    "jo": "Juan", "act": "Hechos", "rm": "Romanos", "1co": "1 Corintios", "2co": "2 Corintios",
    "gl": "Gálatas", "eph": "Efesios", "ph": "Filipenses", "cl": "Colosenses",
    "1ts": "1 Tesalonicenses", "2ts": "2 Tesalonicenses", "1tm": "1 Timoteo",
    "2tm": "2 Timoteo", "tt": "Tito", "phm": "Filemón", "hb": "Hebreos", "jm": "Santiago",
    "1pe": "1 Pedro", "2pe": "2 Pedro", "1jo": "1 Juan", "2jo": "2 Juan", "3jo": "3 Juan",
    "jd": "Judas", "re": "Apocalipsis"
};

let currentBibleData = [];
let currentVersion = 'rv1909';
let activeVerseId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // ── Sistema de 4 Temas ─────────────────────────────────
    const themes = ['dark', 'light', 'gray', 'blue'];
    const themeClasses = { dark: '', light: 'light-mode', gray: 'gray-mode', blue: 'blue-mode' };

    function applyTheme(theme) {
        // Quitar todas las clases de tema
        document.body.classList.remove('light-mode', 'gray-mode', 'blue-mode');
        // Añadir la clase correcta (dark no tiene clase, es el default)
        if (themeClasses[theme]) document.body.classList.add(themeClasses[theme]);
        // Actualizar punto activo
        document.querySelectorAll('.theme-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.theme === theme);
        });
        localStorage.setItem('hashemTheme', theme);
    }

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('hashemTheme') || 'dark';
    applyTheme(savedTheme);

    // Clicks en los puntos de color
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
    });


    // Inicializar Editor Avanzado y Mapas
    initStudies();
    setTimeout(() => { 
        if(typeof initMaps === 'function') initMaps(); 
        if(typeof initTimeline === 'function') initTimeline();
    }, 500);

    // Cargar Datos
    await loadBible(currentVersion);
    await loadDictionary();

    // Event listener para cambiar versión
    const versionSelect = document.getElementById('bibleVersionSelect');
    if (versionSelect) {
        versionSelect.addEventListener('change', async (e) => {
            currentVersion = e.target.value;
            await loadBible(currentVersion);
        });
    }

    // Búsqueda Global
    const globalSearch = document.getElementById('globalSearch');
    globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performGlobalSearch(e.target.value);
        }
    });

    document.getElementById('closeSearchBtn').addEventListener('click', () => {
        document.getElementById('searchResultsOverlay').style.display = 'none';
    });

    // Paleta de colores
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.verse-span') && !e.target.closest('.color-palette')) {
            document.getElementById('colorPalette').style.display = 'none';
        }
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!activeVerseId) return;
            const color = e.currentTarget.dataset.color;
            const verseEl = document.querySelector(`span[data-verse-id="${activeVerseId}"]`);
            verseEl.classList.remove('highlight-yellow', 'highlight-green', 'highlight-blue', 'highlight-pink');
            
            let highlights = JSON.parse(localStorage.getItem('hashemHighlights') || '{}');
            if (color === 'clear') {
                delete highlights[activeVerseId];
            } else {
                verseEl.classList.add(`highlight-${color}`);
                highlights[activeVerseId] = color;
            }
            
            localStorage.setItem('hashemHighlights', JSON.stringify(highlights));
            document.getElementById('colorPalette').style.display = 'none';
        });
    });
});

async function loadBible(version) {
    const bookSelect = document.getElementById('bibleBookSelect');
    const chapterSelect = document.getElementById('bibleChapterSelect');
    
    bookSelect.innerHTML = '<option value="">Cargando libros...</option>';
    bookSelect.disabled = true;
    chapterSelect.disabled = true;

    try {
        const response = await fetch(`data/${version}.json`);
        currentBibleData = await response.json();
        
        bookSelect.innerHTML = '<option value="">Seleccione un Libro</option>';
        currentBibleData.forEach((book, index) => {
            const option = document.createElement('option');
            option.value = index;
            // Fix applied: handling varying JSON formats gracefully
            option.textContent = bookNames[book.abbrev] || book.abbrev || book.name;
            bookSelect.appendChild(option);
        });
        
        bookSelect.disabled = false;

        // Always open in Genesis chapter 1 when loading the bible
        bookSelect.value = "0"; // Genesis
        bookSelect.dispatchEvent(new Event('change'));
        chapterSelect.value = "0"; // Chapter 1
        chapterSelect.dispatchEvent(new Event('change'));
        
    } catch (error) {
        console.error("Error cargando la Biblia:", error);
        bookSelect.innerHTML = '<option value="">Error al cargar</option>';
    }

    bookSelect.addEventListener('change', (e) => {
        const bookIndex = e.target.value;
        if (bookIndex === "") {
            chapterSelect.innerHTML = '<option value="">Capítulo</option>';
            chapterSelect.disabled = true;
            return;
        }

        const book = currentBibleData[bookIndex];
        chapterSelect.innerHTML = '<option value="">Capítulo</option>';
        
        book.chapters.forEach((_, chapterIndex) => {
            const option = document.createElement('option');
            option.value = chapterIndex;
            option.textContent = `Capítulo ${chapterIndex + 1}`;
            chapterSelect.appendChild(option);
        });
        
        chapterSelect.disabled = false;
    });

    chapterSelect.addEventListener('change', (e) => {
        const chapterIndex = e.target.value;
        const bookIndex = bookSelect.value;
        
        if (chapterIndex === "" || bookIndex === "") return;

        // Fix applied: fallbacks for missing abbreviations
        const bookAbbrev = currentBibleData[bookIndex].abbrev || currentBibleData[bookIndex].name || `book${bookIndex}`;
        const verses = currentBibleData[bookIndex].chapters[chapterIndex];
        const bookName = bookSelect.options[bookSelect.selectedIndex].text;
        
        localStorage.setItem('hashemLastRead', JSON.stringify({
            version: currentVersion,
            bookIndex: bookIndex,
            chapterIndex: chapterIndex
        }));

        renderChapter(bookName, parseInt(chapterIndex) + 1, verses, bookAbbrev);
    });
}

function renderChapter(bookName, chapterNum, verses, bookAbbrev) {
    const readerArea = document.getElementById('bibleReaderArea');
    
    // Controles de navegación superior
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
            <button class="nav-chapter-btn" onclick="changeChapter(-1)" style="background: none; border: none; color: var(--accent); font-size: 20px; cursor: pointer;" title="Capítulo Anterior"><i class="fas fa-chevron-left"></i></button>
            <h2 style="color: var(--accent); margin: 0;">${bookName} ${chapterNum}</h2>
            <button class="nav-chapter-btn" onclick="changeChapter(1)" style="background: none; border: none; color: var(--accent); font-size: 20px; cursor: pointer;" title="Capítulo Siguiente"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    
    const highlights = JSON.parse(localStorage.getItem('hashemHighlights') || '{}');

    // Manejo seguro por si el formato de los versículos es distinto
    let versesArray = Array.isArray(verses) ? verses : [];
    if (!Array.isArray(verses) && typeof verses === 'object') {
        versesArray = Object.values(verses);
    }

    versesArray.forEach((verseText, index) => {
        const verseNum = index + 1;
        const verseId = `${currentVersion}-${bookAbbrev}-${chapterNum}-${verseNum}`;
        const highlightColor = highlights[verseId] ? `highlight-${highlights[verseId]}` : '';

        html += `<p style="margin-bottom: 4px;">
                    <sup style="color: var(--accent); font-weight: bold; margin-right: 5px;">${verseNum}</sup>
                    <span class="verse-span ${highlightColor}" data-verse-id="${verseId}">${verseText}</span>
                 </p>`;
    });
    
    // Controles de navegación inferior
    html += `
        <div style="display: flex; justify-content: space-between; margin-top: 30px; padding-top: 15px; border-top: 1px solid var(--border-color);">
            <button class="nav-chapter-btn" onclick="changeChapter(-1)" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 15px; border-radius: 5px; cursor: pointer;"><i class="fas fa-arrow-left"></i> Anterior</button>
            <button class="nav-chapter-btn" onclick="changeChapter(1)" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 15px; border-radius: 5px; cursor: pointer;">Siguiente <i class="fas fa-arrow-right"></i></button>
        </div>
    `;

    readerArea.innerHTML = html;
    readerArea.scrollTop = 0; 

    document.querySelectorAll('.verse-span').forEach(span => {
        span.addEventListener('click', (e) => {
            activeVerseId = e.currentTarget.dataset.verseId;
            const palette = document.getElementById('colorPalette');
            const rect = e.currentTarget.getBoundingClientRect();
            const readerRect = readerArea.getBoundingClientRect();
            
            palette.style.display = 'flex';
            palette.style.top = `${e.clientY - readerRect.top + readerArea.scrollTop - 40}px`;
            palette.style.left = `${Math.min(e.clientX - readerRect.left, readerArea.offsetWidth - 150)}px`;
            
            e.stopPropagation();
        });
    });
}

// Función para cambiar de capítulo con flechas
window.changeChapter = function(delta) {
    const bookSelect = document.getElementById('bibleBookSelect');
    const chapterSelect = document.getElementById('bibleChapterSelect');
    
    if (bookSelect.value === "" || chapterSelect.value === "") return;
    
    let currentBookIndex = parseInt(bookSelect.value);
    let currentChapterIndex = parseInt(chapterSelect.value);
    
    currentChapterIndex += delta;
    
    // Verificar si sobrepasa los límites del libro actual
    const bookData = currentBibleData[currentBookIndex];
    const totalChapters = bookData.chapters.length;
    
    if (currentChapterIndex < 0) {
        // Ir al libro anterior (último capítulo)
        if (currentBookIndex > 0) {
            currentBookIndex--;
            bookSelect.value = currentBookIndex;
            bookSelect.dispatchEvent(new Event('change')); // Cargar nuevo libro en los selects
            
            const prevBookData = currentBibleData[currentBookIndex];
            chapterSelect.value = prevBookData.chapters.length - 1;
            chapterSelect.dispatchEvent(new Event('change'));
        }
    } else if (currentChapterIndex >= totalChapters) {
        // Ir al libro siguiente (primer capítulo)
        if (currentBookIndex < currentBibleData.length - 1) {
            currentBookIndex++;
            bookSelect.value = currentBookIndex;
            bookSelect.dispatchEvent(new Event('change')); // Cargar nuevo libro
            
            chapterSelect.value = 0;
            chapterSelect.dispatchEvent(new Event('change'));
        }
    } else {
        // Moverse en el mismo libro
        chapterSelect.value = currentChapterIndex;
        chapterSelect.dispatchEvent(new Event('change'));
    }
};

// Búsqueda Global
function performGlobalSearch(query) {
    const term = query.trim().toLowerCase();
    if (!term || currentBibleData.length === 0) return;

    const overlay = document.getElementById('searchResultsOverlay');
    const content = document.getElementById('searchResultsContent');
    overlay.style.display = 'flex';
    content.innerHTML = '<p>Buscando...</p>';

    setTimeout(() => {
        const results = [];
        const regex = new RegExp(`(${term})`, 'gi');

        currentBibleData.forEach((book, bookIndex) => {
            const bookName = bookNames[book.abbrev] || book.abbrev || book.name;
            book.chapters.forEach((chapter, chapterIndex) => {
                
                let versesArray = Array.isArray(chapter) ? chapter : [];
                if (!Array.isArray(chapter) && typeof chapter === 'object') {
                    versesArray = Object.values(chapter);
                }

                versesArray.forEach((verse, verseIndex) => {
                    if (verse.toLowerCase().includes(term)) {
                        const highlightedText = verse.replace(regex, '<span class="search-highlight">$1</span>');
                        
                        results.push({
                            bookIndex,
                            chapterIndex,
                            verseIndex,
                            bookName,
                            text: highlightedText
                        });
                    }
                });
            });
        });

        if (results.length === 0) {
            content.innerHTML = `<p>No se encontraron resultados para "${query}".</p>`;
            return;
        }

        let html = `<p style="margin-bottom: 15px;">Se encontraron ${results.length} resultados para "<strong>${query}</strong>":</p>`;
        
        const limit = Math.min(results.length, 100);
        for(let i=0; i<limit; i++) {
            const res = results[i];
            html += `
                <div class="search-result-item" onclick="goToSearchResult(${res.bookIndex}, ${res.chapterIndex}, ${res.verseIndex})">
                    <span class="search-result-ref">${res.bookName} ${res.chapterIndex + 1}:${res.verseIndex + 1}</span>
                    <span class="search-result-text">${res.text}</span>
                </div>
            `;
        }
        
        if (results.length > 100) {
            html += `<p style="text-align:center; color: var(--text-secondary); margin-top:10px;">Mostrando los primeros 100 resultados.</p>`;
        }

        content.innerHTML = html;
    }, 50);
}

function goToSearchResult(bookIndex, chapterIndex, verseIndex) {
    document.getElementById('searchResultsOverlay').style.display = 'none';
    showModule('bible', document.querySelector('.menu li:first-child'));
    
    const bookSelect = document.getElementById('bibleBookSelect');
    const chapterSelect = document.getElementById('bibleChapterSelect');
    
    bookSelect.value = bookIndex;
    bookSelect.dispatchEvent(new Event('change'));
    
    chapterSelect.value = chapterIndex;
    chapterSelect.dispatchEvent(new Event('change'));
    
    setTimeout(() => {
        const bookAbbrev = currentBibleData[bookIndex].abbrev || currentBibleData[bookIndex].name || `book${bookIndex}`;
        const verseId = `${currentVersion}-${bookAbbrev}-${chapterIndex + 1}-${verseIndex + 1}`;
        const verseEl = document.querySelector(`span[data-verse-id="${verseId}"]`);
        if (verseEl) {
            verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            verseEl.style.backgroundColor = 'rgba(212, 175, 55, 0.4)';
            setTimeout(() => {
                verseEl.style.backgroundColor = '';
            }, 2000);
        }
    }, 100);
}

function showModule(id, element) {
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
        if (module.id === 'ai' || module.id === 'multimedia') {
            module.style.display = 'none';
        }
    });

    document.querySelectorAll('.menu li').forEach(item => {
        item.classList.remove('active-nav');
    });

    try {
        if (typeof closeSmartPanel === 'function') {
            closeSmartPanel();
        }
    } catch (e) {
        console.error("Error closing smart panel:", e);
    }

    const targetModule = document.getElementById(id);
    if (targetModule) {
        targetModule.classList.add('active');
        if (id === 'ai' || id === 'multimedia') {
            targetModule.style.display = 'flex';
        }
    }

    if (element) {
        element.classList.add('active-nav');
    }

    if (id === 'bible') {
        const bookSelect = document.getElementById('bibleBookSelect');
        const chapterSelect = document.getElementById('bibleChapterSelect');
        if (bookSelect && chapterSelect && currentBibleData && currentBibleData.length > 0) {
            bookSelect.value = "0";
            bookSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
                chapterSelect.value = "0";
                chapterSelect.dispatchEvent(new Event('change'));
            }, 50); // slight delay to ensure book renders chapters
        }
    }
}

// ====== DICCIONARIO ENCICLOPÉDICO ======
let currentDictFilter = {
    search: '',
    category: 'all',
    letter: 'all'
};

async function loadDictionary() {
    try {
        let baseDB = [];
        // Si hay API configurada, intentar obtener desde la API
        if (DICTIONARY_API_BASE) {
            try {
                const apiRes = await fetch(`${DICTIONARY_API_BASE.replace(/\/$/, '')}/api/diccionario?limit=10000&page=1`);
                const apiJson = await apiRes.json();
                // La API del admin devuelve { total, pagina, data }
                if (Array.isArray(apiJson)) baseDB = apiJson;
                else if (apiJson && Array.isArray(apiJson.data)) baseDB = apiJson.data;
                else baseDB = [];
            } catch (e) {
                console.warn('No se pudo cargar diccionario desde API, usando archivo local:', e);
                const response = await fetch('data/diccionario.json');
                baseDB = await response.json();
            }
        } else {
            const response = await fetch('data/diccionario.json');
            baseDB = await response.json();
        }

        baseDictionaryMap = {};
        baseDB.forEach(item => {
            baseDictionaryMap[item.termino] = item;
        });

        // Cargar artículos guardados por el admin (IndexedDB/localStorage)
        const savedItems = await loadSavedDictionaryItems();
        const deleted = await loadDeletedDictionaryTerms();

        const deletedSet = new Set(deleted);
        const mergedMap = {};

        baseDB.forEach(item => {
            if (!deletedSet.has(item.termino)) {
                mergedMap[item.termino] = item;
            }
        });

        Object.keys(savedItems).forEach(term => {
            mergedMap[term] = savedItems[term];
            deletedSet.delete(term);
        });

        dictionaryDB = Object.values(mergedMap);

        // Inicializar alfabeto
        initDictionaryAlphabet();

        // Renderizar lista completa inicialmente
        filterDictionary();

        // Event Listeners
        document.getElementById('dictionarySearch').addEventListener('input', (e) => {
            currentDictFilter.search = e.target.value.trim().toLowerCase();
            currentDictFilter.letter = 'all'; // Resetear letra al buscar
            filterDictionary();
        });

        document.getElementById('dictionaryCategory').addEventListener('change', (e) => {
            currentDictFilter.category = e.target.value;
            filterDictionary();
        });

    } catch (error) {
        console.error("Error cargando diccionario:", error);
    }
}

function loadSavedDictionaryItems() {
    try {
        const saved = localStorage.getItem(DICTIONARY_STORAGE_KEY);
        if (!saved) return {};

        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            const savedMap = {};
            parsed.forEach(item => {
                if (item && item.termino) savedMap[item.termino] = item;
            });
            localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(savedMap));
            return savedMap;
        }

        if (parsed && typeof parsed === 'object') {
            return parsed;
        }

        return {};
    } catch (e) {
        console.error(`Error cargando ${DICTIONARY_STORAGE_KEY}:`, e);
        return {};
    }
}

function saveSavedDictionaryItems(itemsMap) {
    try {
        localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(itemsMap));
    } catch (e) {
        console.error('Error guardando items del diccionario:', e);
    }
}

function loadDeletedDictionaryTerms() {
    try {
        const deleted = localStorage.getItem(DICTIONARY_DELETED_KEY);
        return deleted ? JSON.parse(deleted) : [];
    } catch (e) {
        console.error(`Error cargando ${DICTIONARY_DELETED_KEY}:`, e);
        return [];
    }
}

function saveDeletedDictionaryTerms(terms) {
    try {
        localStorage.setItem(DICTIONARY_DELETED_KEY, JSON.stringify(terms));
    } catch (e) {
        console.error('Error guardando deleted terms:', e);
    }
}

function addDeletedDictionaryTerm(term) {
    const deleted = loadDeletedDictionaryTerms();
    if (!deleted.includes(term)) {
        deleted.push(term);
        saveDeletedDictionaryTerms(deleted);
    }
}

function removeDeletedDictionaryTerm(term) {
    const deleted = loadDeletedDictionaryTerms().filter(t => t !== term);
    saveDeletedDictionaryTerms(deleted);
}

function initDictionaryAlphabet() {
    const alphabetDiv = document.getElementById('dictionaryAlphabet');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    let html = `<button class="dict-letter-btn active" data-letter="all" style="padding: 5px 10px; border: 1px solid var(--border-color); background: var(--accent); color: #000; border-radius: 3px; cursor: pointer;">Todos</button>`;
    
    letters.forEach(letter => {
        html += `<button class="dict-letter-btn" data-letter="${letter}" style="padding: 5px 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); border-radius: 3px; cursor: pointer;">${letter}</button>`;
    });

    alphabetDiv.innerHTML = html;

    // Add events
    document.querySelectorAll('.dict-letter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.dict-letter-btn').forEach(b => {
                b.style.background = 'var(--bg-tertiary)';
                b.style.color = 'var(--text-primary)';
            });
            e.target.style.background = 'var(--accent)';
            e.target.style.color = '#000';
            
            currentDictFilter.letter = e.target.dataset.letter;
            // Limpiar búsqueda por texto al usar filtro de letra
            document.getElementById('dictionarySearch').value = '';
            currentDictFilter.search = '';
            filterDictionary();
        });
    });
}

function filterDictionary() {
    if (!Array.isArray(dictionaryDB)) return;

    const filtered = dictionaryDB.filter(item => {
        // Normalizar texto para búsqueda
        const termNorm = item.termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const searchNorm = currentDictFilter.search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const matchSearch = termNorm.includes(searchNorm) || (item.definicion && item.definicion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchNorm));
        const matchCategory = currentDictFilter.category === 'all' || item.categoria === currentDictFilter.category;
        
        let matchLetter = true;
        if (currentDictFilter.letter !== 'all') {
            matchLetter = termNorm.startsWith(currentDictFilter.letter.toLowerCase());
        }

        return matchSearch && matchCategory && matchLetter;
    });

    // Ordenar alfabéticamente
    filtered.sort((a, b) => a.termino.localeCompare(b.termino));

    renderDictionaryList(filtered);
}

function renderDictionaryList(items) {
    const listDiv = document.getElementById('dictionaryTermsList');
    
    if (items.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-secondary);">No se encontraron términos que coincidan con los filtros.</p>';
        return;
    }

    let html = '';
    items.forEach((item, index) => {
        // Encontrar índice real en la BD para referenciar
        const realIndex = dictionaryDB.findIndex(dbItem => dbItem.termino === item.termino);
        
        html += `
            <div class="dict-list-item" onclick="showDictionaryArticle(${realIndex}, this)" style="padding: 15px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.3s;">
                <h3 style="margin: 0 0 5px 0; color: var(--accent); font-size: 16px;">${item.termino}</h3>
                <span style="font-size: 12px; color: #fff; background: #333; padding: 2px 8px; border-radius: 12px;">${item.categoria}</span>
            </div>
        `;
    });

    listDiv.innerHTML = html;
}

window.showDictionaryArticle = function(index, clickedItem) {
    const articleDiv = document.getElementById('dictionaryArticle');
    const item = dictionaryDB[index];
    
    if (!item) return;

    // Resaltar en la lista
    document.querySelectorAll('.dict-list-item').forEach(el => el.style.background = 'transparent');
    if (clickedItem) clickedItem.style.background = 'rgba(212, 175, 55, 0.1)';

    let refsHtml = '';
    if (item.referencias && item.referencias.length > 0) {
        refsHtml = `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed var(--border-color);">
                <h4 style="color: var(--accent); margin-bottom: 10px;">Referencias Bíblicas:</h4>
                <ul style="list-style-type: none; padding: 0;">
                    ${item.referencias.map(ref => `<li style="margin-bottom: 5px;"><i class="fas fa-bookmark" style="color: var(--accent); margin-right: 8px;"></i> <a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}" target="_blank" style="color: var(--accent); text-decoration: underline;">${ref}</a></li>`).join('')}
                </ul>
            </div>
        `;
    }

    let adminButtons = '';
    if (isAdminMode) {
        adminButtons = `
            <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 10px;">
                <button onclick="openDictAdminModal(${index})" style="background: #f39c12; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;"><i class="fas fa-pen"></i></button>
                <button onclick="deleteDictArticle(${index})" style="background: #e74c3c; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }

    // Formatear la definición reduciendo saltos excesivos y usando párrafos compactos
    const defHtml = item.definicion ? item.definicion
        .split(/\n{2,}/) // separar por doble salto en párrafos
        .map(p => `<p style="margin:0 0 8px; line-height:1.45;">${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('') : '';

    const html = `
        ${adminButtons}
        <h1 style="color: var(--accent); margin-bottom: 5px; font-size: 32px;">${item.termino}</h1>
        <div style="display: flex; gap: 10px; margin-bottom: 25px;">
            <span style="font-size: 13px; color: #000; background: var(--accent); padding: 4px 10px; border-radius: 15px; font-weight: bold;"><i class="fas fa-folder"></i> ${item.categoria}</span>
            ${item.fuente ? `<span style="font-size: 13px; color: #fff; background: #555; padding: 4px 10px; border-radius: 15px;"><i class="fas fa-scroll"></i> ${item.fuente}</span>` : ''}
        </div>

        <div style="font-size: 16px; color: var(--text-primary);">
            ${defHtml}
        </div>
        
        ${item.nombre_hebreo ? `<h3 style="color: var(--accent); margin-top:20px;">Nombre en hebreo</h3><p>${item.nombre_hebreo}</p>` : ''}
        ${item.pronunciacion ? `<h3 style="color: var(--accent);">Pronunciación</h3><p>${item.pronunciacion}</p>` : ''}
        ${item.significado ? `<h3 style="color: var(--accent);">Significado</h3><p>${item.significado}</p>` : ''}
        ${item.etimologia ? `<h3 style="color: var(--accent);">Etimología</h3><p>${item.etimologia}</p>` : ''}
        ${item.primera_aparicion ? `<h3 style="color: var(--accent);">Primera aparición bíblica</h3><p>${item.primera_aparicion}</p>` : ''}
        ${item.historia ? `<h3 style="color: var(--accent);">Historia completa</h3><p>${item.historia}</p>` : ''}
        ${item.arbol_genealogico ? `<h3 style="color: var(--accent);">Árbol genealógico</h3><p>${item.arbol_genealogico}</p>` : ''}
        ${item.linea_cronologica ? `<h3 style="color: var(--accent);">Línea cronológica</h3><p>${item.linea_cronologica}</p>` : ''}
        ${item.comentarios_rab ? `<h3 style="color: var(--accent);">Comentarios rabínicos</h3><p>${item.comentarios_rab}</p>` : ''}
        ${item.datos_arqueologicos ? `<h3 style="color: var(--accent);">Datos arqueológicos</h3><p>${item.datos_arqueologicos}</p>` : ''}
        ${item.mapas ? `<h3 style="color: var(--accent);">Mapas relacionados</h3><p>${item.mapas}</p>` : ''}
        ${item.imagenes ? `<h3 style="color: var(--accent);">Imágenes ilustrativas</h3><p>${item.imagenes}</p>` : ''}
        ${item.curiosidades ? `<h3 style="color: var(--accent);">Curiosidades</h3><p>${item.curiosidades}</p>` : ''}
        ${item.aplicacion_espiritual ? `<h3 style="color: var(--accent);">Aplicación espiritual</h3><p>${item.aplicacion_espiritual}</p>` : ''}
        ${refsHtml}
    `;

    articleDiv.innerHTML = html;
    articleDiv.scrollTop = 0;
};

// ====== MODO ADMIN (OCULTO) ======
let isAdminMode = false;

document.getElementById('globalSearch').addEventListener('input', (e) => {
    if (e.target.value === 'adminhashem') {
        unlockAdminMode();
        e.target.value = '';
    }
});

function unlockAdminMode() {
    isAdminMode = true;
    document.getElementById('adminDictControls').style.display = 'flex';
    alert("MODO ADMINISTRADOR DESBLOQUEADO");
    filterDictionary(); // Re-render to show edit buttons if an article is open
}

window.lockAdminMode = function() {
    isAdminMode = false;
    document.getElementById('adminDictControls').style.display = 'none';
    alert("Modo Administrador Bloqueado");
    document.getElementById('dictionaryArticle').innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); margin-top: 50px;">
            <i class="fas fa-book-reader" style="font-size: 48px; margin-bottom: 15px; color: var(--accent);"></i>
            <p>Seleccione un término de la lista para leer el artículo enciclopédico.</p>
        </div>
    `;
    filterDictionary();
};

window.openDictAdminModal = function(index = -1) {
    const modal = document.getElementById('dictAdminModal');
    const title = document.getElementById('dictAdminTitle');
    
    if (index >= 0) {
        const item = dictionaryDB[index];
        title.textContent = "Editar Artículo";
        document.getElementById('dictAdminIndex').value = index;
        document.getElementById('dictAdminTermino').value = item.termino || '';
        document.getElementById('dictAdminCategoria').value = item.categoria || '';
        document.getElementById('dictAdminFuente').value = item.fuente || '';
        document.getElementById('dictAdminDefinicion').value = item.definicion || '';
        document.getElementById('dictAdminReferencias').value = item.referencias ? item.referencias.join(', ') : '';
        // New fields
        document.getElementById('dictAdminNombreHebreo').value = item.nombre_hebreo || '';
        document.getElementById('dictAdminPronunciacion').value = item.pronunciacion || '';
        document.getElementById('dictAdminSignificado').value = item.significado || '';
        document.getElementById('dictAdminEtimologia').value = item.etimologia || '';
        document.getElementById('dictAdminPrimeraAparicion').value = item.primera_aparicion || '';
        document.getElementById('dictAdminHistoria').value = item.historia || '';
        document.getElementById('dictAdminArbolGenealogico').value = item.arbol_genealogico || '';
        document.getElementById('dictAdminLineaCronologica').value = item.linea_cronologica || '';
        document.getElementById('dictAdminComentariosRabinicos').value = item.comentarios_rab || '';
        document.getElementById('dictAdminDatosArqueologicos').value = item.datos_arqueologicos || '';
        document.getElementById('dictAdminMapas').value = item.mapas || '';
        document.getElementById('dictAdminImagenes').value = item.imagenes || '';
        document.getElementById('dictAdminCuriosidades').value = item.curiosidades || '';
        document.getElementById('dictAdminAplicacionEspiritual').value = item.aplicacion_espiritual || '';
    } else {
        title.textContent = "Nuevo Artículo";
        document.getElementById('dictAdminIndex').value = "-1";
        document.getElementById('dictAdminTermino').value = "";
        document.getElementById('dictAdminCategoria').value = "";
        document.getElementById('dictAdminFuente').value = "";
        document.getElementById('dictAdminDefinicion').value = "";
        document.getElementById('dictAdminReferencias').value = "";
        // Reset new fields
        document.getElementById('dictAdminNombreHebreo').value = "";
        document.getElementById('dictAdminPronunciacion').value = "";
        document.getElementById('dictAdminSignificado').value = "";
        document.getElementById('dictAdminEtimologia').value = "";
        document.getElementById('dictAdminPrimeraAparicion').value = "";
        document.getElementById('dictAdminHistoria').value = "";
        document.getElementById('dictAdminArbolGenealogico').value = "";
        document.getElementById('dictAdminLineaCronologica').value = "";
        document.getElementById('dictAdminComentariosRabinicos').value = "";
        document.getElementById('dictAdminDatosArqueologicos').value = "";
        document.getElementById('dictAdminMapas').value = "";
        document.getElementById('dictAdminImagenes').value = "";
        document.getElementById('dictAdminCuriosidades').value = "";
        document.getElementById('dictAdminAplicacionEspiritual').value = "";
    }
    
    modal.style.display = 'flex';
};

window.saveDictArticle = async function() {
    const index = parseInt(document.getElementById('dictAdminIndex').value);
    const refsRaw = document.getElementById('dictAdminReferencias').value;
    const oldTerm = index >= 0 && dictionaryDB[index] ? dictionaryDB[index].termino : null;

    // Recoger campos adicionales
    const nombreHebreo = document.getElementById('dictAdminNombreHebreo').value.trim();
    const pronunciacion = document.getElementById('dictAdminPronunciacion').value.trim();
    const significado = document.getElementById('dictAdminSignificado').value.trim();
    const etimologia = document.getElementById('dictAdminEtimologia').value.trim();
    const primeraAparicion = document.getElementById('dictAdminPrimeraAparicion').value.trim();
    const historia = document.getElementById('dictAdminHistoria').value.trim();
    const arbolGenealogico = document.getElementById('dictAdminArbolGenealogico').value.trim();
    const lineaCronologica = document.getElementById('dictAdminLineaCronologica').value.trim();
    const comentariosRabinicos = document.getElementById('dictAdminComentariosRabinicos').value.trim();
    const datosArqueologicos = document.getElementById('dictAdminDatosArqueologicos').value.trim();
    const mapas = document.getElementById('dictAdminMapas').value.trim();
    const imagenes = document.getElementById('dictAdminImagenes').value.trim();
    const curiosidades = document.getElementById('dictAdminCuriosidades').value.trim();
    const aplicacionEspiritual = document.getElementById('dictAdminAplicacionEspiritual').value.trim();

    const newItem = {
        termino: document.getElementById('dictAdminTermino').value.trim(),
        categoria: document.getElementById('dictAdminCategoria').value.trim(),
        fuente: document.getElementById('dictAdminFuente').value.trim(),
        definicion: document.getElementById('dictAdminDefinicion').value.trim(),
        referencias: refsRaw ? refsRaw.split(',').map(r => r.trim()).filter(r => r) : [],
        nombre_hebreo: nombreHebreo,
        pronunciacion: pronunciacion,
        significado: significado,
        etimologia: etimologia,
        primera_aparicion: primeraAparicion,
        historia: historia,
        arbol_genealogico: arbolGenealogico,
        linea_cronologica: lineaCronologica,
        comentarios_rab: comentariosRabinicos,
        datos_arqueologicos: datosArqueologicos,
        mapas: mapas,
        imagenes: imagenes,
        curiosidades: curiosidades,
        aplicacion_espiritual: aplicacionEspiritual
    };
    
    if (!newItem.termino || !newItem.definicion) {
        alert("El término y la definición son obligatorios.");
        return;
    }

    const savedItems = await loadSavedDictionaryItems();

    // Si hay backend configurado, intentar sincronizar con la API
    if (DICTIONARY_API_BASE) {
        try {
            // Si el artículo ya tiene un id en la DB local, usar PUT
            const existing = index >= 0 ? dictionaryDB[index] : null;
            if (existing && existing.id) {
                const res = await fetch(`${DICTIONARY_API_BASE.replace(/\/$/, '')}/api/diccionario/${existing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
                const updated = await res.json();
                // Actualizar referencias locales con el id retornado
                newItem.id = updated.id || existing.id;
            } else {
                // Crear nuevo en servidor (POST)
                const res = await fetch(`${DICTIONARY_API_BASE.replace(/\/$/, '')}/api/diccionario`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
                const created = await res.json();
                if (created && created.id) newItem.id = created.id;
            }
        } catch (e) {
            console.warn('Error sincronizando con la API del diccionario:', e);
            alert('Advertencia: no se pudo sincronizar con el servidor. Se guardará localmente.');
        }
    }

    if (index >= 0) {
        if (oldTerm && oldTerm !== newItem.termino) {
            delete savedItems[oldTerm];
            await addDeletedDictionaryTerm(oldTerm);
        }
        savedItems[newItem.termino] = newItem;
        dictionaryDB[index] = newItem;
    } else {
        await removeDeletedDictionaryTerm(newItem.termino);
        savedItems[newItem.termino] = newItem;
        dictionaryDB.push(newItem);
    }

    await saveSavedDictionaryItems(savedItems);

    document.getElementById('dictAdminModal').style.display = 'none';
    filterDictionary();
    if (index >= 0) showDictionaryArticle(index);
    alert("✅ Artículo guardado correctamente. Aparecerá siempre que abras la aplicación.");
};

window.deleteDictArticle = async function(index) {
    if (confirm("¿Estás seguro de que deseas borrar este artículo?")) {
        const item = dictionaryDB[index];
        if (!item) return;

        const deletedTerm = item.termino;

        // Si hay API y el artículo tiene id, intentar borrar en servidor
        if (DICTIONARY_API_BASE && item.id) {
            try {
                await fetch(`${DICTIONARY_API_BASE.replace(/\/$/, '')}/api/diccionario/${item.id}`, { method: 'DELETE' });
            } catch (e) {
                console.warn('No se pudo borrar en el servidor:', e);
                alert('Advertencia: no se pudo borrar en el servidor. Se eliminará localmente.');
            }
        }

        dictionaryDB.splice(index, 1);

        const savedItems = await loadSavedDictionaryItems();
        delete savedItems[deletedTerm];
        await saveSavedDictionaryItems(savedItems);

        if (baseDictionaryMap[deletedTerm]) {
            await addDeletedDictionaryTerm(deletedTerm);
        } else {
            await removeDeletedDictionaryTerm(deletedTerm);
        }
        document.getElementById('dictionaryArticle').innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); margin-top: 50px;">
                <i class="fas fa-book-reader" style="font-size: 48px; margin-bottom: 15px; color: var(--accent);"></i>
                <p>Seleccione un término de la lista para leer el artículo enciclopédico.</p>
            </div>
        `;
        filterDictionary();
    }
};

window.downloadDictJson = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dictionaryDB, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "diccionario.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

// ==========================================
// LÓGICA DEL EDITOR DE ESTUDIOS AVANZADO
// ==========================================

let hashemStudies = [];
let currentStudyIndex = -1;

const DOC_TYPES = {
    'nota': { icon: '📝', label: 'Nota' },
    'sermon': { icon: '✝️', label: 'Sermón' },
    'bosquejo': { icon: '📋', label: 'Bosquejo' },
    'comentario': { icon: '💬', label: 'Comentario' },
    'cuaderno': { icon: '📚', label: 'Cuaderno Temático' }
};

window.initStudies = function() {
    const savedStudies = localStorage.getItem('hashemStudies');
    if (savedStudies) {
        hashemStudies = JSON.parse(savedStudies);
    } else {
        // Migrar el contenido viejo si existe
        const oldContent = localStorage.getItem('hashemEditorContent');
        if (oldContent) {
            hashemStudies.push({
                type: 'nota',
                title: "Estudio Recuperado",
                date: new Date().toLocaleDateString(),
                content: oldContent,
                versions: []
            });
            localStorage.removeItem('hashemEditorContent');
        }
    }
    
    // Asegurar que todos tengan tipo y versiones
    hashemStudies.forEach(s => {
        if (!s.type) s.type = 'nota';
        if (!s.versions) s.versions = [];
    });

    renderStudiesList();
    if (hashemStudies.length > 0) {
        openStudy(0);
    }

    // Eventos para Estadísticas y Diccionario
    const editor = document.getElementById('studyEditor');
    editor.addEventListener('input', () => {
        updateStats();
        debouncedDictionaryCheck();
    });
};

window.renderStudiesList = function(filterText = '') {
    const list = document.getElementById('studiesList');
    list.innerHTML = '';
    
    hashemStudies.forEach((study, index) => {
        if (filterText && !study.title.toLowerCase().includes(filterText.toLowerCase())) return;

        const div = document.createElement('div');
        div.className = `study-item ${index === currentStudyIndex ? 'active' : ''}`;
        div.onclick = () => openStudy(index);
        
        const typeInfo = DOC_TYPES[study.type] || DOC_TYPES['nota'];
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span title="${typeInfo.label}">${typeInfo.icon}</span>
                <div style="flex: 1; overflow: hidden;">
                    <div class="study-item-title" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${study.title || 'Sin título'}</div>
                    <div class="study-item-date">${study.date}</div>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
};

window.filterDocuments = function() {
    const term = document.getElementById('documentSearch').value;
    renderStudiesList(term);
};

window.openNewDocumentModal = function() {
    document.getElementById('newDocTitle').value = '';
    document.getElementById('newDocumentModal').classList.add('active');
};

window.closeNewDocumentModal = function() {
    document.getElementById('newDocumentModal').classList.remove('active');
};

window.createNewStudy = function() {
    const title = document.getElementById('newDocTitle').value.trim() || 'Nuevo Estudio';
    const type = document.getElementById('newDocType').value || 'nota';
    
    const newStudy = {
        type: type,
        title: title,
        date: new Date().toLocaleDateString(),
        content: "<p><br></p>",
        versions: []
    };
    
    hashemStudies.unshift(newStudy);
    currentStudyIndex = 0;
    saveStudiesToLocal();
    closeNewDocumentModal();
    renderStudiesList();
    openStudy(0);
};

window.openStudy = function(index) {
    currentStudyIndex = index;
    const study = hashemStudies[index];
    
    document.getElementById('studyTitle').value = study.title;
    document.getElementById('studyEditor').innerHTML = study.content || '<p><br></p>';
    
    const typeInfo = DOC_TYPES[study.type] || DOC_TYPES['nota'];
    document.getElementById('currentDocTypeIcon').innerText = typeInfo.icon;
    document.getElementById('currentDocTypeIcon').title = typeInfo.label;
    
    updateVersionSelect();
    updateStats();
    renderStudiesList();
};

window.saveCurrentStudy = function(isManual = false) {
    if (currentStudyIndex >= 0 && currentStudyIndex < hashemStudies.length) {
        const study = hashemStudies[currentStudyIndex];
        const newTitle = document.getElementById('studyTitle').value || 'Sin título';
        const newContent = document.getElementById('studyEditor').innerHTML;
        
        // Solo guardar si hay cambios reales
        if (study.title !== newTitle || study.content !== newContent) {
            
            // Si es un guardado manual, creamos una versión
            if (isManual) {
                const verDate = new Date().toLocaleString();
                study.versions.unshift({
                    date: verDate,
                    content: study.content,
                    title: study.title
                });
                // Mantener máx 10 versiones
                if (study.versions.length > 10) study.versions.pop();
            }

            study.title = newTitle;
            study.content = newContent;
            study.date = new Date().toLocaleDateString();
            
            saveStudiesToLocal();
            renderStudiesList();
            updateVersionSelect();

            // Feedback visual
            const status = document.getElementById('saveStatus');
            status.innerHTML = '<i class="fas fa-check-double" style="color:#27ae60"></i> Guardado';
            setTimeout(() => {
                status.innerHTML = '<i class="fas fa-cloud-check"></i> Guardado';
            }, 2000);
        }
    }
};

window.updateVersionSelect = function() {
    const select = document.getElementById('versionSelect');
    if (currentStudyIndex < 0) {
        select.style.display = 'none';
        return;
    }
    
    const study = hashemStudies[currentStudyIndex];
    if (!study.versions || study.versions.length === 0) {
        select.style.display = 'none';
        return;
    }
    
    select.style.display = 'inline-block';
    select.innerHTML = '<option value="">Restaurar Versión...</option>';
    
    study.versions.forEach((ver, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = ver.date;
        select.appendChild(opt);
    });
};

window.restoreVersion = function(verIndex) {
    if (verIndex === "") return;
    if (confirm("¿Seguro que deseas restaurar esta versión? Los cambios no guardados se perderán.")) {
        const study = hashemStudies[currentStudyIndex];
        const version = study.versions[verIndex];
        
        // Guardar estado actual como otra versión antes de restaurar
        study.versions.unshift({
            date: new Date().toLocaleString() + " (Auto antes de rest.)",
            content: study.content,
            title: study.title
        });
        
        study.title = version.title;
        study.content = version.content;
        
        document.getElementById('studyTitle').value = study.title;
        document.getElementById('studyEditor').innerHTML = study.content;
        document.getElementById('versionSelect').value = "";
        
        saveCurrentStudy(false);
        updateStats();
        alert("Versión restaurada.");
    }
};

window.deleteCurrentStudy = function() {
    if (currentStudyIndex >= 0 && currentStudyIndex < hashemStudies.length) {
        if(confirm("¿Estás seguro de que deseas eliminar este documento?")) {
            hashemStudies.splice(currentStudyIndex, 1);
            saveStudiesToLocal();
            currentStudyIndex = hashemStudies.length > 0 ? 0 : -1;
            
            if (currentStudyIndex >= 0) {
                openStudy(0);
            } else {
                document.getElementById('studyTitle').value = "";
                document.getElementById('studyEditor').innerHTML = "<p><br></p>";
                renderStudiesList();
                document.getElementById('saveStatus').innerText = '';
                document.getElementById('versionSelect').style.display = 'none';
            }
        }
    }
};

window.saveStudiesToLocal = function() {
    localStorage.setItem('hashemStudies', JSON.stringify(hashemStudies));
};

// Formato de Texto Enriquecido
window.formatText = function(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('studyEditor').focus();
    updateStats();
};

window.insertLink = function() {
    const url = prompt("Introduce la URL del enlace:", "https://");
    if (url) {
        document.execCommand("createLink", false, url);
        // Opcional: hacer que se abra en nueva pestaña (requiere procesar el HTML)
    }
};

window.insertImagePrompt = function() {
    const url = prompt("Introduce la URL de la imagen:");
    if (url) {
        document.execCommand("insertImage", false, url);
    }
};

window.insertTablePrompt = function() {
    const rows = prompt("Número de filas:", "3");
    const cols = prompt("Número de columnas:", "3");
    
    if (rows && cols && !isNaN(rows) && !isNaN(cols)) {
        let tableHTML = '<table style="width:100%; border-collapse: collapse; margin-bottom: 15px;" border="1">';
        for (let i = 0; i < rows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHTML += '<td style="padding: 8px; border: 1px solid var(--border-color); min-width: 50px;">Celda</td>';
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table><p><br></p>';
        document.execCommand("insertHTML", false, tableHTML);
    }
};

window.updateStats = function() {
    const text = document.getElementById('studyEditor').innerText || "";
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    document.getElementById('charCount').innerText = `${charCount} caracteres`;
    document.getElementById('wordCount').innerText = `${wordCount} palabras`;
};

// Auto-guardado cada 20 segundos
setInterval(() => {
    saveCurrentStudy(false);
}, 20000);

// ==========================================
// INTEGRACIÓN INTELIGENTE (DICCIONARIO RABÍ)
// ==========================================
let dictionaryTimeout;

function debouncedDictionaryCheck() {
    clearTimeout(dictionaryTimeout);
    dictionaryTimeout = setTimeout(checkDictionaryTerms, 800);
}

function checkDictionaryTerms() {
    if (!dictionaryDB || dictionaryDB.length === 0) return;
    
    const editor = document.getElementById('studyEditor');
    const text = editor.innerText.toLowerCase();
    
    // Obtener la palabra en la que está el cursor si es posible
    const selection = window.getSelection();
    let currentWord = "";
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const textContent = range.startContainer.textContent;
            const offset = range.startOffset;
            // Buscar la palabra alrededor del cursor
            const before = textContent.slice(0, offset).match(/[\wáéíóúüñ]+$/);
            const after = textContent.slice(offset).match(/^[\wáéíóúüñ]+/);
            currentWord = ((before ? before[0] : "") + (after ? after[0] : "")).toLowerCase();
        }
    }
    
    let matchedArticles = [];
    
    // Si tenemos una palabra en el cursor, priorizarla
    if (currentWord.length > 3) {
        const exactMatch = dictionaryDB.find(a => a.termino.toLowerCase() === currentWord);
        if (exactMatch) matchedArticles.push(exactMatch);
    }
    
    // Si no hay match exacto en cursor, buscar otras menciones recientes o la última palabra
    if (matchedArticles.length === 0) {
        // Encontrar las últimas 20 palabras del editor para no escanear todo siempre
        const words = text.split(/\s+/).filter(w => w.length > 3).slice(-20);
        
        for (const word of words) {
            // Limpiar puntuación
            const cleanWord = word.replace(/[^\wáéíóúüñ]/g, '');
            const match = dictionaryDB.find(a => a.termino.toLowerCase() === cleanWord);
            if (match && !matchedArticles.includes(match)) {
                matchedArticles.push(match);
                break; // Solo mostrar uno a la vez para no saturar
            }
        }
    }
    
    if (matchedArticles.length > 0) {
        showSmartPanel(matchedArticles[0]);
    } else {
        // No cerrar automáticamente para que el usuario pueda leer si estaba abierto
        // closeSmartPanel(); 
    }
}

window.showSmartPanel = function(article) {
    const panel = document.getElementById('smartPanel');
    const content = document.getElementById('smartPanelContent');
    
    let html = `
        <h3 style="color: var(--accent); margin-bottom: 10px; font-family: var(--font-serif); font-size: 1.5em;">${article.termino}</h3>
    `;
    
    if (article.nombre_hebreo) {
        html += `<div style="font-size: 1.4em; text-align: right; margin-bottom: 10px;">${article.nombre_hebreo}</div>`;
    }
    
    html += `
        <div style="font-size: 0.9em; margin-bottom: 15px; color: var(--text-secondary);">
            <span style="background: var(--bg-hover); padding: 2px 6px; border-radius: 4px;">${article.categoria}</span>
        </div>
        <p style="font-size: 0.95em; line-height: 1.5; margin-bottom: 15px;">${article.definicion}</p>
    `;
    
    if (article.referencias && article.referencias.length > 0) {
        html += `<h4 style="color: var(--accent); margin-bottom: 5px;">Referencias Bíblicas</h4>
                 <ul style="padding-left: 20px; font-size: 0.9em; margin-bottom: 15px; color: var(--text-secondary);">`;
        article.referencias.forEach(ref => {
            html += `<li><a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}" target="_blank" rel="noopener">${ref}</a></li>`;
        });
        html += `</ul>`;
    }
    
    html += `
        <button onclick="insertDictQuote('${article.termino}')" style="width: 100%; background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 8px; border-radius: 5px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='var(--accent)'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='var(--accent)';">
            <i class="fas fa-quote-left"></i> Insertar Cita
        </button>
    `;
    
    content.innerHTML = html;
    panel.style.display = 'flex';
};

window.closeSmartPanel = function() {
    document.getElementById('smartPanel').style.display = 'none';
};

window.insertDictQuote = function(termino) {
    const article = dictionaryDB.find(a => a.termino === termino);
    if (!article) return;
    
    const quoteHTML = `
        <blockquote style="border-left: 4px solid var(--accent); padding-left: 15px; margin: 15px 0; background: var(--bg-hover); padding: 10px; border-radius: 0 8px 8px 0;">
            <strong>${article.termino}</strong> ${article.nombre_hebreo ? '('+article.nombre_hebreo+')' : ''}: 
            <em>"${article.definicion}"</em> 
            <br><small style="color: var(--text-secondary);">- Diccionario Rabí</small>
        </blockquote><p><br></p>
    `;
    
    document.getElementById('studyEditor').focus();
    document.execCommand("insertHTML", false, quoteHTML);
};

// Exportar e Importar
window.exportStudies = function() {
    saveCurrentStudy(true);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hashemStudies, null, 2));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", "mis_estudios_hashem.json");
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
};

window.importStudies = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                if (confirm("¿Deseas reemplazar tus estudios actuales o combinarlos? (Aceptar = Combinar, Cancelar = Reemplazar)")) {
                    hashemStudies = hashemStudies.concat(imported);
                } else {
                    hashemStudies = imported;
                }
                saveStudiesToLocal();
                renderStudiesList();
                openStudy(0);
                alert("Estudios importados correctamente.");
            } else {
                alert("El archivo no tiene el formato correcto.");
            }
        } catch(err) {
            alert("Error al leer el archivo: " + err);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
};

// ==========================================
// MÓDULO 4: MAPAS INTERACTIVOS (LEAFLET)
// ==========================================

let mapInstance = null;
let currentMapMarkers = [];
let currentMapData = null;

window.initMaps = function() {
    if (!document.getElementById('leafletMap')) return;
    
    // Generar la lista de mapas en la interfaz
    const mapsListDiv = document.getElementById('mapsList');
    if (mapsListDiv && typeof mapsDB !== 'undefined') {
        mapsListDiv.innerHTML = '';
        Object.keys(mapsDB).forEach(key => {
            const map = mapsDB[key];
            const div = document.createElement('div');
            div.className = 'study-item';
            div.innerHTML = `<div class="study-item-title" style="color: ${map.color || 'var(--accent)'}; border-left: 4px solid ${map.color || 'transparent'}; padding-left: 8px;"><i class="fas fa-map"></i> ${map.title}</div>`;
            div.onclick = () => loadMap(key);
            mapsListDiv.appendChild(div);
        });
        
        // Cargar el primer mapa por defecto si Leaflet está listo
        if (typeof L !== 'undefined') {
            loadMap(Object.keys(mapsDB)[0]);
        }
    }
};

window.loadMap = function(mapId) {
    if (typeof L === 'undefined' || typeof mapsDB === 'undefined') return;
    
    const mapData = mapsDB[mapId];
    if (!mapData) return;
    
    currentMapData = mapData;
    document.getElementById('currentMapTitle').innerText = mapData.title;
    
    // Destruir mapa anterior si existe
    if (mapInstance !== null) {
        mapInstance.remove();
        mapInstance = null;
    }
    
    // Crear el mapa Leaflet con CRS simple (coordenadas planas)
    mapInstance = L.map('leafletMap', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 3
    });
    
    const bounds = mapData.bounds; // ej: [[0,0], [1000,1000]]
    
    // Añadir imagen de fondo
    L.imageOverlay(mapData.image, bounds).addTo(mapInstance);
    
    // Ajustar la vista
    mapInstance.fitBounds(bounds);
    
    // Configurar el slider
    setupTimelineSlider(mapData);
    
    // Dibujar marcadores iniciales (todos)
    drawMapMarkers(100); // 100% = mostrar todos
};

function setupTimelineSlider(mapData) {
    if (!mapData.markers || mapData.markers.length === 0) return;
    
    // Ordenar marcadores cronológicamente
    mapData.markers.sort((a, b) => a.year - b.year);
    
    const startYear = mapData.markers[0].year;
    const endYear = mapData.markers[mapData.markers.length - 1].year;
    
    document.getElementById('timelineStart').innerText = formatYear(startYear);
    document.getElementById('timelineEnd').innerText = formatYear(endYear);
    
    const slider = document.getElementById('timelineSlider');
    slider.value = 100;
    
    document.getElementById('timelineCurrent').innerText = formatYear(endYear);
}

window.filterMapMarkers = function(sliderValue) {
    if (!currentMapData || !currentMapData.markers) return;
    
    // sliderValue va de 0 a 100.
    const startYear = currentMapData.markers[0].year;
    const endYear = currentMapData.markers[currentMapData.markers.length - 1].year;
    
    const currentYear = startYear + ((endYear - startYear) * (sliderValue / 100));
    document.getElementById('timelineCurrent').innerText = formatYear(Math.round(currentYear));
    
    drawMapMarkers(sliderValue);
};

function drawMapMarkers(sliderPercentage) {
    // Limpiar marcadores anteriores
    currentMapMarkers.forEach(m => mapInstance.removeLayer(m));
    currentMapMarkers = [];
    
    if (!currentMapData || !currentMapData.markers) return;
    
    // Calcular hasta qué marcador mostrar según el slider
    const totalMarkers = currentMapData.markers.length;
    let markersToShow = Math.ceil((sliderPercentage / 100) * totalMarkers);
    if (markersToShow === 0 && sliderPercentage > 0) markersToShow = 1;
    
    // Trazar línea de ruta
    const latlngs = [];
    
    for (let i = 0; i < markersToShow; i++) {
        const markerData = currentMapData.markers[i];
        if (!markerData) continue;
        
        latlngs.push(markerData.coords);
        
        // Crear icono personalizado simple
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background: ${currentMapData.color || 'var(--accent)'}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 6px rgba(0,0,0,0.8);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [7.5, 7.5]
        });
        
        const marker = L.marker(markerData.coords, {icon: customIcon}).addTo(mapInstance);
        
        // Popup
        let popupHtml = `
            <div style="font-family: var(--font-sans); color: #333;">
                <h3 style="margin: 0 0 5px 0; color: #2c3e50;">${markerData.title}</h3>
                <span style="font-size: 11px; background: #eee; padding: 2px 5px; border-radius: 3px;">${formatYear(markerData.year)}</span>
                ${markerData.ref ? `<div style="font-size: 12px; color: var(--accent); font-weight: bold; margin-top: 5px;"><i class="fas fa-bible"></i> ${markerData.ref}</div>` : ''}
                <p style="font-size: 13px; line-height: 1.4; margin: 10px 0;">${markerData.desc}</p>
        `;
        if (markerData.image) {
            popupHtml += `<img src="${markerData.image}" style="width: 100%; border-radius: 5px; margin-top: 5px;">`;
        }
        popupHtml += `</div>`;
        
        marker.bindPopup(popupHtml);
        currentMapMarkers.push(marker);
    }
    
    // Dibujar ruta conectando puntos
    if (latlngs.length > 1) {
        const polyline = L.polyline(latlngs, {color: currentMapData.color || 'red', weight: 4, dashArray: '5, 10'}).addTo(mapInstance);
        currentMapMarkers.push(polyline);
    }
}

function formatYear(year) {
    if (year < 0) return Math.abs(year) + ' a.C.';
    return year + ' d.C.';
}
// ==========================================
// MÓDULO 5: CRONOLOGÍA INTERACTIVA
// ==========================================

window.initTimeline = function() {
    if (!document.getElementById('timelineContainer') || typeof timelineDB === 'undefined') return;
    
    // Ordenar de más antiguo a más reciente
    timelineDB.sort((a, b) => a.year - b.year);
    
    renderTimeline('all');
};

window.renderTimeline = function(filterCategory) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let isLeft = true;
    
    timelineDB.forEach(event => {
        if (filterCategory !== 'all' && event.category !== filterCategory) return;
        
        const card = document.createElement('div');
        card.className = `timeline-card-container ${isLeft ? 'left' : 'right'} cat-${event.category}`;
        
        let icon = '<i class="fas fa-calendar-day"></i>';
        if(event.category === 'rey') icon = '<i class="fas fa-crown"></i>';
        if(event.category === 'profeta') icon = '<i class="fas fa-scroll"></i>';
        if(event.category === 'imperio') icon = '<i class="fas fa-landmark"></i>';
        
        card.innerHTML = `
            <div class="timeline-card">
                <h3>
                    <span>${icon} ${event.title}</span>
                    <span class="timeline-year">${event.yearLabel}</span>
                </h3>
                <p class="timeline-desc">${event.desc}</p>
                ${event.ref ? `<div class="timeline-ref"><i class="fas fa-book"></i> ${event.ref}</div>` : ''}
                ${event.sync ? `<div class="timeline-sync"><i class="fas fa-globe"></i> ${event.sync}</div>` : ''}
            </div>
        `;
        
        container.appendChild(card);
        isLeft = !isLeft; // Alternar lado
    });
};

window.filterTimeline = function(category) {
    // Actualizar botones
    document.querySelectorAll('.timeline-filters .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Renderizar
    renderTimeline(category);
};
// ==========================================
// MÓDULO 6: HASHEM AI (CEREBRO SIMULADO)
// ==========================================

window.insertAiPrompt = function(promptText) {
    const input = document.getElementById('aiInput');
    if (input) {
        input.value = promptText;
        input.focus();
    }
};

window.handleAiKeyPress = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
    }
};

window.sendAiMessage = function() {
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendAiMessage(text, 'user');

    // Simular el retraso de "Pensando..."
    const typingId = showAiTyping();
    
    setTimeout(() => {
        removeAiTyping(typingId);
        const response = generateAiResponse(text);
        appendAiMessage(response, 'ai-system');
    }, 1500 + Math.random() * 1000); // 1.5 a 2.5 segundos de "pensamiento"
};

function appendAiMessage(htmlContent, senderClass) {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${senderClass}`;
    
    let icon = senderClass === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    // Si el contenido es del usuario, escapar HTML. Si es de la IA, permitir HTML.
    let finalContent = htmlContent;
    if (senderClass === 'user') {
        finalContent = `<p>${escapeHtml(htmlContent)}</p>`;
    }

    msgDiv.innerHTML = `
        <div class="ai-avatar">${icon}</div>
        <div class="ai-bubble">
            ${finalContent}
        </div>
    `;

    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showAiTyping() {
    const chatHistory = document.getElementById('aiChatHistory');
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = `ai-message ai-system`;
    typingDiv.innerHTML = `
        <div class="ai-avatar"><i class="fas fa-robot"></i></div>
        <div class="ai-bubble">
            <div class="ai-typing">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatHistory.appendChild(typingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return id;
}

function removeAiTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// LÓGICA DEL CEREBRO DE HASHEM AI
function generateAiResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("sermón") || lowerPrompt.includes("bosquejo")) {
        return `
            <p><strong>📝 Bosquejo de Sermón Generado: La Fe que Vence (Hebreos 11)</strong></p>
            <p><strong>Introducción:</strong><br>
            La fe no es solo creer que Dios existe, es actuar con la certeza de que Él cumplirá sus promesas, incluso cuando no vemos la salida (Hebreos 11:1).</p>
            <p><strong>Puntos Principales:</strong></p>
            <ol>
                <li><strong>La fe nos justifica:</strong> Como Abel, quien ofreció un sacrificio excelente motivado por la fe (Hebreos 11:4).</li>
                <li><strong>La fe camina con Dios:</strong> Como Enoc, quien agradó a Dios en medio de una generación perversa (Hebreos 11:5).</li>
                <li><strong>La fe obedece lo ilógico:</strong> Como Noé, quien construyó un arca cuando nunca había llovido, confiando en la advertencia divina (Hebreos 11:7).</li>
                <li><strong>La fe sacrifica lo más preciado:</strong> Como Abraham, quien estuvo dispuesto a ofrecer a Isaac, sabiendo que Dios es poderoso para resucitar (Hebreos 11:17-19).</li>
            </ol>
            <p><strong>Conclusión:</strong><br>
            La fe verdadera no evita los problemas, pero nos da la victoria sobre ellos. ¿Estamos caminando por vista o por fe?</p>
        `;
    }

    if (lowerPrompt.includes("hebreo") || lowerPrompt.includes("jessed") || lowerPrompt.includes("hesed")) {
        return `
            <p><strong>📚 Análisis de Palabra Hebrea: חֶסֶד (Hesed)</strong></p>
            <p>La palabra hebrea <em>Hesed</em> (Strong H2617) es uno de los términos teológicos más ricos del Antiguo Testamento. Es difícil traducirla con una sola palabra en español.</p>
            <ul>
                <li><strong>Significado literal:</strong> Bondad, misericordia, amor leal, piedad.</li>
                <li><strong>Uso en el Tanaj:</strong> Aparece más de 240 veces. Se usa frecuentemente para describir el compromiso inquebrantable de Dios con su pacto.</li>
                <li><strong>Diferencia con el amor común:</strong> A diferencia del amor emocional, <em>Hesed</em> siempre está ligado a una acción fiel basada en un pacto. Es una bondad que no se merece pero que se da porque quien la otorga ha prometido ser fiel.</li>
            </ul>
            <p><strong>Cita clave:</strong> "El Señor, el Señor, Dios clemente y compasivo, lento para la ira y grande en amor (<em>Hesed</em>) y fidelidad" (Éxodo 34:6).</p>
        `;
    }

    if (lowerPrompt.includes("profecía") || lowerPrompt.includes("isaías") || lowerPrompt.includes("mesías")) {
        return `
            <p><strong>📜 Profecías y Cumplimiento: El Siervo Sufriente (Isaías 53)</strong></p>
            <p>El capítulo 53 de Isaías es conocido como el "Santo de los Santos" del Antiguo Testamento. Escrito unos 700 años antes de Cristo, describe con asombrosa precisión el ministerio, muerte y exaltación del Mesías.</p>
            <ul>
                <li><strong>Profecía:</strong> Fue despreciado y desechado (Is 53:3).<br>
                <strong>Cumplimiento:</strong> Juan 1:11 ("A lo suyo vino, y los suyos no le recibieron").</li>
                <li><strong>Profecía:</strong> Guardó silencio ante sus acusadores (Is 53:7).<br>
                <strong>Cumplimiento:</strong> Mateo 27:12-14 (Jesús no respondió a Pilato).</li>
                <li><strong>Profecía:</strong> Traspasado por nuestras rebeliones (Is 53:5).<br>
                <strong>Cumplimiento:</strong> Juan 19:34 (El costado traspasado por la lanza romana).</li>
                <li><strong>Profecía:</strong> Asignado con los impíos y enterrado con el rico (Is 53:9).<br>
                <strong>Cumplimiento:</strong> Mateo 27:38, 57-60 (Crucificado entre ladrones, enterrado en la tumba de José de Arimatea).</li>
            </ul>
        `;
    }

    if (lowerPrompt.includes("cronología") || lowerPrompt.includes("tiempo") || lowerPrompt.includes("moisés")) {
        return `
            <p><strong>⏳ Línea de Tiempo: La vida de Moisés (120 años)</strong></p>
            <p>La vida de Moisés se divide clásicamente en tres períodos de 40 años (Hechos 7):</p>
            <ul>
                <li><strong>Primeros 40 años (El Príncipe):</strong> Moisés nace, es salvado de las aguas y educado en toda la sabiduría de Egipto como hijo de la hija de Faraón (Hechos 7:22-23). Termina con su huida tras matar a un egipcio.</li>
                <li><strong>Segundos 40 años (El Pastor):</strong> Moisés huye a Madián. Se casa con Séfora, tiene hijos y pastorea ovejas en el desierto. Dios está quebrando su orgullo egipcio. Termina con la aparición de la zarza ardiente en Horeb (Éxodo 3).</li>
                <li><strong>Últimos 40 años (El Libertador):</strong> Moisés regresa a Egipto, enfrenta a Faraón (Las 10 plagas), lidera el Éxodo, recibe la Ley en el Sinaí y guía a Israel por el desierto. Muere a los 120 años en el Monte Nebo, con sus ojos nunca oscurecidos y su vigor intacto (Deuteronomio 34:7).</li>
            </ul>
        `;
    }
    timelineDB.forEach(event => {
        if (filterCategory !== 'all' && event.category !== filterCategory) return;
        
        const card = document.createElement('div');
        card.className = `timeline-card-container ${isLeft ? 'left' : 'right'} cat-${event.category}`;
        
        let icon = '<i class="fas fa-calendar-day"></i>';
        if(event.category === 'rey') icon = '<i class="fas fa-crown"></i>';
        if(event.category === 'profeta') icon = '<i class="fas fa-scroll"></i>';
        if(event.category === 'imperio') icon = '<i class="fas fa-landmark"></i>';
        
        card.innerHTML = `
            <div class="timeline-card">
                <h3>
                    <span>${icon} ${event.title}</span>
                    <span class="timeline-year">${event.yearLabel}</span>
                </h3>
                <p class="timeline-desc">${event.desc}</p>
                ${event.sync ? `<div class="timeline-sync"><i class="fas fa-globe"></i> ${event.sync}</div>` : ''}
            </div>
        `;
        
        container.appendChild(card);
        isLeft = !isLeft; // Alternar lado
    });
};

window.filterTimeline = function(category) {
    // Actualizar botones
    document.querySelectorAll('.timeline-filters .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Renderizar
    renderTimeline(category);
};
// ==========================================
// MÓDULO 6: HASHEM AI (CEREBRO SIMULADO)
// ==========================================

window.insertAiPrompt = function(promptText) {
    const input = document.getElementById('aiInput');
    if (input) {
        input.value = promptText;
        input.focus();
    }
};

window.handleAiKeyPress = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
    }
};

window.sendAiMessage = function() {
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendAiMessage(text, 'user');

    // Simular el retraso de "Pensando..."
    const typingId = showAiTyping();
    
    setTimeout(() => {
        removeAiTyping(typingId);
        const response = generateAiResponse(text);
        appendAiMessage(response, 'ai-system');
    }, 1500 + Math.random() * 1000); // 1.5 a 2.5 segundos de "pensamiento"
};

function appendAiMessage(htmlContent, senderClass) {
    const chatHistory = document.getElementById('aiChatHistory');
    if (!chatHistory) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${senderClass}`;
    
    let icon = senderClass === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    // Si el contenido es del usuario, escapar HTML. Si es de la IA, permitir HTML.
    let finalContent = htmlContent;
    if (senderClass === 'user') {
        finalContent = `<p>${escapeHtml(htmlContent)}</p>`;
    }

    msgDiv.innerHTML = `
        <div class="ai-avatar">${icon}</div>
        <div class="ai-bubble">
            ${finalContent}
        </div>
    `;

    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showAiTyping() {
    const chatHistory = document.getElementById('aiChatHistory');
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = `ai-message ai-system`;
    typingDiv.innerHTML = `
        <div class="ai-avatar"><i class="fas fa-robot"></i></div>
        <div class="ai-bubble">
            <div class="ai-typing">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatHistory.appendChild(typingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return id;
}

function removeAiTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// LÓGICA DEL CEREBRO DE HASHEM AI
function generateAiResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("sermón") || lowerPrompt.includes("bosquejo")) {
        return `
            <p><strong>📝 Bosquejo de Sermón Generado: La Fe que Vence (Hebreos 11)</strong></p>
            <p><strong>Introducción:</strong><br>
            La fe no es solo creer que Dios existe, es actuar con la certeza de que Él cumplirá sus promesas, incluso cuando no vemos la salida (Hebreos 11:1).</p>
            <p><strong>Puntos Principales:</strong></p>
            <ol>
                <li><strong>La fe nos justifica:</strong> Como Abel, quien ofreció un sacrificio excelente motivado por la fe (Hebreos 11:4).</li>
                <li><strong>La fe camina con Dios:</strong> Como Enoc, quien agradó a Dios en medio de una generación perversa (Hebreos 11:5).</li>
                <li><strong>La fe obedece lo ilógico:</strong> Como Noé, quien construyó un arca cuando nunca había llovido, confiando en la advertencia divina (Hebreos 11:7).</li>
                <li><strong>La fe sacrifica lo más preciado:</strong> Como Abraham, quien estuvo dispuesto a ofrecer a Isaac, sabiendo que Dios es poderoso para resucitar (Hebreos 11:17-19).</li>
            </ol>
            <p><strong>Conclusión:</strong><br>
            La fe verdadera no evita los problemas, pero nos da la victoria sobre ellos. ¿Estamos caminando por vista o por fe?</p>
        `;
    }

    if (lowerPrompt.includes("hebreo") || lowerPrompt.includes("jessed") || lowerPrompt.includes("hesed")) {
        return `
            <p><strong>📚 Análisis de Palabra Hebrea: חֶסֶד (Hesed)</strong></p>
            <p>La palabra hebrea <em>Hesed</em> (Strong H2617) es uno de los términos teológicos más ricos del Antiguo Testamento. Es difícil traducirla con una sola palabra en español.</p>
            <ul>
                <li><strong>Significado literal:</strong> Bondad, misericordia, amor leal, piedad.</li>
                <li><strong>Uso en el Tanaj:</strong> Aparece más de 240 veces. Se usa frecuentemente para describir el compromiso inquebrantable de Dios con su pacto.</li>
                <li><strong>Diferencia con el amor común:</strong> A diferencia del amor emocional, <em>Hesed</em> siempre está ligado a una acción fiel basada en un pacto. Es una bondad que no se merece pero que se da porque quien la otorga ha prometido ser fiel.</li>
            </ul>
            <p><strong>Cita clave:</strong> "El Señor, el Señor, Dios clemente y compasivo, lento para la ira y grande en amor (<em>Hesed</em>) y fidelidad" (Éxodo 34:6).</p>
        `;
    }

    if (lowerPrompt.includes("profecía") || lowerPrompt.includes("isaías") || lowerPrompt.includes("mesías")) {
        return `
            <p><strong>📜 Profecías y Cumplimiento: El Siervo Sufriente (Isaías 53)</strong></p>
            <p>El capítulo 53 de Isaías es conocido como el "Santo de los Santos" del Antiguo Testamento. Escrito unos 700 años antes de Cristo, describe con asombrosa precisión el ministerio, muerte y exaltación del Mesías.</p>
            <ul>
                <li><strong>Profecía:</strong> Fue despreciado y desechado (Is 53:3).<br>
                <strong>Cumplimiento:</strong> Juan 1:11 ("A lo suyo vino, y los suyos no le recibieron").</li>
                <li><strong>Profecía:</strong> Guardó silencio ante sus acusadores (Is 53:7).<br>
                <strong>Cumplimiento:</strong> Mateo 27:12-14 (Jesús no respondió a Pilato).</li>
                <li><strong>Profecía:</strong> Traspasado por nuestras rebeliones (Is 53:5).<br>
                <strong>Cumplimiento:</strong> Juan 19:34 (El costado traspasado por la lanza romana).</li>
                <li><strong>Profecía:</strong> Asignado con los impíos y enterrado con el rico (Is 53:9).<br>
                <strong>Cumplimiento:</strong> Mateo 27:38, 57-60 (Crucificado entre ladrones, enterrado en la tumba de José de Arimatea).</li>
            </ul>
        `;
    }

    if (lowerPrompt.includes("cronología") || lowerPrompt.includes("tiempo") || lowerPrompt.includes("moisés")) {
        return `
            <p><strong>⏳ Línea de Tiempo: La vida de Moisés (120 años)</strong></p>
            <p>La vida de Moisés se divide clásicamente en tres períodos de 40 años (Hechos 7):</p>
            <ul>
                <li><strong>Primeros 40 años (El Príncipe):</strong> Moisés nace, es salvado de las aguas y educado en toda la sabiduría de Egipto como hijo de la hija de Faraón (Hechos 7:22-23). Termina con su huida tras matar a un egipcio.</li>
                <li><strong>Segundos 40 años (El Pastor):</strong> Moisés huye a Madián. Se casa con Séfora, tiene hijos y pastorea ovejas en el desierto. Dios está quebrando su orgullo egipcio. Termina con la aparición de la zarza ardiente en Horeb (Éxodo 3).</li>
                <li><strong>Últimos 40 años (El Libertador):</strong> Moisés regresa a Egipto, enfrenta a Faraón (Las 10 plagas), lidera el Éxodo, recibe la Ley en el Sinaí y guía a Israel por el desierto. Muere a los 120 años en el Monte Nebo, con sus ojos nunca oscurecidos y su vigor intacto (Deuteronomio 34:7).</li>
            </ul>
        `;
    }

    if (lowerPrompt.includes("hola") || lowerPrompt.includes("saludo") || lowerPrompt.includes("shalom")) {
        return `<p>¡Shalom! Bendiciones. ¿En qué tema bíblico, palabra original o estudio puedo asistirte el día de hoy?</p>`;
    }

    // Respuesta por defecto si no coincide ninguna regla
    return `
        <p>Esa es una excelente pregunta bíblica.</p>
        <p>Como HASHEM AI se encuentra en su fase Beta dentro de esta demostración, mis respuestas están programadas para escenarios específicos como:</p>
        <ul>
            <li>Explicar palabras hebreas (ej: "Jessed").</li>
            <li>Generar sermones (ej: "Sermón sobre la fe").</li>
            <li>Relacionar profecías (ej: "Profecías de Isaías 53").</li>
            <li>Mostrar líneas de tiempo (ej: "Cronología de Moisés").</li>
        </ul>
        <p>Por favor, intenta usar alguna de esas sugerencias, o haz clic en los botones del panel izquierdo.</p>
    `;
}

// ====== SISTEMA MULTIMEDIA ======
let currentMultimediaCategory = 'imagenes';

window.renderMultimediaCategory = function(category, element) {
    currentMultimediaCategory = category;
    
    // Update active nav state
    const items = document.querySelectorAll('#multimedia .study-item');
    items.forEach(item => item.classList.remove('active-media-cat'));
    
    if (element) {
        element.classList.add('active-media-cat');
    } else {
        // If element not provided (e.g. on load), find the right one
        const allItems = Array.from(items);
        const activeItem = allItems.find(i => i.getAttribute('onclick').includes(category));
        if (activeItem) activeItem.classList.add('active-media-cat');
    }

    const grid = document.getElementById('mediaGrid');
    const title = document.getElementById('mediaTitle');
    grid.innerHTML = '';

    // Load default and custom data
    let data = multimediaDB[category] || [];
    const customData = JSON.parse(localStorage.getItem('customMultimedia') || '{}');
    if (customData[category]) {
        data = data.concat(customData[category]);
    }

    // Update title
    const titles = {
        'imagenes': 'Imágenes Bíblicas',
        'ilustraciones': 'Ilustraciones',
        'videos': 'Videos',
        'audio_biblias': 'Audio Biblias',
        'pronunciacion_hebrea': 'Pronunciación Hebrea',
        'pronunciacion_griega': 'Pronunciación Griega'
    };
    title.innerText = titles[category] || 'Multimedia';

    if (!data || data.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No hay elementos en esta categoría.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        if (category === 'imagenes' || category === 'ilustraciones') {
            card.innerHTML = `
                <img src="${item.url}" alt="${item.title}" class="media-img" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkVycm9yIGNhcmdhbmRvIGltYWdlbjwvdGV4dD48L3N2Zz4='"/>
                <div class="media-info">
                    <div class="media-title">${item.title}</div>
                    <div class="media-desc">${item.desc}</div>
                </div>
            `;
            card.onclick = () => window.open(item.url, '_blank');
        } else if (category === 'videos') {
            card.innerHTML = `
                <a href="${item.url}" target="_blank" rel="noopener">
                    <video controls width="100%" poster="${item.poster || ''}" class="media-img" style="background:#000;">
                        <source src="${item.url}" type="video/mp4">
                    </video>
                </a>
                <div class="media-info">
                    <div class="media-title">${item.title}</div>
                    <div class="media-desc">${item.desc}</div>
                </div>
            `;
        } else {
            // Audios
            card.innerHTML = `
                <div class="media-info">
                    <div class="media-title"><i class="fas ${category.includes('pronunciacion') ? 'fa-volume-up' : 'fa-headphones'}"></i> ${item.title}</div>
                    <div class="media-desc">${item.desc}</div>
                    <div class="audio-player-container">
                        <audio controls style="width: 100%; height: 30px;">
                            <source src="${item.url}" type="audio/mpeg">
                        </audio>
                    </div>
                </div>
            `;
        }
        
        grid.appendChild(card);
    });
};

window.abrirModalMultimedia = function() {
    document.getElementById('modalMultimedia').style.display = 'flex';
    document.getElementById('addMediaTitle').value = '';
    document.getElementById('addMediaDesc').value = '';
    document.getElementById('addMediaUrl').value = '';
    document.getElementById('addMediaCat').value = currentMultimediaCategory;
};

window.cerrarModalMultimedia = function() {
    document.getElementById('modalMultimedia').style.display = 'none';
};

window.guardarMultimedia = function() {
    const title = document.getElementById('addMediaTitle').value.trim();
    const desc = document.getElementById('addMediaDesc').value.trim();
    const urlField = document.getElementById('addMediaUrl').value.trim();
    const fileInput = document.getElementById('addMediaFile');
    const cat = document.getElementById('addMediaCat').value;

    if (!title) {
        alert("Por favor ingresa un título.");
        return;
    }

    // Helper to actually save after we have the final URL (either from file or external URL)
    const saveItem = (finalUrl) => {
        if (!finalUrl) {
            alert("No se ha proporcionado una URL válida ni un archivo.");
            return;
        }
        const newItem = {
            id: Date.now(),
            title: title,
            desc: desc,
            url: finalUrl
        };
        let customData = JSON.parse(localStorage.getItem('customMultimedia') || '{}');
        if (!customData[cat]) {
            customData[cat] = [];
        }
        customData[cat].push(newItem);
        localStorage.setItem('customMultimedia', JSON.stringify(customData));
        cerrarModalMultimedia();
        renderMultimediaCategory(currentMultimediaCategory);
        alert("¡Contenido añadido con éxito!");
    };

    // If a file is selected, read it as DataURL
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // 5 MB limit
        if (file.size > 5 * 1024 * 1024) {
            alert("El archivo excede el límite de 5 MB. Por favor elige un archivo más pequeño.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result; // base64 data URL
            saveItem(dataUrl);
        };
        reader.onerror = function() {
            alert("Error al leer el archivo.");
        };
        reader.readAsDataURL(file);
    } else {
        // No file selected, use URL field (could be empty)
        if (!urlField) {
            alert("Debes proporcionar una URL o seleccionar un archivo.");
            return;
        }
        saveItem(urlField);
    }
};

// Initialize default multimedia category on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.renderMultimediaCategory) {
        renderMultimediaCategory('imagenes');
    }
});
