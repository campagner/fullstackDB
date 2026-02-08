const express = require('express');
const router = express.Router();
const Controlador = require('../models/controlador');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  const novo = await Controlador.create({
    ...req.body,
    criadoPor: req.usuario.nome
  });
  res.json(novo);
});

router.get('/', async (req, res) => {
  const controladores = await Controlador.findAll();
  res.json(controladores);
});

router.put('/:id', auth, async (req, res) => {
  await Controlador.update(
    { ...req.body, editadoPor: req.usuario.nome },
    { where: { id: req.params.id } }
  );
  res.sendStatus(204);
});

router.delete('/:id', auth, async (req, res) => {
  await Controlador.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;