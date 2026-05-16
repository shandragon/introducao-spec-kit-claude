const CORES_STATUS = {
  PENDENTE: { fundo: '#fef3c7', texto: '#92400e', rotulo: 'Pendente' },
  EM_PLANEJAMENTO: { fundo: '#dbeafe', texto: '#1e40af', rotulo: 'Em Planejamento' },
  EM_EXECUCAO: { fundo: '#dcfce7', texto: '#166534', rotulo: 'Em Execução' },
  CONCLUIDA: { fundo: '#f3f4f6', texto: '#6b7280', rotulo: 'Concluída' },
};

export function CartaoTarefa({ tarefa, aoEditar, aoExcluir }) {
  const estiloStatus = CORES_STATUS[tarefa.status] || CORES_STATUS.PENDENTE;

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 8,
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            textDecoration: tarefa.status === 'CONCLUIDA' ? 'line-through' : 'none',
            opacity: tarefa.status === 'CONCLUIDA' ? 0.6 : 1,
          }}
        >
          {tarefa.titulo}
        </p>
        {tarefa.data && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            {tarefa.data.slice(0, 10).split('-').reverse().join('/')}
            {tarefa.horarioInicio && (
              <span> · {tarefa.horarioInicio}
                {tarefa.duracaoFormatada && ` (${tarefa.duracaoFormatada})`}
              </span>
            )}
          </p>
        )}
        <span
          style={{
            display: 'inline-block',
            marginTop: 6,
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: 12,
            background: estiloStatus.fundo,
            color: estiloStatus.texto,
          }}
        >
          {estiloStatus.rotulo}
        </span>
        {tarefa.quantidadeFilhas > 0 && (
          <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>
            {tarefa.progressoFilhas?.concluidas}/{tarefa.quantidadeFilhas} subtarefas
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => aoEditar(tarefa)} aria-label="Editar tarefa">
          ✏️
        </button>
        <button onClick={() => aoExcluir(tarefa)} aria-label="Excluir tarefa">
          🗑️
        </button>
      </div>
    </div>
  );
}
