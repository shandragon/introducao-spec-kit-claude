import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { criarErro } from '../middleware/tratarErros.js';

const ORDEM_STATUS = ['PENDENTE', 'EM_PLANEJAMENTO', 'EM_EXECUCAO', 'CONCLUIDA'];

const esquemaTarefa = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  data: z.string().datetime({ offset: true }).optional().nullable()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()),
  status: z.enum(['PENDENTE', 'EM_PLANEJAMENTO', 'EM_EXECUCAO', 'CONCLUIDA']).optional(),
  paiId: z.string().optional().nullable(),
});

async function verificarPropriedade(id, usuarioId) {
  const tarefa = await prisma.tarefa.findFirst({
    where: { id, usuarioId },
    include: { filhas: { select: { id: true } } },
  });

  if (!tarefa) {
    throw criarErro('Tarefa não encontrada.', 404, 'NAO_ENCONTRADO');
  }

  return tarefa;
}

async function verificarReferenciaCircular(id, novoPaiId, usuarioId) {
  if (!novoPaiId || novoPaiId === id) {
    if (novoPaiId === id) {
      throw criarErro('Uma tarefa não pode ser filha de si mesma.', 409, 'REFERENCIA_CIRCULAR');
    }
    return;
  }

  let candidato = await prisma.tarefa.findFirst({ where: { id: novoPaiId, usuarioId } });
  while (candidato && candidato.paiId) {
    if (candidato.paiId === id) {
      throw criarErro('Hierarquia circular detectada.', 409, 'REFERENCIA_CIRCULAR');
    }
    candidato = await prisma.tarefa.findFirst({ where: { id: candidato.paiId, usuarioId } });
  }
}

export async function criar(dados, usuarioId) {
  const validado = esquemaTarefa.parse({ titulo: dados.titulo, ...dados });

  if (validado.paiId) {
    await verificarPropriedade(validado.paiId, usuarioId);
  }

  const tarefa = await prisma.tarefa.create({
    data: {
      titulo: validado.titulo,
      data: validado.data ? new Date(validado.data) : null,
      status: validado.status || 'PENDENTE',
      usuarioId,
      paiId: validado.paiId || null,
    },
    include: { filhas: { select: { id: true, titulo: true, status: true } } },
  });

  return tarefa;
}

export async function listar(filtros, usuarioId) {
  const condicoes = { usuarioId };

  if (filtros.mes) {
    const [ano, mes] = filtros.mes.split('-').map(Number);
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);
    condicoes.data = { gte: inicio, lte: fim };
  }

  if (filtros.semData === 'true') {
    condicoes.data = null;
  }

  if (filtros.status) {
    condicoes.status = filtros.status;
  }

  if (filtros.paiId) {
    condicoes.paiId = filtros.paiId;
  }

  const tarefas = await prisma.tarefa.findMany({
    where: condicoes,
    include: { filhas: { select: { id: true, status: true } } },
    orderBy: { criadoEm: 'asc' },
  });

  const ordenadas = tarefas.sort((a, b) => {
    if (a.data && b.data && a.data.getTime() === b.data.getTime()) {
      return ORDEM_STATUS.indexOf(a.status) - ORDEM_STATUS.indexOf(b.status);
    }
    return 0;
  });

  return ordenadas.map((t) => ({
    ...t,
    quantidadeFilhas: t.filhas.length,
    progressoFilhas: {
      total: t.filhas.length,
      concluidas: t.filhas.filter((f) => f.status === 'CONCLUIDA').length,
    },
  }));
}

export async function buscarPorId(id, usuarioId) {
  const tarefa = await prisma.tarefa.findFirst({
    where: { id, usuarioId },
    include: {
      pai: { select: { id: true, titulo: true, status: true } },
      filhas: { select: { id: true, titulo: true, status: true } },
    },
  });

  if (!tarefa) {
    throw criarErro('Tarefa não encontrada.', 404, 'NAO_ENCONTRADO');
  }

  return {
    ...tarefa,
    progressoFilhas: {
      total: tarefa.filhas.length,
      concluidas: tarefa.filhas.filter((f) => f.status === 'CONCLUIDA').length,
    },
  };
}

export async function atualizar(id, dados, usuarioId) {
  await verificarPropriedade(id, usuarioId);

  if (dados.paiId !== undefined) {
    await verificarReferenciaCircular(id, dados.paiId, usuarioId);
    if (dados.paiId) {
      await verificarPropriedade(dados.paiId, usuarioId);
    }
  }

  const campos = {};
  if (dados.titulo !== undefined) campos.titulo = dados.titulo;
  if (dados.data !== undefined) campos.data = dados.data ? new Date(dados.data) : null;
  if (dados.status !== undefined) campos.status = dados.status;
  if (dados.paiId !== undefined) campos.paiId = dados.paiId || null;

  const tarefa = await prisma.tarefa.update({
    where: { id },
    data: campos,
    include: {
      pai: { select: { id: true, titulo: true, status: true } },
      filhas: { select: { id: true, titulo: true, status: true } },
    },
  });

  return tarefa;
}

export async function atualizarData(id, data, usuarioId) {
  await verificarPropriedade(id, usuarioId);

  const tarefa = await prisma.tarefa.update({
    where: { id },
    data: { data: data ? new Date(data) : null },
    select: { id: true, data: true, atualizadoEm: true },
  });

  return tarefa;
}

export async function excluir(id, confirmar, usuarioId) {
  const tarefa = await verificarPropriedade(id, usuarioId);

  if (tarefa.filhas.length > 0 && !confirmar) {
    throw criarErro(
      `Esta tarefa possui ${tarefa.filhas.length} subtarefa(s). Confirme a exclusão para remover todas.`,
      400,
      'CONFIRMACAO_NECESSARIA'
    );
  }

  if (tarefa.filhas.length > 0 && confirmar) {
    await excluirComDescendentes(id, usuarioId);
    return;
  }

  await prisma.tarefa.delete({ where: { id } });
}

async function excluirComDescendentes(id, usuarioId) {
  const filhas = await prisma.tarefa.findMany({
    where: { paiId: id, usuarioId },
    select: { id: true },
  });

  for (const filha of filhas) {
    await excluirComDescendentes(filha.id, usuarioId);
  }

  await prisma.tarefa.delete({ where: { id } });
}

export async function buscarArvore(id, usuarioId) {
  const tarefa = await prisma.tarefa.findFirst({
    where: { id, usuarioId },
    select: { id: true, titulo: true, status: true, data: true, paiId: true },
  });

  if (!tarefa) {
    throw criarErro('Tarefa não encontrada.', 404, 'NAO_ENCONTRADO');
  }

  const filhas = await prisma.tarefa.findMany({
    where: { paiId: id, usuarioId },
    select: { id: true },
  });

  return {
    ...tarefa,
    filhas: await Promise.all(filhas.map((f) => buscarArvore(f.id, usuarioId))),
  };
}
