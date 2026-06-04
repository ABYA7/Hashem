/**
 * Modelo: Imagen
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Imagen = sequelize.define('imagenes', {
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
  categoria: {
    type: DataTypes.STRING(100),
    comment: 'Ilustración, Fotografía, Arte, Diagrama, etc.'
  },
  etiquetas: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  libro_id: {
    type: DataTypes.INTEGER,
    references: { model: 'libros', key: 'id' },
    comment: 'Libro relacionado (opcional)'
  },
  creditos: {
    type: DataTypes.STRING(500),
    comment: 'Atribución y créditos'
  },
  ancho: { type: DataTypes.INTEGER },
  alto: { type: DataTypes.INTEGER },
  formato: {
    type: DataTypes.STRING(20),
    comment: 'jpg, png, webp, svg'
  },
  tamaño_bytes: { type: DataTypes.BIGINT }
}, {
  indexes: [
    { fields: ['categoria'] },
    { fields: ['libro_id'] },
    { using: 'gin', fields: ['etiquetas'] }
  ]
});

module.exports = Imagen;
