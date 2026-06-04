/**
 * Modelo: Referencia Cruzada
 * Conexiones entre versículos relacionados
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const ReferenciaCruzada = sequelize.define('referencias_cruzadas', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  versiculo_origen_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'versiculos', key: 'id' }
  },
  versiculo_destino_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'versiculos', key: 'id' }
  },
  tipo: {
    type: DataTypes.ENUM('paralelo', 'profecia', 'cumplimiento', 'cita', 'tematico', 'historico'),
    defaultValue: 'tematico',
    comment: 'Tipo de relación entre versículos'
  },
  relevancia: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 10 },
    comment: 'Nivel de relevancia (1-10)'
  },
  nota: {
    type: DataTypes.TEXT,
    comment: 'Explicación de la relación'
  }
}, {
  indexes: [
    { fields: ['versiculo_origen_id'] },
    { fields: ['versiculo_destino_id'] },
    { fields: ['tipo'] },
    { fields: ['versiculo_origen_id', 'versiculo_destino_id'], unique: true }
  ]
});

module.exports = ReferenciaCruzada;
