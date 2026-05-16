import jwt from 'jsonwebtoken';

export function autenticar(requisicao, resposta, proximo) {
  const cabecalho = requisicao.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return resposta.status(401).json({
      erro: 'Autenticação necessária. Faça login para continuar.',
      codigo: 'NAO_AUTENTICADO',
    });
  }

  const token = cabecalho.slice(7);

  try {
    const carga = jwt.verify(token, process.env.JWT_SEGREDO);
    requisicao.usuarioId = carga.usuarioId;
    proximo();
  } catch {
    return resposta.status(401).json({
      erro: 'Sessão expirada ou inválida. Faça login novamente.',
      codigo: 'TOKEN_INVALIDO',
    });
  }
}
