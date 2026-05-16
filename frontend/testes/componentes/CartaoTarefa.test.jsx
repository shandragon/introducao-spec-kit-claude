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
});
