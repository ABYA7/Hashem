/**
 * parse_diccionario_final.js
 *
 * Lee diccionario_rabi.json (que es la fuente más limpia disponible con 4134 entradas)
 * y extrae solo las entradas que son TÉRMINOS BÍBLICOS REALES.
 *
 * Patrón de término real: el campo "termino" contiene la palabra + su etimología.
 * Ejemplos:
 *   "Abominacion, Abominacion Desoladora. La palabra abominación"
 *   "Alejandria. Fundada por Alejandro Magno"
 *   "Canaan, Cananeos. 1. El hijo de Cam"
 *
 * El TÉRMINO REAL es la parte ANTES del primer punto o coma seguida de definición.
 * La DEFINICIÓN viene del campo "definicion".
 */

const fs = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'data', 'diccionario_rabi.json');
const OUTPUT = path.join(__dirname, 'data', 'diccionario.json');

// ── Utilidades ─────────────────────────────────────────────────────────────

/** Limpia códigos de referencia bíblica <400123>Mateo 1:23 → [Mateo 1:23] */
function cleanRefs(text) {
  return (text || '')
    .replace(/<\d{6}>([^\n<]+)/g, '[$1]')
    .replace(/\u003c\d{6}\u003e([^\n\u003c]+)/g, '[$1]')
    .trim();
}

/** Extrae el término limpio de la línea del termino */
function extractTerm(raw) {
  // Quitar asteriscos iniciales (p. ej. "*Abominación")
  let t = raw.replace(/^\*+/, '').trim();

  // Quitar sufijos descriptivos comunes que no son parte del nombre
  // "Abominacion, Abominacion Desoladora. La palabra..." → "Abominacion, Abominacion Desoladora"
  // "Alejandria. Fundada por..." → "Alejandria"
  // Cortar en el primer punto seguido de espacio y minúscula/número
  t = t.replace(/\.\s+[a-záéíóúñ0-9¿¡].*$/, '');
  t = t.replace(/\.\s+[A-Z][a-záéíóúñ].*$/, '');

  // Limpiar referencias
  t = cleanRefs(t);

  // Quitar puntuación final
  t = t.replace(/[.,;:]+$/, '').trim();

  return t;
}

/** Determina la categoría de un término */
function getCategory(term, def) {
  const T = (term + ' ' + def.substring(0, 200)).toUpperCase();
  if (/\bCIUDAD\b|\bLUGAR\b|\bMONTE\b|\bVALLE\b|\bDESIERTO\b|\bTIERRA\b|\bLAGO\b|\bMAR\b|\bRÍO\b|\bRIO\b|\bREGIÓN\b|\bREGION\b|\bCOSTA\b|\bPUERTO\b|\bISLA\b/.test(T)) return 'Lugar';
  if (/\bREY\b|\bREINO\b|\bTRIBU\b|\bNACIÓN\b|\bNACION\b|\bIMPERIO\b|\bGUERRA\b|\bFARAÓN\b|\bFARAON\b|\bSACERDOTE\b|\bTEMPLO\b|\bTABERNÁCULO\b/.test(T)) return 'Historia';
  if (/\bDIOS\b|\bSEÑOR\b|\bESPÍRITU\b|\bCRISTO\b|\bMESÍAS\b|\bSALVACIÓN\b|\bPECADO\b|\bGRACIA\b|\bPACTO\b|\bÁNGEL\b|\bSATANÁS\b|\bBAUTISMO\b|\bORACIÓN\b|\bFE\b|\bEVANGELIO\b/.test(T)) return 'Doctrina';
  if (/\bBIBLIA\b|\bTESTAMENTO\b|\bEVANGELIO\b|\bEPÍSTOLA\b|\bSALMO\b|\bPROFECÍA\b|\bESCRITURA\b|\bCANON\b/.test(T)) return 'Escritura';
  return 'General';
}

// ── Carga y procesamiento ──────────────────────────────────────────────────

console.log('📖 Cargando diccionario_rabi.json …');
const raw = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
console.log(`   Entradas brutas: ${raw.length}`);

// Frases que identifican entradas que NO son términos del diccionario
const TRASH_STARTS = [
  'BIBLIOTECA', 'EDITORIAL', 'J. D. DOUGLAS', 'MERRILL', 'Raimundo',
  'Cortesía', 'Ver ', 'LA BIBLIA', 'I. ', 'II. ', 'III. ', 'IV. ', 'V. ', 'VI. ',
  'VII.', 'VIII.', 'IX.', 'X.', 'XI.', 'XII.', 'XIII.', 'XIV.', 'XV.',
  'A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.',
  'Gobernante', 'Años', 'JUDA', 'Opresión', 'Judicatura', 'Liberación',
  'Ascenso', 'Piedras', 'Rollo',
];

// Patrones de término REAL: el campo termino incluye el término + inicio de definición
// Los términos reales tienen la forma "Nombre [, Nombre2]. Definición..."
// La definición del término está en el campo "definicion"
const REAL_ENTRY_PATTERNS = [
  // Término simple: "Aaron" o "Abba"
  /^[A-ZÁÉÍÓÚÑ*][a-záéíóúñA-ZÁÉÍÓÚÑ,.\s\-'()]{0,50}\.?\s+(heb\.|gr\.|aram\.|lat\.|pers\.|eg\.|ar\.)/i,
  // Término con etimología en paréntesis: "Abad (heb., ..."
  /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ,.\s\-']{2,40}\s*\(/,
  // Término seguido de punto y minúscula "Alejandria. Fundada"
  /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s,]{2,40}\.\s+[A-Z0-9]/,
  // Término seguido de coma y sinónimo: "Abominacion, Abominacion Desoladora."
  /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(,\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]+)?\.\s/,
];

const seen = new Set();
const result = [];

for (const item of raw) {
  const rawTerm = (item.termino || '').trim();
  const rawDef  = (item.definicion || '').trim();

  // Necesita definición sustancial
  if (!rawDef || rawDef.length < 20) continue;

  // Saltar entradas de basura por inicio conocido
  if (TRASH_STARTS.some(t => rawTerm.startsWith(t))) continue;

  // Saltar frases que no son términos reales (empiezan con artículo/preposición)
  if (/^(A |Al |De |En |El |La |Los |Las |Un |Una |Por |Para |Con )/.test(rawTerm)) continue;

  // Debe coincidir con algún patrón de término real
  const isReal = REAL_ENTRY_PATTERNS.some(re => re.test(rawTerm));
  if (!isReal) continue;

  // Extraer el término limpio
  const termino = extractTerm(rawTerm);
  if (!termino || termino.length < 2) continue;
  if (termino.length > 80) continue;

  // Deduplicar
  const key = termino.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (seen.has(key)) continue;
  seen.add(key);

  const definicion = cleanRefs(rawDef);
  const categoria  = getCategory(termino, definicion);

  result.push({ termino, definicion, categoria, referencias: item.referencias || [] });
}

// Ordenar alfabéticamente por término
result.sort((a, b) => a.termino.localeCompare(b.termino, 'es'));

console.log(`✅ Términos bíblicos reales extraídos: ${result.length}`);

// Guardar
fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf-8');
console.log(`💾 Guardado en: ${OUTPUT}`);

// Estadísticas
const stats = {};
result.forEach(e => { stats[e.categoria] = (stats[e.categoria] || 0) + 1; });
console.log('\n📊 Entradas por categoría:');
Object.entries(stats).sort((a,b) => b[1]-a[1])
  .forEach(([cat, n]) => console.log(`   ${cat}: ${n}`));

console.log('\n🔍 Muestra de términos extraídos:');
result.slice(0, 20).forEach(e => console.log(`   • ${e.termino} [${e.categoria}]`));
