import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

moment.locale('pt-br');
const localizador = momentLocalizer(moment);
const CalendarioArrastarSoltar = withDragAndDrop(Calendar);

const CORES_STATUS = {
  PENDENTE: '#fbbf24',
  EM_PLANEJAMENTO: '#60a5fa',
  EM_EXECUCAO: '#34d399',
  CONCLUIDA: '#9ca3af',
};

function tarefaParaEvento(tarefa) {
  return {
    id: tarefa.id,
    title: tarefa.titulo,
    start: tarefa.data ? new Date(tarefa.data) : new Date(),
    end: tarefa.data ? new Date(tarefa.data) : new Date(),
    resource: tarefa,
  };
}

function EstiloEvento({ event }) {
  const tarefa = event.resource;
  const cor = CORES_STATUS[tarefa.status] || CORES_STATUS.PENDENTE;
  return (
    <div
      style={{
        background: cor,
        opacity: tarefa.status === 'CONCLUIDA' ? 0.5 : 1,
        textDecoration: tarefa.status === 'CONCLUIDA' ? 'line-through' : 'none',
        color: '#111',
        padding: '1px 4px',
        borderRadius: 3,
        fontSize: 12,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
      title={tarefa.titulo}
    >
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
    <div style={{ height: 600 }}>
      <CalendarioArrastarSoltar
        localizer={localizador}
        events={eventos}
        date={dataAtual}
        onNavigate={setDataAtual}
        defaultView="month"
        views={['month']}
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
          noEventsInRange: 'Nenhuma tarefa neste período.',
        }}
      />
    </div>
  );
}
