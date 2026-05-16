import { Router } from 'express';
import { autenticar } from '../middleware/autenticar.js';
import * as controlador from '../controladores/perfilControlador.js';

const roteador = Router();

roteador.use(autenticar);

roteador.get('/', controlador.obterPerfil);
roteador.put('/', controlador.atualizarPerfil);
roteador.put('/senha', controlador.trocarSenha);

export default roteador;
