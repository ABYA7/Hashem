/**
 * Modelo: Libro
 * Los 66 libros de la Biblia (o más según la versión)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Libro = sequelize.define('libros', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  biblia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'biblias', key: 'id' }
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número del libro (1-66+)'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre completo (ej: Génesis)'
  },
  abreviatura: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Abreviatura (ej: Gn, Ex, Lv)'
  },
  testamento: {
    type: DataTypes.ENUM('AT', 'NT'),
    allowNull: false,
    comment: 'AT = Antiguo Testamento, NT = Nuevo Testamento'
  },
  categoria: {
    type: DataTypes.STRING(50),
    comment: 'Ley, Historia, Poesía, Profecía, Evangelio, Epístola, etc.'
  },
  total_capitulos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  indexes: [
    { fields: ['biblia_id', 'numero'] },
    { fields: ['testamento'] },
    { fields: ['nombre'] }
  ]
});

module.exports = Libro;
