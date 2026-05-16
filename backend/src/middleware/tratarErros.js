export function tratarErros(erro, requisicao, resposta, proximo) {
  console.error(erro);

  if (erro.name === 'ZodError') {
    return resposta.status(400).json({
      erro: 'Dados inválidos. Verifique os campos e tente novamente.',
      codigo: 'DADOS_INVALIDOS',
      detalhes: erro.errors.map((e) => e.message),
    });
  }

  if (erro.codigo === 'P2002') {
    return resposta.status(409).json({
      erro: 'Este registro já existe no sistema.',
      codigo: 'REGISTRO_DUPLICADO',
    });
  }

  if (erro.codigo === 'P2025') {
    return resposta.status(404).json({
      erro: 'Registro não encontrado.',
      codigo: 'NAO_ENCONTRADO',
    });
  }

  const status = erro.status || 500;
  const mensagem = erro.mensagem || 'Ocorreu um erro inesperado. Tente novamente.';

  return resposta.status(status).json({
    erro: mensagem,
    codigo: erro.codigo || 'ERRO_INTERNO',
  });
}

export function criarErro(mensagem, status, codigo) {
  const erro = new Error(mensagem);
  erro.mensagem = mensagem;
  erro.status = status;
  erro.codigo = codigo;
  return erro;
}
