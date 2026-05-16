import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/contextos/ContextoAutenticacao.jsx', () => ({
  usarAutenticacao: () => ({
    usuario: { id: 'u1', nome: 'Teste', email: 'teste@ex.com' },
    sair: vi.fn(),
    atualizarUsuario: vi.fn(),
  }),
}));

vi.mock('../../src/servicos/perfil.js', () => ({
  obterPerfil: vi.fn().mockResolvedValue({ id: 'u1', nome: 'Teste', email: 'teste@ex.com' }),
  atualizarPerfil: vi.fn(),
  trocarSenha: vi.fn(),
}));

vi.mock('../../src/componentes/Cabecalho/Cabecalho.jsx', () => ({
  Cabecalho: () => <div data-testid="cabecalho" />,
}));

import { Perfil } from '../../src/paginas/Perfil/Perfil.jsx';
import * as perfilServico from '../../src/servicos/perfil.js';

function renderizar() {
  return render(
    <MemoryRouter>
      <Perfil />
    </MemoryRouter>
  );
}

describe('Perfil — Dados Pessoais', () => {
  beforeEach(() => {
    perfilServico.obterPerfil.mockResolvedValue({ id: 'u1', nome: 'Teste', email: 'teste@ex.com' });
    perfilServico.atualizarPerfil.mockReset();
    perfilServico.trocarSenha.mockReset();
  });

  it('deve renderizar campos de nome e email', async () => {
    renderizar();
    await waitFor(() => expect(screen.getByLabelText(/^nome$/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
  });

  it('deve preencher campos com dados atuais do usuário', async () => {
    renderizar();
    await waitFor(() => expect(screen.getByDisplayValue('Teste')).toBeInTheDocument());
    expect(screen.getByDisplayValue('teste@ex.com')).toBeInTheDocument();
  });

  it('deve chamar atualizarPerfil com dados do formulário ao salvar', async () => {
    perfilServico.atualizarPerfil.mockResolvedValue({ id: 'u1', nome: 'Novo Nome', email: 'teste@ex.com' });
    renderizar();

    await waitFor(() => screen.getByDisplayValue('Teste'));
    fireEvent.change(screen.getByLabelText(/^nome$/i), { target: { value: 'Novo Nome' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar dados/i }));

    await waitFor(() =>
      expect(perfilServico.atualizarPerfil).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Novo Nome' })
      )
    );
  });

  it('deve exibir mensagem de erro ao falhar ao salvar dados', async () => {
    perfilServico.atualizarPerfil.mockRejectedValue({
      response: { data: { erro: 'Este email já está cadastrado no sistema.' } },
    });
    renderizar();

    await waitFor(() => screen.getByDisplayValue('Teste'));
    fireEvent.click(screen.getByRole('button', { name: /salvar dados/i }));

    await waitFor(() =>
      expect(screen.getByText('Este email já está cadastrado no sistema.')).toBeInTheDocument()
    );
  });
});

describe('Perfil — Alterar Senha', () => {
  it('deve renderizar os três campos de senha', () => {
    renderizar();
    expect(screen.getByLabelText(/senha atual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nova senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar nova senha/i)).toBeInTheDocument();
  });

  it('deve chamar trocarSenha com os três campos ao submeter', async () => {
    perfilServico.trocarSenha.mockResolvedValue({ mensagem: 'Senha atualizada com sucesso.' });
    renderizar();

    fireEvent.change(screen.getByLabelText(/senha atual/i), { target: { value: 'atual1234' } });
    fireEvent.change(screen.getByLabelText(/nova senha/i), { target: { value: 'nova12345' } });
    fireEvent.change(screen.getByLabelText(/confirmar nova senha/i), { target: { value: 'nova12345' } });
    fireEvent.click(screen.getByRole('button', { name: /alterar senha/i }));

    await waitFor(() =>
      expect(perfilServico.trocarSenha).toHaveBeenCalledWith(
        expect.objectContaining({
          senhaAtual: 'atual1234',
          novaSenha: 'nova12345',
          confirmacaoNovaSenha: 'nova12345',
        })
      )
    );
  });

  it('deve exibir erro ao falhar a troca de senha', async () => {
    perfilServico.trocarSenha.mockRejectedValue({
      response: { data: { erro: 'Senha atual incorreta.' } },
    });
    renderizar();

    fireEvent.change(screen.getByLabelText(/senha atual/i), { target: { value: 'errada' } });
    fireEvent.change(screen.getByLabelText(/nova senha/i), { target: { value: 'nova12345' } });
    fireEvent.change(screen.getByLabelText(/confirmar nova senha/i), { target: { value: 'nova12345' } });
    fireEvent.click(screen.getByRole('button', { name: /alterar senha/i }));

    await waitFor(() =>
      expect(screen.getByText('Senha atual incorreta.')).toBeInTheDocument()
    );
  });
});
