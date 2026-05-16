import { Router } from 'express';

const roteador = Router();

roteador.get('/saude', (req, res) => {
  res.json({ status: 'ok' });
});

export default roteador;
