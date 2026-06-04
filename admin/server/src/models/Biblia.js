/**
 * Modelo: Biblia
 * Diferentes versiones de la Biblia (RVR1960, NVI, KJV, etc.)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Biblia = sequelize.define('biblias', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Nombre de la versión (ej: Reina Valera 1960)'
  },
  abreviatura: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Abreviatura (ej: RVR1960, NVI, KJV)'
  },
  idioma: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Español'
  },
  año: {
    type: DataTypes.INTEGER,
    comment: 'Año de publicación'
  },
  descripcion: {
    type: DataTypes.TEXT,
    comment: 'Descripción de la versión'
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  indexes: [
    { fields: ['abreviatura'] },
    { fields: ['idioma'] }
  ]
});

module.exports = Biblia;
