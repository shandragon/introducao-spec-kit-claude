import { render, screen, fireEvent } from '@testing-library/react';
import { CartaoTarefa } from '../../src/componentes/Tarefa/CartaoTarefa.jsx';

const tarefaBase = {
  id: 't1',
  titulo: 'Minha Tarefa',
  status: 'PENDENTE',
  data: null,
  quantidadeFilhas: 0,
  progressoFilhas: { total: 0, concluidas: 0 },
};

describe('CartaoTarefa', () => {
  it('deve exibir o título da tarefa', () => {
    render(<CartaoTarefa tarefa={tarefaBase} aoEditar={() => {}} aoExcluir={() => {}} />);
    expect(screen.getByText('Minha Tarefa')).toBeInTheDocument();
  });

  it('deve exibir o rótulo do status', () => {
    render(<CartaoTarefa tarefa={tarefaBase} aoEditar={() => {}} aoExcluir={() => {}} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve chamar aoEditar ao clicar no botão de editar', () => {
    const aoEditar = vi.fn();
    render(<CartaoTarefa tarefa={tarefaBase} aoEditar={aoEditar} aoExcluir={() => {}} />);
    fireEvent.click(screen.getByLabelText('Editar tarefa'));
    expect(aoEditar).toHaveBeenCalledWith(tarefaBase);
  });

  it('deve aplicar estilo de tarefa concluída', () => {
    const concluida = { ...tarefaBase, status: 'CONCLUIDA' };
    render(<CartaoTarefa tarefa={concluida} aoEditar={() => {}} aoExcluir={() => {}} />);
    expect(screen.getByText('Concluída')).toBeInTheDocument();
  });

  it('deve exibir horário de início quando presente', () => {
    const comHorario = { ...tarefaBase, horarioInicio: '14:30', duracaoFormatada: '1h' };
    render(<CartaoTarefa tarefa={comHorario} aoEditar={() => {}} aoExcluir={() => {}} />);
    expect(screen.getByText(/14:30/)).toBeInTheDocument();
    expect(screen.getByText(/1h/)).toBeInTheDocument();
  });

  it('não deve exibir linha de horário quando ausente', () => {
    render(<CartaoTarefa tarefa={tarefaBase} aoEditar={() => {}} aoExcluir={() => {}} />);
    expect(screen.queryByText(/:/)).not.toBeInTheDocument();
  });
});
