import * as perfilServico from '../servicos/perfilServico.js';

export async function obterPerfil(requisicao, resposta, proximo) {
  try {
    const dados = await perfilServico.obterPerfil(requisicao.usuarioId);
    resposta.status(200).json({ dados });
  } catch (erro) {
    proximo(erro);
  }
}

export async function atualizarPerfil(requisicao, resposta, proximo) {
  try {
    const dados = await perfilServico.atualizarPerfil(requisicao.usuarioId, requisicao.body);
    resposta.status(200).json({ dados });
  } catch (erro) {
    proximo(erro);
  }
}

export async function trocarSenha(requisicao, resposta, proximo) {
  try {
    const dados = await perfilServico.trocarSenha(requisicao.usuarioId, requisicao.body);
    resposta.status(200).json({ dados });
  } catch (erro) {
    proximo(erro);
  }
}
