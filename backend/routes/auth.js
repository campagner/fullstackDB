const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { hashSenha, compareSenha } = require('../utils/crypto');

const SECRET = process.env.SECRET || 'sua_chave_secreta';

router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = hashSenha(senha);
    const novo = await Usuario.create({ nome, email, senha: senhaHash });
    const { senha: _senha, ...safe } = novo.toJSON();
    res.json(safe);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const ok = compareSenha(senha, usuario.senha);
    if (!ok) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, SECRET, { expiresIn: '6h' });
    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;