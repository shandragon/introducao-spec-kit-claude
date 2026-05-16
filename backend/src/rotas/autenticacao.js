import { Router } from 'express';
import * as controlador from '../controladores/autenticacaoControlador.js';

const roteador = Router();

roteador.post('/registrar', controlador.registrar);
roteador.post('/entrar', controlador.entrar);

export default roteador;
