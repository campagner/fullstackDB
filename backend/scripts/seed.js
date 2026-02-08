const sequelize = require('../models/index');
const Usuario = require('../models/usuario');
const Controlador = require('../models/controlador');
const { hashSenha } = require('../utils/crypto');

(async () => {
  try {
    // Recria todas as tabelas
    await sequelize.sync({ force: true });
    console.log('Banco recriado com sucesso.');

    // Cria usuário de teste
    const senhaHash = hashSenha('minhasenha123');
    const usuario = await Usuario.create({
      nome: 'Alexandre',
      email: 'alex@email.com',
      senha: senhaHash
    });

    console.log('Usuário criado:');
    console.log(usuario.toJSON());

    // Cria controladores de teste
    const controladores = await Controlador.bulkCreate([
      {
        nome: 'Carlos Silva',
        matricula: 'CTRL-001',
        criadoPor: 'Alexandre'
      },
      {
        nome: 'Maria Santos',
        matricula: 'CTRL-002',
        criadoPor: 'Alexandre'
      },
      {
        nome: 'João Oliveira',
        matricula: 'CTRL-003',
        criadoPor: 'Alexandre'
      }
    ]);

    console.log('\nControladores criados:');
    controladores.forEach(c => console.log(c.toJSON()));
  } catch (error) {
    console.error('Erro ao recriar banco ou cadastrar dados:', error);
  } finally {
    await sequelize.close();
  }
})();