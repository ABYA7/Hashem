/**
 * Modelo: Comentario Bíblico
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Comentario = sequelize.define('comentarios', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  versiculo_id: {
    type: DataTypes.BIGINT,
    references: { model: 'versiculos', key: 'id' }
  },
  capitulo_id: {
    type: DataTypes.INTEGER,
    references: { model: 'capitulos', key: 'id' },
    comment: 'Comentario a nivel de capítulo'
  },
  libro_id: {
    type: DataTypes.INTEGER,
    references: { model: 'libros', key: 'id' },
    comment: 'Comentario a nivel de libro (introducción)'
  },
  autor: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Autor del comentario'
  },
  fuente: {
    type: DataTypes.STRING(300),
    comment: 'Nombre del comentario bíblico (ej: Matthew Henry)'
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  idioma: {
    type: DataTypes.STRING(50),
    defaultValue: 'Español'
  },
  tipo: {
    type: DataTypes.ENUM('exegetico', 'devocional', 'historico', 'teologico', 'aplicacion'),
    defaultValue: 'exegetico'
  }
}, {
  indexes: [
    { fields: ['versiculo_id'] },
    { fields: ['capitulo_id'] },
    { fields: ['libro_id'] },
    { fields: ['autor'] },
    { fields: ['tipo'] }
  ]
});

module.exports = Comentario;
