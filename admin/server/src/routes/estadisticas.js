/**
 * Rutas: Estadísticas del sistema
 * Dashboard del administrador
 */

const express = require('express');
const router = express.Router();
const { Biblia, Libro, Capitulo, Versiculo, Diccionario, Usuario, Nota, Imagen, Mapa, ReferenciaCruzada, Comentario } = require('../models');

// GET /api/estadisticas - Resumen general
router.get('/', async (req, res, next) => {
  try {
    const [
      totalBiblias,
      totalLibros,
      totalCapitulos,
      totalVersiculos,
      totalDiccionario,
      totalUsuarios,
      totalNotas,
      totalImagenes,
      totalMapas,
      totalReferencias,
      totalComentarios
    ] = await Promise.all([
      Biblia.count(),
      Libro.count(),
      Capitulo.count(),
      Versiculo.count(),
      Diccionario.count(),
      Usuario.count(),
      Nota.count(),
      Imagen.count(),
      Mapa.count(),
      ReferenciaCruzada.count(),
      Comentario.count()
    ]);

    res.json({
      resumen: {
        biblias: totalBiblias,
        libros: totalLibros,
        capitulos: totalCapitulos,
        versiculos: totalVersiculos,
        diccionario: totalDiccionario,
        usuarios: totalUsuarios,
        notas: totalNotas,
        imagenes: totalImagenes,
        mapas: totalMapas,
        referencias_cruzadas: totalReferencias,
        comentarios: totalComentarios
      },
      total_registros: totalBiblias + totalLibros + totalCapitulos + totalVersiculos +
        totalDiccionario + totalUsuarios + totalNotas + totalImagenes + totalMapas +
        totalReferencias + totalComentarios,
      timestamp: new Date().toISOString()
    });
  } catch (error) { next(error); }
});

module.exports = router;
