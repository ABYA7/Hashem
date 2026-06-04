/**
 * Rutas: Versículos
 * Optimizadas para manejar millones de registros con paginación
 */

const express = require('express');
const router = express.Router();
const { Versiculo, Capitulo, Libro, Biblia, ReferenciaCruzada, Comentario } = require('../models');

// GET /api/versiculos - Listar con paginación obligatoria
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = (page - 1) * limit;
    const { biblia_id, libro_id, capitulo_id } = req.query;

    const where = {};
    if (biblia_id) where.biblia_id = biblia_id;
    if (libro_id) where.libro_id = libro_id;
    if (capitulo_id) where.capitulo_id = capitulo_id;

    const { count, rows } = await Versiculo.findAndCountAll({
      where,
      limit,
      offset,
      order: [['numero', 'ASC']],
      include: [
        { model: Libro, as: 'libro', attributes: ['nombre', 'abreviatura'] },
        { model: Capitulo, as: 'capitulo', attributes: ['numero'] }
      ]
    });

    res.json({
      total: count,
      pagina: page,
      limite: limit,
      paginas: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) { next(error); }
});

// GET /api/versiculos/:id - Detalle con referencias y comentarios
router.get('/:id', async (req, res, next) => {
  try {
    const versiculo = await Versiculo.findByPk(req.params.id, {
      include: [
        { model: Biblia, as: 'biblia' },
        { model: Libro, as: 'libro' },
        { model: Capitulo, as: 'capitulo' },
        { model: ReferenciaCruzada, as: 'referenciasDesde', limit: 20 },
        { model: Comentario, as: 'comentarios', limit: 10 }
      ]
    });
    if (!versiculo) return res.status(404).json({ error: 'Versículo no encontrado' });
    res.json(versiculo);
  } catch (error) { next(error); }
});

// POST /api/versiculos - Crear versículo
router.post('/', async (req, res, next) => {
  try {
    const versiculo = await Versiculo.create(req.body);
    res.status(201).json(versiculo);
  } catch (error) { next(error); }
});

// POST /api/versiculos/bulk - Inserción masiva (para importaciones)
router.post('/bulk', async (req, res, next) => {
  try {
    const { versiculos } = req.body;
    if (!Array.isArray(versiculos) || versiculos.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de versículos' });
    }
    if (versiculos.length > 1000) {
      return res.status(400).json({ error: 'Máximo 1000 versículos por lote' });
    }

    const creados = await Versiculo.bulkCreate(versiculos, { 
      validate: true,
      returning: true 
    });
    res.status(201).json({ 
      mensaje: `${creados.length} versículos creados`,
      total: creados.length 
    });
  } catch (error) { next(error); }
});

// PUT /api/versiculos/:id
router.put('/:id', async (req, res, next) => {
  try {
    const [updated] = await Versiculo.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Versículo no encontrado' });
    const versiculo = await Versiculo.findByPk(req.params.id);
    res.json(versiculo);
  } catch (error) { next(error); }
});

// DELETE /api/versiculos/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Versiculo.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Versículo no encontrado' });
    res.json({ mensaje: 'Versículo eliminado' });
  } catch (error) { next(error); }
});

module.exports = router;
