const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const { hashSenha } = require('../utils/crypto');

router.get('/', async (req, res) => {
  const usuarios = await Usuario.findAll({ attributes: { exclude: ['senha'] } });
  res.json(usuarios);
});

router.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.senha) body.senha = hashSenha(body.senha);
    const novo = await Usuario.create(body);
    const { senha, ...safe } = novo.toJSON();
    res.json(safe);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const update = { ...req.body };
  if (update.senha) update.senha = hashSenha(update.senha);
  await Usuario.update(update, { where: { id: req.params.id } });
  res.sendStatus(204);
});

router.delete('/:id', async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;