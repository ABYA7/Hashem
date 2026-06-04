/**
 * Modelo: Versículo
 * Tabla central - contendrá millones de registros
 * Optimizada con índices compuestos para búsquedas rápidas
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Versiculo = sequelize.define('versiculos', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  capitulo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'capitulos', key: 'id' }
  },
  biblia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'biblias', key: 'id' },
    comment: 'Referencia directa para consultas rápidas'
  },
  libro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'libros', key: 'id' },
    comment: 'Referencia directa para consultas rápidas'
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Texto completo del versículo'
  },
  texto_original: {
    type: DataTypes.TEXT,
    comment: 'Texto en idioma original (hebreo/griego)'
  },
  transliteracion: {
    type: DataTypes.TEXT,
    comment: 'Transliteración del texto original'
  },
  notas_traductor: {
    type: DataTypes.TEXT,
    comment: 'Notas del traductor'
  }
}, {
  indexes: [
    // Índice principal para navegación
    { fields: ['biblia_id', 'libro_id', 'capitulo_id', 'numero'] },
    // Índice para búsqueda por capítulo
    { fields: ['capitulo_id', 'numero'] },
    // Índice para búsqueda por libro
    { fields: ['libro_id'] },
    // Índice de texto completo (PostgreSQL)
    {
      fields: ['texto'],
      using: 'gin',
      operator: 'gin_trgm_ops',
      name: 'idx_versiculo_texto_trgm'
    }
  ]
});

module.exports = Versiculo;
