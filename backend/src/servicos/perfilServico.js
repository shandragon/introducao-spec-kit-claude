import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { criarErro } from '../middleware/tratarErros.js';

const esquemaAtualizarPerfil = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
});

const esquemaTrocarSenha = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
  confirmacaoNovaSenha: z.string(),
});

function formatarUsuario({ id, nome, email }) {
  return { id, nome, email };
}

export async function obterPerfil(usuarioId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw criarErro('Usuário não encontrado.', 404, 'NAO_ENCONTRADO');
  return formatarUsuario(usuario);
}

export async function atualizarPerfil(usuarioId, dados) {
  const validado = esquemaAtualizarPerfil.parse(dados);

  const usuarioComEmail = await prisma.usuario.findUnique({ where: { email: validado.email } });
  if (usuarioComEmail && usuarioComEmail.id !== usuarioId) {
    throw criarErro('Este email já está cadastrado no sistema.', 409, 'EMAIL_DUPLICADO');
  }

  const usuario = await prisma.usuario.update({
    where: { id: usuarioId },
    data: { nome: validado.nome, email: validado.email },
  });

  return formatarUsuario(usuario);
}

export async function trocarSenha(usuarioId, dados) {
  const validado = esquemaTrocarSenha.parse(dados);

  if (validado.novaSenha !== validado.confirmacaoNovaSenha) {
    throw criarErro('A nova senha e a confirmação não coincidem.', 400, 'SENHAS_NAO_COINCIDEM');
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw criarErro('Usuário não encontrado.', 404, 'NAO_ENCONTRADO');

  const senhaCorreta = await bcrypt.compare(validado.senhaAtual, usuario.senha);
  if (!senhaCorreta) {
    throw criarErro('Senha atual incorreta.', 401, 'SENHA_INCORRETA');
  }

  const novaSenhaHash = await bcrypt.hash(validado.novaSenha, 12);
  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { senha: novaSenhaHash },
  });

  return { mensagem: 'Senha atualizada com sucesso. Faça login novamente.' };
}
