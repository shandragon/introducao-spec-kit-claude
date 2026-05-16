import api from './api.js';

export async function registrar(nome, email, senha) {
  const resposta = await api.post('/api/autenticacao/registrar', { nome, email, senha });
  return resposta.data.dados;
}

export async function entrar(email, senha) {
  const resposta = await api.post('/api/autenticacao/entrar', { email, senha });
  return resposta.data.dados;
}
