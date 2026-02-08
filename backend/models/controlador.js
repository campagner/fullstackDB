const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Controlador = sequelize.define('Controlador', {
  nome: DataTypes.STRING,
  matricula: DataTypes.STRING,
  criadoPor: DataTypes.STRING,
  editadoPor: DataTypes.STRING
});

module.exports = Controlador;