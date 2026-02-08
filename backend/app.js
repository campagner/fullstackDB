const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const sequelize = require('./models/index');
const usuariosRouter = require('./routes/usuarios');
const controladoresRouter = require('./routes/controladores');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/', authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/controladores', controladoresRouter);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
}).catch(err => console.error('Erro ao sincronizar DB', err));

module.exports = app;