/**
 * Modelo: Capítulo
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Capitulo = sequelize.define('capitulos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'libros', key: 'id' }
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_versiculos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  resumen: {
    type: DataTypes.TEXT,
    comment: 'Resumen breve del capítulo'
  }
}, {
  indexes: [
    { fields: ['libro_id', 'numero'], unique: true }
  ]
});

module.exports = Capitulo;
