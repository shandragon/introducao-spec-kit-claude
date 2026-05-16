import { jest } from '@jest/globals';

// Mock do PrismaClient
jest.unstable_mockModule('../../src/lib/prisma.js', () => ({
  default: {
    usuario: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const { registrar, entrar } = await import('../../src/servicos/autenticacaoServico.js');
const { default: prisma } = await import('../../src/lib/prisma.js');

describe('autenticacaoServico', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('registrar', () => {
    it('deve criar usuário e retornar token', async () => {
      prisma.usuario.create.mockResolvedValue({
        id: 'id1',
        nome: 'Ana',
        email: 'ana@ex.com',
        senha: 'hash',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      const resultado = await registrar({ nome: 'Ana', email: 'ana@ex.com', senha: 'senha1234' });

      expect(resultado.usuario.email).toBe('ana@ex.com');
      expect(resultado.usuario.senha).toBeUndefined();
      expect(typeof resultado.token).toBe('string');
    });
  });

  describe('entrar', () => {
    it('deve lançar erro para usuário não encontrado', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(entrar({ email: 'x@ex.com', senha: 'abc' })).rejects.toThrow();
    });
  });
});
