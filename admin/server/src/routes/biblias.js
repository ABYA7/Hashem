/**
 * Rutas: Biblias (versiones)
 */

const express = require('express');
const router = express.Router();
const { Biblia, Libro } = require('../models');

// GET /api/biblias - Listar todas las versiones
router.get('/', async (req, res, next) => {
  try {
    const biblias = await Biblia.findAll({
      where: { activa: true },
      order: [['nombre', 'ASC']]
    });
    res.json({ total: biblias.length, data: biblias });
  } catch (error) { next(error); }
});

// GET /api/biblias/:id - Detalle de una versión con sus libros
router.get('/:id', async (req, res, next) => {
  try {
    const biblia = await Biblia.findByPk(req.params.id, {
      include: [{ model: Libro, as: 'libros', order: [['numero', 'ASC']] }]
    });
    if (!biblia) return res.status(404).json({ error: 'Biblia no encontrada' });
    res.json(biblia);
  } catch (error) { next(error); }
});

// POST /api/biblias - Crear nueva versión
router.post('/', async (req, res, next) => {
  try {
    const biblia = await Biblia.create(req.body);
    res.status(201).json(biblia);
  } catch (error) { next(error); }
});

// PUT /api/biblias/:id - Actualizar versión
router.put('/:id', async (req, res, next) => {
  try {
    const [updated] = await Biblia.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Biblia no encontrada' });
    const biblia = await Biblia.findByPk(req.params.id);
    res.json(biblia);
  } catch (error) { next(error); }
});

// DELETE /api/biblias/:id - Eliminar versión
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Biblia.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Biblia no encontrada' });
    res.json({ mensaje: 'Biblia eliminada correctamente' });
  } catch (error) { next(error); }
});

module.exports = router;
