import express from 'express';
import cors from 'cors';
import rotasAutenticacao from './rotas/autenticacao.js';
import rotasTarefas from './rotas/tarefas.js';
import rotasPerfil from './rotas/perfil.js';
import rotaSaude from './rotas/saude.js';
import { tratarErros } from './middleware/tratarErros.js';

const aplicacao = express();

aplicacao.use(cors());
aplicacao.use(express.json());

aplicacao.use('/api/autenticacao', rotasAutenticacao);
aplicacao.use('/api/tarefas', rotasTarefas);
aplicacao.use('/api/perfil', rotasPerfil);
aplicacao.use('/api', rotaSaude);

aplicacao.use(tratarErros);

const PORTA = process.env.PORT || 3000;
aplicacao.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});

export default aplicacao;
