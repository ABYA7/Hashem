/**
 * Modelo: Nota de Usuario
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Nota = sequelize.define('notas', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  },
  versiculo_id: {
    type: DataTypes.BIGINT,
    references: { model: 'versiculos', key: 'id' },
    comment: 'Versículo asociado (opcional)'
  },
  titulo: {
    type: DataTypes.STRING(300)
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#FFD700',
    comment: 'Color del resaltado (hex)'
  },
  tipo: {
    type: DataTypes.ENUM('nota', 'resaltado', 'marcador', 'estudio'),
    defaultValue: 'nota'
  },
  etiquetas: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Tags para organización'
  },
  publica: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '¿Visible para otros usuarios?'
  }
}, {
  indexes: [
    { fields: ['usuario_id'] },
    { fields: ['versiculo_id'] },
    { fields: ['tipo'] },
    { using: 'gin', fields: ['etiquetas'] }
  ]
});

module.exports = Nota;
