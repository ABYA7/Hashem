/**
 * Script de Migración
 * Crea todas las tablas y ejecuta las migraciones
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.example') });
const { sequelize } = require('./connection');
require('../models'); // Cargar todos los modelos y relaciones

async function migrate() {
  console.log('🔄 Iniciando migración de base de datos...\n');
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida\n');

    // Sincronizar todos los modelos
    await sequelize.sync({ force: false, alter: true });
    
    console.log('\n📋 Tablas creadas/actualizadas:');
    console.log('  ✅ biblias');
    console.log('  ✅ libros');
    console.log('  ✅ capitulos');
    console.log('  ✅ versiculos');
    console.log('  ✅ diccionario');
    console.log('  ✅ usuarios');
    console.log('  ✅ notas');
    console.log('  ✅ imagenes');
    console.log('  ✅ mapas');
    console.log('  ✅ referencias_cruzadas');
    console.log('  ✅ comentarios');
    console.log('\n🎉 Migración completada exitosamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migrate();
