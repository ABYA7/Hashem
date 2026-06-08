/**
 * prepare_diccionario.js
 * Lee data/diccionario_rabi.json, filtra entradas válidas y genera data/diccionario.json
 * listo para ser consumido por app.js del módulo Diccionario Rabí.
 *
 * Entrada esperada: objetos con { termino, definicion, referencias }
 * Salida:           objetos con { termino, definicion, categoria, referencias }
 *
 * Reglas de limpieza:
 *  - El termino debe tener al menos 2 caracteres y no parecerse a basura de PDF
 *  - La definicion debe tener al menos 10 caracteres
 *  - Se asigna categoria automáticamente basada en patrones del termino
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'data', 'diccionario_rabi.json');
const OUTPUT = path.join(__dirname, 'data', 'diccionario.json');

// Frases de basura que provienen del encabezado del PDF
const TRASH_PHRASES = [
  'BIBLIOTECA MUNDO HISPANO',
  'DICCIONARIO BIBLICO',
  'EDITORIAL MUNDO HISPANO',
  'DICCIONARIO BÍBLICO MUNDO',
  'J. D. DOUGLAS',
  'MERRILL C. TENNEY',
  'Raimundo J. Ericson',
  'A-M',
  '© 2003',
];

// Función para determinar la categoría de un término bíblico
function assignCategory(termino) {
  const t = termino.toUpperCase();

  // Nombres de personas bíblicas (no empiezan con artículo ni son frases largas)
  if (/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2}$/.test(termino) &&
      !t.includes(' DE ') && !t.includes(' DEL ') && termino.split(' ').length <= 3) {
    // Lugares conocidos
    const lugares = ['MAR', 'RÍO', 'RIO', 'MONTE', 'DESIERTO', 'CIUDAD', 'TIERRA', 'VALLE', 'LAGO'];
    if (lugares.some(l => t.includes(l))) return 'Lugar';
    return 'Personaje';
  }

  // Detectar lugares explícitos
  if (/CIUDAD|PUEBLO|MONTE|TIERRA|DESIERTO|LAGO|MAR |RÍO|VALLE|REGIÓN|PROVINCIA|PAIS|PAÍS/.test(t)) {
    return 'Lugar';
  }

  // Detectar teología / doctrina
  if (/DIOS|SEÑOR|ESPÍRITU|CRISTO|MESÍAS|SALVACIÓN|PECADO|GRACIA|FE |PACTO|PROFECÍA|ÁNGEL|DEMONIO|SATANÁS|INFIERNO|CIELO|IGLESIA|BAUTISMO|COMUNIÓN|ORACIÓN|ADORACIÓN/.test(t)) {
    return 'Doctrina';
  }

  // Detectar libros / escrituras
  if (/BIBLIA|TESTAMENTO|EVANGELIO|EPÍSTOLA|SALMO|LIBRO|ESCRITURA/.test(t)) {
    return 'Escritura';
  }

  // Detectar historia / cultura
  if (/REY|REINO|GUERRA|TRIBU|NACIÓN|IMPERIO|FARAÓN|SACERDOTE|TEMPLO|TABERNÁCULO|FIESTA|SÁBADO|PASCUA|PENTECOSTÉS/.test(t)) {
    return 'Historia';
  }

  return 'General';
}

// Función para limpiar referencias tipo <400123>Mateo 1:23
function formatDefinicion(definicion) {
  return definicion
    // Reemplazar <XXXXXX>Referencia → [Referencia]
    .replace(/<\d+>([^<\n]+)/g, '[$1]')
    .trim();
}

console.log('📖 Cargando diccionario_rabi.json...');
const raw = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
console.log(`   Total entradas brutas: ${raw.length}`);

const seen = new Set();
const clean = [];

for (const item of raw) {
  const termino = (item.termino || '').trim();
  const definicion = (item.definicion || '').trim();

  // Filtros básicos de calidad
  if (!termino || termino.length < 3) continue;
  if (!definicion || definicion.length < 10) continue;

  // Eliminar basura de encabezado PDF
  if (TRASH_PHRASES.some(t => termino.toUpperCase().includes(t.toUpperCase()))) continue;

  // Eliminar términos que son fragmentos de párrafo (demasiado largos)
  if (termino.length > 60) continue;

  // Eliminar términos que empiezan con código de referencia bíblica <XXXXXX>
  if (/^<\d+>/.test(termino)) continue;
  if (/^\(<\d+>/.test(termino)) continue;

  // Eliminar términos que empiezan con paréntesis o corchetes (fragmentos)
  if (/^[\(\[\¿\?]/.test(termino)) continue;

  // Eliminar frases comunes que no son entradas del diccionario
  if (/^(El |La |Los |Las |Un |Una |En |A |De |Del |Por |Para |Con |Que |Se |Como |Al |Así |Dado |Uno |Otro |Aunque |Porque |Si |No |También |Sin |Su |Sus |Esto |Esta |Este |Esto |Aun |Cuando |Dicho |Dios |Cristo )/.test(termino)) continue;

  // Eliminar si contiene caracteres de código de referencia bíblica
  if (/\u003c\d+\u003e/.test(termino)) continue;

  // Eliminar duplicados (normalizado)
  const key = termino.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (seen.has(key)) continue;
  seen.add(key);

  const categoria = assignCategory(termino);
  const definicionLimpia = formatDefinicion(definicion);

  clean.push({
    termino,
    definicion: definicionLimpia,
    categoria,
    referencias: item.referencias || []
  });
}

// Ordenar alfabéticamente
clean.sort((a, b) => a.termino.localeCompare(b.termino, 'es'));

console.log(`✅ Entradas válidas después de limpiar: ${clean.length}`);

// Guardar
fs.writeFileSync(OUTPUT, JSON.stringify(clean, null, 2), 'utf-8');
console.log(`💾 Guardado en: ${OUTPUT}`);

// Estadísticas por categoría
const stats = {};
clean.forEach(e => { stats[e.categoria] = (stats[e.categoria] || 0) + 1; });
console.log('\n📊 Entradas por categoría:');
Object.entries(stats).sort((a,b)=>b[1]-a[1]).forEach(([cat, n]) => console.log(`   ${cat}: ${n}`));
