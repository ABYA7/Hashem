/**
 * Rutas: Búsqueda avanzada
 * Preparada para Elasticsearch cuando esté disponible
 * Usa PostgreSQL como fallback
 */

const express = require('express');
const router = express.Router();
const { Versiculo, Libro, Capitulo, Biblia, Diccionario } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../database/connection');

// GET /api/busqueda?q=palabra&biblia_id=1&testamento=AT
router.get('/', async (req, res, next) => {
  try {
    const { q, biblia_id, libro_id, testamento } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'La búsqueda debe tener al menos 2 caracteres' });
    }

    // Construir condiciones
    const versiculoWhere = {
      texto: { [Op.iLike]: `%${q.trim()}%` }
    };
    if (biblia_id) versiculoWhere.biblia_id = biblia_id;
    if (libro_id) versiculoWhere.libro_id = libro_id;

    const libroWhere = {};
    if (testamento) libroWhere.testamento = testamento;

    const { count, rows } = await Versiculo.findAndCountAll({
      where: versiculoWhere,
      limit,
      offset,
      include: [
        { model: Biblia, as: 'biblia', attributes: ['nombre', 'abreviatura'] },
        { model: Libro, as: 'libro', attributes: ['nombre', 'abreviatura', 'testamento'], where: libroWhere },
        { model: Capitulo, as: 'capitulo', attributes: ['numero'] }
      ],
      order: [['libro_id', 'ASC'], ['capitulo_id', 'ASC'], ['numero', 'ASC']]
    });

    res.json({
      consulta: q,
      total: count,
      pagina: page,
      paginas: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) { next(error); }
});

// GET /api/busqueda/diccionario?q=palabra
router.get('/diccionario', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'La búsqueda debe tener al menos 2 caracteres' });
    }

    const resultados = await Diccionario.findAll({
      where: {
        [Op.or]: [
          { termino: { [Op.iLike]: `%${q}%` } },
          { definicion: { [Op.iLike]: `%${q}%` } },
          { numero_strong: { [Op.iLike]: `%${q}%` } }
        ]
      },
      limit: 50,
      order: [['termino', 'ASC']]
    });

    res.json({ consulta: q, total: resultados.length, data: resultados });
  } catch (error) { next(error); }
});

module.exports = router;
