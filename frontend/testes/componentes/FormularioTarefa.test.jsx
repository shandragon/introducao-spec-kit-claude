import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormularioTarefa } from '../../src/componentes/Tarefa/FormularioTarefa.jsx';

describe('FormularioTarefa', () => {
  it('deve renderizar campos de título, data e status', () => {
    render(<FormularioTarefa aoSalvar={() => {}} aoCancelar={() => {}} />);
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('deve exibir erro ao tentar salvar sem título', async () => {
    render(<FormularioTarefa aoSalvar={() => {}} aoCancelar={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    await waitFor(() =>
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument()
    );
  });

  it('deve chamar aoSalvar com dados corretos', async () => {
    const aoSalvar = vi.fn().mockResolvedValue();
    render(<FormularioTarefa aoSalvar={aoSalvar} aoCancelar={() => {}} />);

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova Tarefa' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(aoSalvar).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: 'Nova Tarefa' })
      )
    );
  });

  it('deve preencher campos com dados da tarefa inicial', () => {
    const tarefa = { titulo: 'Existente', data: null, status: 'EM_EXECUCAO', paiId: null };
    render(<FormularioTarefa tarefaInicial={tarefa} aoSalvar={() => {}} aoCancelar={() => {}} />);
    expect(screen.getByDisplayValue('Existente')).toBeInTheDocument();
  });

  it('deve renderizar campos de horário de início e duração', () => {
    render(<FormularioTarefa aoSalvar={() => {}} aoCancelar={() => {}} />);
    expect(screen.getByLabelText(/horário de início/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duração/i)).toBeInTheDocument();
  });

  it('deve exibir horário de término calculado ao informar início e duração', () => {
    render(<FormularioTarefa aoSalvar={() => {}} aoCancelar={() => {}} />);
    fireEvent.change(screen.getByLabelText(/horário de início/i), { target: { value: '09:30' } });
    fireEvent.change(screen.getByLabelText(/duração/i), { target: { value: '90' } });
    expect(screen.getByText(/11:00/)).toBeInTheDocument();
  });

  it('deve incluir horarioInicio e duracao ao salvar', async () => {
    const aoSalvar = vi.fn().mockResolvedValue();
    render(<FormularioTarefa aoSalvar={aoSalvar} aoCancelar={() => {}} />);

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Com Horário' } });
    fireEvent.change(screen.getByLabelText(/horário de início/i), { target: { value: '14:00' } });
    fireEvent.change(screen.getByLabelText(/duração/i), { target: { value: '45' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(aoSalvar).toHaveBeenCalledWith(
        expect.objectContaining({ horarioInicio: '14:00', duracao: 45 })
      )
    );
  });
});
