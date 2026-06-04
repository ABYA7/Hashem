/**
 * Rutas: Diccionario Bíblico
 */

const express = require('express');
const router = express.Router();
const { Diccionario } = require('../models');
const { Op } = require('sequelize');

// GET /api/diccionario - Buscar términos
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = (page - 1) * limit;
    const { q, categoria, idioma } = req.query;

    const where = {};
    if (q) where.termino = { [Op.iLike]: `%${q}%` };
    if (categoria) where.categoria = categoria;
    if (idioma) where.idioma_origen = idioma;

    const { count, rows } = await Diccionario.findAndCountAll({
      where, limit, offset,
      order: [['termino', 'ASC']]
    });

    res.json({ total: count, pagina: page, data: rows });
  } catch (error) { next(error); }
});

// GET /api/diccionario/strong/:numero
router.get('/strong/:numero', async (req, res, next) => {
  try {
    const termino = await Diccionario.findOne({
      where: { numero_strong: req.params.numero }
    });
    if (!termino) return res.status(404).json({ error: 'Término no encontrado' });
    res.json(termino);
  } catch (error) { next(error); }
});

// GET /api/diccionario/:id
router.get('/:id', async (req, res, next) => {
  try {
    const termino = await Diccionario.findByPk(req.params.id);
    if (!termino) return res.status(404).json({ error: 'Término no encontrado' });
    res.json(termino);
  } catch (error) { next(error); }
});

// POST /api/diccionario
router.post('/', async (req, res, next) => {
  try {
    const termino = await Diccionario.create(req.body);
    res.status(201).json(termino);
  } catch (error) { next(error); }
});

// PUT /api/diccionario/:id
router.put('/:id', async (req, res, next) => {
  try {
    const [updated] = await Diccionario.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Término no encontrado' });
    const termino = await Diccionario.findByPk(req.params.id);
    res.json(termino);
  } catch (error) { next(error); }
});

// DELETE /api/diccionario/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Diccionario.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Término no encontrado' });
    res.json({ mensaje: 'Término eliminado' });
  } catch (error) { next(error); }
});

module.exports = router;
