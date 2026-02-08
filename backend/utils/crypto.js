const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function hashSenha(senha) {
  return bcrypt.hashSync(senha, SALT_ROUNDS);
}

function compareSenha(senha, hash) {
  return bcrypt.compareSync(senha, hash);
}

module.exports = { hashSenha, compareSenha };