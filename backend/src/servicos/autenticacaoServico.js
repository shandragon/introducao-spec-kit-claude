import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { criarErro } from '../middleware/tratarErros.js';

const esquemaRegistro = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

const esquemaLogin = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

function gerarToken(usuarioId) {
  return jwt.sign(
    { usuarioId },
    process.env.JWT_SEGREDO,
    { expiresIn: process.env.JWT_EXPIRACAO || '7d' }
  );
}

function formatarUsuario({ id, nome, email }) {
  return { id, nome, email };
}

export async function registrar(dados) {
  const validado = esquemaRegistro.parse(dados);
  const senhaHash = await bcrypt.hash(validado.senha, 12);

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: validado.email },
  });

  if (usuarioExistente) {
    throw criarErro('Este email já está cadastrado no sistema.', 409, 'EMAIL_DUPLICADO');
  }

  const usuario = await prisma.usuario.create({
    data: {
      nome: validado.nome,
      email: validado.email,
      senha: senhaHash,
    },
  });

  const token = gerarToken(usuario.id);
  return { usuario: formatarUsuario(usuario), token };
}

export async function entrar(dados) {
  const validado = esquemaLogin.parse(dados);

  const usuario = await prisma.usuario.findUnique({
    where: { email: validado.email },
  });

  if (!usuario) {
    throw criarErro('Email ou senha incorretos.', 401, 'CREDENCIAIS_INVALIDAS');
  }

  const senhaCorreta = await bcrypt.compare(validado.senha, usuario.senha);
  if (!senhaCorreta) {
    throw criarErro('Email ou senha incorretos.', 401, 'CREDENCIAIS_INVALIDAS');
  }

  const token = gerarToken(usuario.id);
  return { usuario: formatarUsuario(usuario), token };
}
