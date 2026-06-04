/**
 * Modelo: Diccionario Bíblico
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Diccionario = sequelize.define('diccionario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  termino: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Palabra o término'
  },
  termino_original: {
    type: DataTypes.STRING(200),
    comment: 'Término en hebreo/griego'
  },
  transliteracion: {
    type: DataTypes.STRING(200),
    comment: 'Transliteración'
  },
  pronunciacion: {
    type: DataTypes.STRING(200),
    comment: 'Guía de pronunciación'
  },
  definicion: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Definición completa'
  },
  contexto_biblico: {
    type: DataTypes.TEXT,
    comment: 'Uso y contexto en la Biblia'
  },
  numero_strong: {
    type: DataTypes.STRING(20),
    comment: 'Número de Strong (ej: H1234, G5678)'
  },
  idioma_origen: {
    type: DataTypes.ENUM('hebreo', 'griego', 'arameo', 'latin'),
    comment: 'Idioma de origen del término'
  },
  categoria: {
    type: DataTypes.STRING(50),
    comment: 'Persona, Lugar, Concepto, Objeto, etc.'
  }
}, {
  indexes: [
    { fields: ['termino'] },
    { fields: ['numero_strong'] },
    { fields: ['categoria'] },
    { fields: ['idioma_origen'] }
  ]
});

module.exports = Diccionario;
