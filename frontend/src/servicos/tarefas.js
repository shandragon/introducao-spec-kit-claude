import api from './api.js';

export async function criar(dados) {
  const resposta = await api.post('/api/tarefas', dados);
  return resposta.data.dados.tarefa;
}

export async function listar(filtros = {}) {
  const resposta = await api.get('/api/tarefas', { params: filtros });
  return resposta.data.dados.tarefas;
}

export async function listarPorMes(mes) {
  return listar({ mes });
}

export async function buscar(id) {
  const resposta = await api.get(`/api/tarefas/${id}`);
  return resposta.data.dados.tarefa;
}

export async function atualizar(id, dados) {
  const resposta = await api.put(`/api/tarefas/${id}`, dados);
  return resposta.data.dados.tarefa;
}

export async function atualizarData(id, data) {
  const resposta = await api.patch(`/api/tarefas/${id}/data`, { data });
  return resposta.data.dados.tarefa;
}

export async function excluir(id, confirmar = false) {
  await api.delete(`/api/tarefas/${id}`, { params: { confirmar } });
}

export async function buscarArvore(id) {
  const resposta = await api.get(`/api/tarefas/${id}/arvore`);
  return resposta.data.dados.arvore;
}
