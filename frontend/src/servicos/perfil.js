import api from './api.js';

export async function obterPerfil() {
  const resposta = await api.get('/api/perfil');
  return resposta.data.dados;
}

export async function atualizarPerfil(dados) {
  const resposta = await api.put('/api/perfil', dados);
  return resposta.data.dados;
}

export async function trocarSenha(dados) {
  const resposta = await api.put('/api/perfil/senha', dados);
  return resposta.data.dados;
}
