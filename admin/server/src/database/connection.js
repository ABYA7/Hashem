/**
 * Conexión a Base de Datos PostgreSQL
 * Configurada para manejar millones de registros
 */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'hashem_db',
  process.env.DB_USER || 'hashem_admin',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Pool optimizado para alto rendimiento
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
      evict: 1000
    },

    // Opciones de rendimiento
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },

    // Optimizaciones para grandes volúmenes
    dialectOptions: {
      statement_timeout: 30000,
      idle_in_transaction_session_timeout: 60000
    }
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error.message);
    console.log('💡 Asegúrate de que PostgreSQL está corriendo y las credenciales son correctas');
    return false;
  }
}

module.exports = { sequelize, testConnection };
