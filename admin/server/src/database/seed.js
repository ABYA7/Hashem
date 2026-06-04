/**
 * Script de Seed - Datos iniciales
 * Carga los 66 libros de la Biblia y estructura base
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.example') });
const { sequelize } = require('./connection');
const { Biblia, Libro } = require('../models');

const LIBROS_BIBLIA = [
  // Antiguo Testamento - Pentateuco (Ley)
  { numero: 1, nombre: 'Génesis', abreviatura: 'Gn', testamento: 'AT', categoria: 'Ley', total_capitulos: 50 },
  { numero: 2, nombre: 'Éxodo', abreviatura: 'Ex', testamento: 'AT', categoria: 'Ley', total_capitulos: 40 },
  { numero: 3, nombre: 'Levítico', abreviatura: 'Lv', testamento: 'AT', categoria: 'Ley', total_capitulos: 27 },
  { numero: 4, nombre: 'Números', abreviatura: 'Nm', testamento: 'AT', categoria: 'Ley', total_capitulos: 36 },
  { numero: 5, nombre: 'Deuteronomio', abreviatura: 'Dt', testamento: 'AT', categoria: 'Ley', total_capitulos: 34 },
  // Historia
  { numero: 6, nombre: 'Josué', abreviatura: 'Jos', testamento: 'AT', categoria: 'Historia', total_capitulos: 24 },
  { numero: 7, nombre: 'Jueces', abreviatura: 'Jue', testamento: 'AT', categoria: 'Historia', total_capitulos: 21 },
  { numero: 8, nombre: 'Rut', abreviatura: 'Rt', testamento: 'AT', categoria: 'Historia', total_capitulos: 4 },
  { numero: 9, nombre: '1 Samuel', abreviatura: '1S', testamento: 'AT', categoria: 'Historia', total_capitulos: 31 },
  { numero: 10, nombre: '2 Samuel', abreviatura: '2S', testamento: 'AT', categoria: 'Historia', total_capitulos: 24 },
  { numero: 11, nombre: '1 Reyes', abreviatura: '1R', testamento: 'AT', categoria: 'Historia', total_capitulos: 22 },
  { numero: 12, nombre: '2 Reyes', abreviatura: '2R', testamento: 'AT', categoria: 'Historia', total_capitulos: 25 },
  { numero: 13, nombre: '1 Crónicas', abreviatura: '1Cr', testamento: 'AT', categoria: 'Historia', total_capitulos: 29 },
  { numero: 14, nombre: '2 Crónicas', abreviatura: '2Cr', testamento: 'AT', categoria: 'Historia', total_capitulos: 36 },
  { numero: 15, nombre: 'Esdras', abreviatura: 'Esd', testamento: 'AT', categoria: 'Historia', total_capitulos: 10 },
  { numero: 16, nombre: 'Nehemías', abreviatura: 'Neh', testamento: 'AT', categoria: 'Historia', total_capitulos: 13 },
  { numero: 17, nombre: 'Ester', abreviatura: 'Est', testamento: 'AT', categoria: 'Historia', total_capitulos: 10 },
  // Poesía y Sabiduría
  { numero: 18, nombre: 'Job', abreviatura: 'Job', testamento: 'AT', categoria: 'Poesía', total_capitulos: 42 },
  { numero: 19, nombre: 'Salmos', abreviatura: 'Sal', testamento: 'AT', categoria: 'Poesía', total_capitulos: 150 },
  { numero: 20, nombre: 'Proverbios', abreviatura: 'Pr', testamento: 'AT', categoria: 'Poesía', total_capitulos: 31 },
  { numero: 21, nombre: 'Eclesiastés', abreviatura: 'Ec', testamento: 'AT', categoria: 'Poesía', total_capitulos: 12 },
  { numero: 22, nombre: 'Cantares', abreviatura: 'Cnt', testamento: 'AT', categoria: 'Poesía', total_capitulos: 8 },
  // Profetas Mayores
  { numero: 23, nombre: 'Isaías', abreviatura: 'Is', testamento: 'AT', categoria: 'Profecía Mayor', total_capitulos: 66 },
  { numero: 24, nombre: 'Jeremías', abreviatura: 'Jer', testamento: 'AT', categoria: 'Profecía Mayor', total_capitulos: 52 },
  { numero: 25, nombre: 'Lamentaciones', abreviatura: 'Lm', testamento: 'AT', categoria: 'Profecía Mayor', total_capitulos: 5 },
  { numero: 26, nombre: 'Ezequiel', abreviatura: 'Ez', testamento: 'AT', categoria: 'Profecía Mayor', total_capitulos: 48 },
  { numero: 27, nombre: 'Daniel', abreviatura: 'Dn', testamento: 'AT', categoria: 'Profecía Mayor', total_capitulos: 12 },
  // Profetas Menores
  { numero: 28, nombre: 'Oseas', abreviatura: 'Os', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 14 },
  { numero: 29, nombre: 'Joel', abreviatura: 'Jl', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 3 },
  { numero: 30, nombre: 'Amós', abreviatura: 'Am', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 9 },
  { numero: 31, nombre: 'Abdías', abreviatura: 'Abd', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 1 },
  { numero: 32, nombre: 'Jonás', abreviatura: 'Jon', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 4 },
  { numero: 33, nombre: 'Miqueas', abreviatura: 'Mi', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 7 },
  { numero: 34, nombre: 'Nahúm', abreviatura: 'Nah', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 3 },
  { numero: 35, nombre: 'Habacuc', abreviatura: 'Hab', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 3 },
  { numero: 36, nombre: 'Sofonías', abreviatura: 'Sof', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 3 },
  { numero: 37, nombre: 'Hageo', abreviatura: 'Hag', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 2 },
  { numero: 38, nombre: 'Zacarías', abreviatura: 'Zac', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 14 },
  { numero: 39, nombre: 'Malaquías', abreviatura: 'Mal', testamento: 'AT', categoria: 'Profecía Menor', total_capitulos: 4 },
  // Nuevo Testamento - Evangelios
  { numero: 40, nombre: 'Mateo', abreviatura: 'Mt', testamento: 'NT', categoria: 'Evangelio', total_capitulos: 28 },
  { numero: 41, nombre: 'Marcos', abreviatura: 'Mr', testamento: 'NT', categoria: 'Evangelio', total_capitulos: 16 },
  { numero: 42, nombre: 'Lucas', abreviatura: 'Lc', testamento: 'NT', categoria: 'Evangelio', total_capitulos: 24 },
  { numero: 43, nombre: 'Juan', abreviatura: 'Jn', testamento: 'NT', categoria: 'Evangelio', total_capitulos: 21 },
  // Historia NT
  { numero: 44, nombre: 'Hechos', abreviatura: 'Hch', testamento: 'NT', categoria: 'Historia', total_capitulos: 28 },
  // Epístolas Paulinas
  { numero: 45, nombre: 'Romanos', abreviatura: 'Ro', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 16 },
  { numero: 46, nombre: '1 Corintios', abreviatura: '1Co', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 16 },
  { numero: 47, nombre: '2 Corintios', abreviatura: '2Co', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 13 },
  { numero: 48, nombre: 'Gálatas', abreviatura: 'Gá', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 6 },
  { numero: 49, nombre: 'Efesios', abreviatura: 'Ef', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 6 },
  { numero: 50, nombre: 'Filipenses', abreviatura: 'Fil', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 4 },
  { numero: 51, nombre: 'Colosenses', abreviatura: 'Col', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 4 },
  { numero: 52, nombre: '1 Tesalonicenses', abreviatura: '1Ts', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 5 },
  { numero: 53, nombre: '2 Tesalonicenses', abreviatura: '2Ts', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 3 },
  { numero: 54, nombre: '1 Timoteo', abreviatura: '1Ti', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 6 },
  { numero: 55, nombre: '2 Timoteo', abreviatura: '2Ti', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 4 },
  { numero: 56, nombre: 'Tito', abreviatura: 'Tit', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 3 },
  { numero: 57, nombre: 'Filemón', abreviatura: 'Flm', testamento: 'NT', categoria: 'Epístola Paulina', total_capitulos: 1 },
  // Epístolas Generales
  { numero: 58, nombre: 'Hebreos', abreviatura: 'He', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 13 },
  { numero: 59, nombre: 'Santiago', abreviatura: 'Stg', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 5 },
  { numero: 60, nombre: '1 Pedro', abreviatura: '1P', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 5 },
  { numero: 61, nombre: '2 Pedro', abreviatura: '2P', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 3 },
  { numero: 62, nombre: '1 Juan', abreviatura: '1Jn', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 5 },
  { numero: 63, nombre: '2 Juan', abreviatura: '2Jn', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 1 },
  { numero: 64, nombre: '3 Juan', abreviatura: '3Jn', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 1 },
  { numero: 65, nombre: 'Judas', abreviatura: 'Jud', testamento: 'NT', categoria: 'Epístola General', total_capitulos: 1 },
  // Profecía NT
  { numero: 66, nombre: 'Apocalipsis', abreviatura: 'Ap', testamento: 'NT', categoria: 'Profecía', total_capitulos: 22 }
];

async function seed() {
  console.log('🌱 Iniciando carga de datos iniciales...\n');

  try {
    await sequelize.authenticate();

    // Crear Biblia RVR1960
    const [biblia] = await Biblia.findOrCreate({
      where: { abreviatura: 'RVR1960' },
      defaults: {
        nombre: 'Reina Valera 1960',
        abreviatura: 'RVR1960',
        idioma: 'Español',
        año: 1960,
        descripcion: 'La versión Reina-Valera 1960 es una de las traducciones más populares de la Biblia en español.',
        activa: true
      }
    });
    console.log(`📖 Biblia: ${biblia.nombre} (${biblia.abreviatura})`);

    // Crear los 66 libros
    let creados = 0;
    for (const libroData of LIBROS_BIBLIA) {
      const [libro, created] = await Libro.findOrCreate({
        where: { biblia_id: biblia.id, numero: libroData.numero },
        defaults: { ...libroData, biblia_id: biblia.id }
      });
      if (created) creados++;
    }

    console.log(`\n📚 Libros cargados: ${creados} nuevos de ${LIBROS_BIBLIA.length} total`);
    console.log('  📕 AT: 39 libros (Ley, Historia, Poesía, Profecía)');
    console.log('  📗 NT: 27 libros (Evangelios, Historia, Epístolas, Profecía)');
    console.log('\n🎉 Seed completado exitosamente');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();
