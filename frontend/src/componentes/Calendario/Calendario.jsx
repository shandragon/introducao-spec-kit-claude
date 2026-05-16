import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './Calendario.css';

moment.locale('pt-br');
const localizador = momentLocalizer(moment);
const CalendarioArrastarSoltar = withDragAndDrop(Calendar);

// Cria Date na meia-noite LOCAL, evitando o desvio de fuso UTC → dia anterior
function parsearDataLocal(dataStr) {
  const [ano, mes, dia] = dataStr.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function tarefaParaEvento(tarefa) {
  const base = tarefa.data ? parsearDataLocal(tarefa.data) : new Date();

  if (tarefa.horarioInicio) {
    const [h, m] = tarefa.horarioInicio.split(':').map(Number);
    base.setHours(h, m, 0, 0);
    const fim = new Date(base);
    fim.setMinutes(fim.getMinutes() + (tarefa.duracao || 60));
    return { id: tarefa.id, title: tarefa.titulo, start: base, end: fim, resource: tarefa };
  }

  return {
    id: tarefa.id,
    title: tarefa.titulo,
    start: base,
    end: base,
    allDay: true,
    resource: tarefa,
  };
}

function EstiloEvento({ event }) {
  const tarefa = event.resource;
  return (
    <div
      className={`evento-calendario evento-calendario--${tarefa.status || 'PENDENTE'}`}
      title={tarefa.titulo}
    >
      {tarefa.horarioInicio && (
        <span className="evento-calendario__horario">{tarefa.horarioInicio}</span>
      )}
      {tarefa.titulo}
    </div>
  );
}

export function Calendario({ tarefas, aoMoverTarefa, aoCriarNaData, aoEditar }) {
  const [dataAtual, setDataAtual] = useState(new Date());

  const tarefasComData = tarefas.filter((t) => t.data);
  const eventos = tarefasComData.map(tarefaParaEvento);

  const aoSoltar = useCallback(
    async ({ event, start }) => {
      const dataFormatada = moment(start).format('YYYY-MM-DD');
      await aoMoverTarefa(event.id, dataFormatada);
    },
    [aoMoverTarefa]
  );

  const aoClicarSlot = useCallback(
    ({ start }) => {
      const dataFormatada = moment(start).format('YYYY-MM-DD');
      aoCriarNaData(dataFormatada);
    },
    [aoCriarNaData]
  );

  const aoClicarEvento = useCallback(
    ({ resource }) => {
      aoEditar(resource);
    },
    [aoEditar]
  );

  return (
    <div className="calendario-container">
      <CalendarioArrastarSoltar
        localizer={localizador}
        events={eventos}
        date={dataAtual}
        onNavigate={setDataAtual}
        defaultView="month"
        views={['month', 'week', 'day']}
        onEventDrop={aoSoltar}
        onSelectSlot={aoClicarSlot}
        onSelectEvent={aoClicarEvento}
        selectable
        resizable={false}
        components={{ event: EstiloEvento }}
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          noEventsInRange: 'Nenhuma tarefa neste período.',
          allDay: 'Sem horário',
        }}
      />
    </div>
  );
}
