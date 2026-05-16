import * as autenticacaoServico from '../servicos/autenticacaoServico.js';

export async function registrar(requisicao, resposta, proximo) {
  try {
    const resultado = await autenticacaoServico.registrar(requisicao.body);
    resposta.status(201).json({ dados: resultado });
  } catch (erro) {
    proximo(erro);
  }
}

export async function entrar(requisicao, resposta, proximo) {
  try {
    const resultado = await autenticacaoServico.entrar(requisicao.body);
    resposta.status(200).json({ dados: resultado });
  } catch (erro) {
    proximo(erro);
  }
}
