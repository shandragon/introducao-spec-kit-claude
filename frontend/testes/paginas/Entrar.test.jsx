import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Entrar } from '../../src/paginas/Entrar/Entrar.jsx';
import { ProvedorAutenticacao } from '../../src/contextos/ContextoAutenticacao.jsx';

vi.mock('../../src/servicos/autenticacao.js', () => ({
  entrar: vi.fn(),
}));

const mockNavegar = vi.fn();
vi.mock('react-router-dom', async (original) => ({
  ...(await original()),
  useNavigate: () => mockNavegar,
}));

import * as autenticacaoServico from '../../src/servicos/autenticacao.js';

function renderizar() {
  return render(
    <ProvedorAutenticacao>
      <MemoryRouter>
        <Entrar />
      </MemoryRouter>
    </ProvedorAutenticacao>
  );
}

describe('Entrar', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deve renderizar formulário de login', () => {
    renderizar();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve navegar para / após login bem-sucedido', async () => {
    autenticacaoServico.entrar.mockResolvedValue({ usuario: { id: '1', nome: 'Ana', email: 'ana@ex.com' }, token: 'tok' });
    renderizar();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ana@ex.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha1234' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(mockNavegar).toHaveBeenCalledWith('/'));
  });

  it('deve exibir mensagem de erro em credenciais inválidas', async () => {
    autenticacaoServico.entrar.mockRejectedValue({
      response: { data: { erro: 'Email ou senha incorretos.' } },
    });
    renderizar();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'x@ex.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(screen.getByText(/email ou senha incorretos/i)).toBeInTheDocument());
  });
});
