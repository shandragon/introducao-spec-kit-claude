import './CartaoTarefa.css';

const ROTULOS_STATUS = {
  PENDENTE: 'Pendente',
  EM_PLANEJAMENTO: 'Em Planejamento',
  EM_EXECUCAO: 'Em Execução',
  CONCLUIDA: 'Concluída',
};

export function CartaoTarefa({ tarefa, aoEditar, aoExcluir }) {
  const rotulo = ROTULOS_STATUS[tarefa.status] || ROTULOS_STATUS.PENDENTE;
  const tituloConcluida = tarefa.status === 'CONCLUIDA' ? ' cartao-tarefa__titulo--concluida' : '';

  return (
    <div className="cartao-tarefa">
      <div className="cartao-tarefa__conteudo">
        <p className={`cartao-tarefa__titulo${tituloConcluida}`}>
          {tarefa.titulo}
        </p>
        {tarefa.data && (
          <p className="cartao-tarefa__meta">
            {tarefa.data.slice(0, 10).split('-').reverse().join('/')}
            {tarefa.horarioInicio && (
              <span> · {tarefa.horarioInicio}
                {tarefa.duracaoFormatada && ` (${tarefa.duracaoFormatada})`}
              </span>
            )}
          </p>
        )}
        <span className={`cartao-tarefa__badge cartao-tarefa__badge--${tarefa.status}`}>
          {rotulo}
        </span>
        {tarefa.quantidadeFilhas > 0 && (
          <span className="cartao-tarefa__subtarefas">
            {tarefa.progressoFilhas?.concluidas}/{tarefa.quantidadeFilhas} subtarefas
          </span>
        )}
      </div>
      <div className="cartao-tarefa__acoes">
        <button onClick={() => aoEditar(tarefa)} aria-label="Editar tarefa" className="botao-icone">
          ✏️
        </button>
        <button onClick={() => aoExcluir(tarefa)} aria-label="Excluir tarefa" className="botao-icone">
          🗑️
        </button>
      </div>
    </div>
  );
}
