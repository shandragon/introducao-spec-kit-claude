import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/lib/prisma.js', () => ({
  default: {
    tarefa: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const servico = await import('../../src/servicos/tarefasServico.js');
const { default: prisma } = await import('../../src/lib/prisma.js');

const USUARIO_ID = 'usuario1';

describe('tarefasServico', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('criar', () => {
    it('deve criar tarefa com status PENDENTE por padrão', async () => {
      prisma.tarefa.create.mockResolvedValue({
        id: 't1', titulo: 'Nova', status: 'PENDENTE', usuarioId: USUARIO_ID,
        data: null, paiId: null, filhas: [], criadoEm: new Date(), atualizadoEm: new Date(),
      });

      const tarefa = await servico.criar({ titulo: 'Nova' }, USUARIO_ID);
      expect(tarefa.status).toBe('PENDENTE');
    });

    it('deve lançar erro para título vazio', async () => {
      await expect(servico.criar({ titulo: '' }, USUARIO_ID)).rejects.toThrow();
    });
  });

  describe('listar', () => {
    it('deve retornar array de tarefas do usuário', async () => {
      prisma.tarefa.findMany.mockResolvedValue([]);
      const tarefas = await servico.listar({}, USUARIO_ID);
      expect(Array.isArray(tarefas)).toBe(true);
    });
  });

  describe('buscarPorId', () => {
    it('deve lançar erro se tarefa não pertencer ao usuário', async () => {
      prisma.tarefa.findFirst.mockResolvedValue(null);
      await expect(servico.buscarPorId('id-inexistente', USUARIO_ID)).rejects.toThrow();
    });
  });

  describe('atualizar', () => {
    it('deve atualizar campos informados', async () => {
      prisma.tarefa.findFirst.mockResolvedValue({
        id: 't1', usuarioId: USUARIO_ID, filhas: [],
      });
      prisma.tarefa.update.mockResolvedValue({
        id: 't1', titulo: 'Atualizada', status: 'EM_EXECUCAO',
        usuarioId: USUARIO_ID, data: null, paiId: null,
        filhas: [], criadoEm: new Date(), atualizadoEm: new Date(),
      });

      const tarefa = await servico.atualizar('t1', { titulo: 'Atualizada', status: 'EM_EXECUCAO' }, USUARIO_ID);
      expect(tarefa.titulo).toBe('Atualizada');
    });
  });

  describe('excluir', () => {
    it('deve excluir tarefa sem filhas', async () => {
      prisma.tarefa.findFirst.mockResolvedValue({ id: 't1', usuarioId: USUARIO_ID, filhas: [] });
      prisma.tarefa.delete.mockResolvedValue({});

      await expect(servico.excluir('t1', false, USUARIO_ID)).resolves.not.toThrow();
    });

    it('deve lançar erro se tarefa tiver filhas e confirmação não fornecida', async () => {
      prisma.tarefa.findFirst.mockResolvedValue({
        id: 't1', usuarioId: USUARIO_ID, filhas: [{ id: 'f1' }],
      });

      await expect(servico.excluir('t1', false, USUARIO_ID)).rejects.toThrow();
    });
  });
});
