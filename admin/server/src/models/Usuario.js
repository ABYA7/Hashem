/**
 * Modelo: Usuario
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'editor', 'lector'),
    defaultValue: 'lector'
  },
  avatar_url: {
    type: DataTypes.STRING(500)
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimo_acceso: {
    type: DataTypes.DATE
  },
  preferencias: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Biblia preferida, tema, tamaño fuente, etc.'
  }
}, {
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['rol'] }
  ]
});

module.exports = Usuario;
