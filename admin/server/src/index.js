/**
 * HASHEM Admin Server - Punto de entrada principal
 * Módulo 8: Administrador de Base de Datos
 * 
 * Servidor Express configurado para manejar millones de registros
 * con PostgreSQL + Elasticsearch
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { sequelize, testConnection } = require('./database/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ══════════════════════════════════════════════════════════
// MIDDLEWARE DE SEGURIDAD
// ══════════════════════════════════════════════════════════
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// ══════════════════════════════════════════════════════════
// MIDDLEWARE DE RENDIMIENTO
// ══════════════════════════════════════════════════════════
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ══════════════════════════════════════════════════════════
// LOGGING
// ══════════════════════════════════════════════════════════
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ══════════════════════════════════════════════════════════
// RATE LIMITING
// ══════════════════════════════════════════════════════════
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    error: 'Demasiadas solicitudes. Intente de nuevo más tarde.'
  }
});
app.use('/api/', limiter);

// ══════════════════════════════════════════════════════════
// RUTAS
// ══════════════════════════════════════════════════════════
app.use('/api', routes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    module: 'HASHEM Admin - Módulo 8'
  });
});

// ══════════════════════════════════════════════════════════
// MANEJO DE ERRORES
// ══════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ══════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ══════════════════════════════════════════════════════════
async function startServer() {
  try {
    // Probar conexión a base de datos
    await testConnection();
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📋 Modelos sincronizados con la base de datos');
    }

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║          HASHEM Admin Server v1.0.0              ║
║──────────────────────────────────────────────────║
║  🚀 Servidor:    http://localhost:${PORT}          ║
║  📦 Entorno:     ${process.env.NODE_ENV || 'development'}                  ║
║  🗄️  Base Datos:  ${process.env.DB_NAME || 'hashem_db'}                ║
║  🔍 Elastic:     ${process.env.ELASTIC_HOST || 'localhost:9200'}       ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
