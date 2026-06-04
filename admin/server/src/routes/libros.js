/**
 * Rutas: Libros de la Biblia
 */

const express = require('express');
const router = express.Router();
const { Libro, Capitulo, Biblia } = require('../models');

// GET /api/libros - Listar todos los libros (con filtros)
router.get('/', async (req, res, next) => {
  try {
    const { biblia_id, testamento } = req.query;
    const where = {};
    if (biblia_id) where.biblia_id = biblia_id;
    if (testamento) where.testamento = testamento;

    const libros = await Libro.findAll({
      where,
      include: [{ model: Biblia, as: 'biblia', attributes: ['nombre', 'abreviatura'] }],
      order: [['numero', 'ASC']]
    });
    res.json({ total: libros.length, data: libros });
  } catch (error) { next(error); }
});

// GET /api/libros/:id - Detalle con capítulos
router.get('/:id', async (req, res, next) => {
  try {
    const libro = await Libro.findByPk(req.params.id, {
      include: [
        { model: Biblia, as: 'biblia' },
        { model: Capitulo, as: 'capitulos', order: [['numero', 'ASC']] }
      ]
    });
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) { next(error); }
});

// POST /api/libros
router.post('/', async (req, res, next) => {
  try {
    const libro = await Libro.create(req.body);
    res.status(201).json(libro);
  } catch (error) { next(error); }
});

// PUT /api/libros/:id
router.put('/:id', async (req, res, next) => {
  try {
    const [updated] = await Libro.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Libro no encontrado' });
    const libro = await Libro.findByPk(req.params.id);
    res.json(libro);
  } catch (error) { next(error); }
});

// DELETE /api/libros/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Libro.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) { next(error); }
});

module.exports = router;
