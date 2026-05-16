import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

jest.unstable_mockModule('../../src/lib/prisma.js', () => ({
  default: {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const { obterPerfil, atualizarPerfil, trocarSenha } = await import('../../src/servicos/perfilServico.js');
const { default: prisma } = await import('../../src/lib/prisma.js');

describe('perfilServico', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('obterPerfil', () => {
    it('deve retornar dados do usuário sem senha', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        id: 'u1', nome: 'Ana', email: 'ana@ex.com', senha: 'hash',
      });

      const resultado = await obterPerfil('u1');

      expect(resultado.nome).toBe('Ana');
      expect(resultado.email).toBe('ana@ex.com');
      expect(resultado.senha).toBeUndefined();
    });

    it('deve lançar erro se usuário não encontrado', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(obterPerfil('naoexiste')).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('atualizarPerfil', () => {
    it('deve atualizar nome e email com sucesso', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      prisma.usuario.update.mockResolvedValue({
        id: 'u1', nome: 'Novo Nome', email: 'novo@ex.com',
      });

      const resultado = await atualizarPerfil('u1', { nome: 'Novo Nome', email: 'novo@ex.com' });

      expect(resultado.nome).toBe('Novo Nome');
      expect(resultado.senha).toBeUndefined();
    });

    it('deve lançar EMAIL_DUPLICADO quando email pertence a outro usuário', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 'outro', email: 'usado@ex.com' });

      await expect(
        atualizarPerfil('u1', { nome: 'Nome', email: 'usado@ex.com' })
      ).rejects.toMatchObject({ codigo: 'EMAIL_DUPLICADO' });
    });

    it('deve permitir manter o próprio email', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 'u1', email: 'meu@ex.com' });
      prisma.usuario.update.mockResolvedValue({ id: 'u1', nome: 'Nome', email: 'meu@ex.com' });

      const resultado = await atualizarPerfil('u1', { nome: 'Nome', email: 'meu@ex.com' });

      expect(resultado.email).toBe('meu@ex.com');
    });

    it('deve rejeitar nome vazio', async () => {
      await expect(
        atualizarPerfil('u1', { nome: '', email: 'ok@ex.com' })
      ).rejects.toThrow();
    });

    it('deve rejeitar email malformado', async () => {
      await expect(
        atualizarPerfil('u1', { nome: 'Nome', email: 'naoEhEmail' })
      ).rejects.toThrow();
    });
  });

  describe('trocarSenha', () => {
    it('deve trocar senha com dados válidos', async () => {
      const senhaHash = await bcrypt.hash('senhaatual', 12);
      prisma.usuario.findUnique.mockResolvedValue({ id: 'u1', senha: senhaHash });
      prisma.usuario.update.mockResolvedValue({ id: 'u1' });

      const resultado = await trocarSenha('u1', {
        senhaAtual: 'senhaatual',
        novaSenha: 'novasenha123',
        confirmacaoNovaSenha: 'novasenha123',
      });

      expect(resultado.mensagem).toContain('sucesso');
    });

    it('deve rejeitar quando senha atual está incorreta', async () => {
      const senhaHash = await bcrypt.hash('senhaatual', 12);
      prisma.usuario.findUnique.mockResolvedValue({ id: 'u1', senha: senhaHash });

      await expect(trocarSenha('u1', {
        senhaAtual: 'senhaerrada',
        novaSenha: 'nova12345',
        confirmacaoNovaSenha: 'nova12345',
      })).rejects.toMatchObject({ codigo: 'SENHA_INCORRETA' });
    });

    it('deve rejeitar quando senhas não coincidem', async () => {
      await expect(trocarSenha('u1', {
        senhaAtual: 'atual',
        novaSenha: 'nova12345',
        confirmacaoNovaSenha: 'diferente',
      })).rejects.toMatchObject({ codigo: 'SENHAS_NAO_COINCIDEM' });
    });

    it('deve rejeitar nova senha com menos de 8 caracteres', async () => {
      await expect(trocarSenha('u1', {
        senhaAtual: 'atual',
        novaSenha: 'curta',
        confirmacaoNovaSenha: 'curta',
      })).rejects.toThrow();
    });
  });
});
