import * as tarefasServico from '../servicos/tarefasServico.js';

export async function criar(requisicao, resposta, proximo) {
  try {
    const tarefa = await tarefasServico.criar(requisicao.body, requisicao.usuarioId);
    resposta.status(201).json({ dados: { tarefa } });
  } catch (erro) {
    proximo(erro);
  }
}

export async function listar(requisicao, resposta, proximo) {
  try {
    const tarefas = await tarefasServico.listar(requisicao.query, requisicao.usuarioId);
    resposta.status(200).json({ dados: { tarefas } });
  } catch (erro) {
    proximo(erro);
  }
}

export async function buscarPorId(requisicao, resposta, proximo) {
  try {
    const tarefa = await tarefasServico.buscarPorId(requisicao.params.id, requisicao.usuarioId);
    resposta.status(200).json({ dados: { tarefa } });
  } catch (erro) {
    proximo(erro);
  }
}

export async function atualizar(requisicao, resposta, proximo) {
  try {
    const tarefa = await tarefasServico.atualizar(
      requisicao.params.id,
      requisicao.body,
      requisicao.usuarioId
    );
    resposta.status(200).json({ dados: { tarefa } });
  } catch (erro) {
    proximo(erro);
  }
}

export async function atualizarData(requisicao, resposta, proximo) {
  try {
    const tarefa = await tarefasServico.atualizarData(
      requisicao.params.id,
      requisicao.body.data,
      requisicao.usuarioId
    );
    resposta.status(200).json({ dados: { tarefa } });
  } catch (erro) {
    proximo(erro);
  }
}

export async function excluir(requisicao, resposta, proximo) {
  try {
    const confirmar = requisicao.query.confirmar === 'true';
    await tarefasServico.excluir(requisicao.params.id, confirmar, requisicao.usuarioId);
    resposta.status(204).send();
  } catch (erro) {
    proximo(erro);
  }
}

export async function buscarArvore(requisicao, resposta, proximo) {
  try {
    const arvore = await tarefasServico.buscarArvore(
      requisicao.params.id,
      requisicao.usuarioId
    );
    resposta.status(200).json({ dados: { arvore } });
  } catch (erro) {
    proximo(erro);
  }
}
