/**
 * Modelo: Mapa Bíblico
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Mapa = sequelize.define('mapas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.STRING(1000)
  },
  tipo: {
    type: DataTypes.ENUM('geografico', 'historico', 'rutas', 'ciudades', 'reinos', 'interactivo'),
    defaultValue: 'geografico'
  },
  periodo: {
    type: DataTypes.STRING(200),
    comment: 'Período histórico (ej: Éxodo, Monarquía, NT)'
  },
  region: {
    type: DataTypes.STRING(200),
    comment: 'Región geográfica principal'
  },
  coordenadas_centro: {
    type: DataTypes.JSONB,
    comment: '{ lat, lng, zoom } para mapas interactivos'
  },
  puntos_interes: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array de { nombre, lat, lng, descripcion }'
  },
  libros_relacionados: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
    comment: 'IDs de libros relacionados'
  }
}, {
  indexes: [
    { fields: ['tipo'] },
    { fields: ['periodo'] }
  ]
});

module.exports = Mapa;
