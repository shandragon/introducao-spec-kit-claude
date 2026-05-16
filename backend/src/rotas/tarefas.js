import { Router } from 'express';
import { autenticar } from '../middleware/autenticar.js';
import * as controlador from '../controladores/tarefasControlador.js';

const roteador = Router();

roteador.use(autenticar);

roteador.get('/', controlador.listar);
roteador.post('/', controlador.criar);
roteador.get('/:id', controlador.buscarPorId);
roteador.put('/:id', controlador.atualizar);
roteador.delete('/:id', controlador.excluir);
roteador.patch('/:id/data', controlador.atualizarData);
roteador.get('/:id/arvore', controlador.buscarArvore);

export default roteador;
