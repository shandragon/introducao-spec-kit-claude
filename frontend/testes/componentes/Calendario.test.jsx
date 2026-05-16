import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Calendario } from '../../src/componentes/Calendario/Calendario.jsx';

vi.mock('react-big-calendar', async () => {
  const original = await vi.importActual('react-big-calendar');
  return {
    ...original,
    Calendar: ({ views, events, messages }) => (
      <div data-testid="calendario-mock">
        <span data-testid="views">{(Array.isArray(views) ? views : Object.keys(views || {})).join(',')}</span>
        <span data-testid="eventos">{events?.length ?? 0}</span>
        {messages && <span data-testid="mensagem-dia">{messages.day}</span>}
      </div>
    ),
  };
});

vi.mock('react-big-calendar/lib/addons/dragAndDrop', () => ({
  default: (Cal) => Cal,
}));

const tarefaComHorario = {
  id: 't1',
  titulo: 'Reunião',
  data: '2026-05-20T00:00:00.000Z',
  horarioInicio: '09:30',
  duracao: 60,
  status: 'PENDENTE',
};

const tarefaSemHorario = {
  id: 't2',
  titulo: 'Tarefa livre',
  data: '2026-05-20T00:00:00.000Z',
  horarioInicio: null,
  duracao: null,
  status: 'PENDENTE',
};

describe('Calendario', () => {
  it('deve renderizar o calendário', () => {
    render(
      <Calendario
        tarefas={[tarefaComHorario]}
        aoMoverTarefa={() => {}}
        aoCriarNaData={() => {}}
        aoEditar={() => {}}
      />
    );
    expect(screen.getByTestId('calendario-mock')).toBeInTheDocument();
  });

  it('deve incluir visões day e week além de month', () => {
    render(
      <Calendario
        tarefas={[]}
        aoMoverTarefa={() => {}}
        aoCriarNaData={() => {}}
        aoEditar={() => {}}
      />
    );
    const views = screen.getByTestId('views').textContent;
    expect(views).toContain('month');
    expect(views).toContain('week');
    expect(views).toContain('day');
  });

  it('deve exibir eventos no calendário', () => {
    render(
      <Calendario
        tarefas={[tarefaComHorario, tarefaSemHorario]}
        aoMoverTarefa={() => {}}
        aoCriarNaData={() => {}}
        aoEditar={() => {}}
      />
    );
    expect(screen.getByTestId('eventos').textContent).toBe('2');
  });
});
