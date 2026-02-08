const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Usuario = sequelize.define('Usuario', {
  nome: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  senha: DataTypes.STRING
}, {
  tableName: 'Usuarios'
});

module.exports = Usuario;