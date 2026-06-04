/**
 * Rutas principales de la API
 */

const express = require('express');
const router = express.Router();

const bibliasRouter = require('./biblias');
const librosRouter = require('./libros');
const versiculosRouter = require('./versiculos');
const diccionarioRouter = require('./diccionario');
const busquedaRouter = require('./busqueda');
const estadisticasRouter = require('./estadisticas');

// ══════════════════════════════════════════════════════════
// RUTAS DE LA API v1
// ══════════════════════════════════════════════════════════

router.use('/biblias', bibliasRouter);
router.use('/libros', librosRouter);
router.use('/versiculos', versiculosRouter);
router.use('/diccionario', diccionarioRouter);
router.use('/busqueda', busquedaRouter);
router.use('/estadisticas', estadisticasRouter);

// Información de la API
router.get('/', (req, res) => {
  res.json({
    nombre: 'HASHEM Admin API',
    version: '1.0.0',
    modulo: 'Módulo 8 - Administrador de Base de Datos',
    endpoints: {
      biblias: '/api/biblias',
      libros: '/api/libros',
      versiculos: '/api/versiculos',
      diccionario: '/api/diccionario',
      busqueda: '/api/busqueda',
      estadisticas: '/api/estadisticas'
    },
    tablas: [
      'Biblias', 'Libros', 'Capítulos', 'Versículos',
      'Diccionario', 'Usuarios', 'Notas', 'Imágenes',
      'Mapas', 'Referencias Cruzadas', 'Comentarios'
    ]
  });
});

module.exports = router;
