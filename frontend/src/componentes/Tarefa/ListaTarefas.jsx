import { CartaoTarefa } from './CartaoTarefa.jsx';

export function ListaTarefas({ tarefas, aoEditar, aoExcluir, carregando, erro }) {
  if (carregando) {
    return <p style={{ textAlign: 'center', color: '#6b7280' }}>Carregando tarefas...</p>;
  }

  if (erro) {
    return <p style={{ textAlign: 'center', color: '#dc2626' }}>{erro}</p>;
  }

  if (tarefas.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>
        Nenhuma tarefa encontrada. Crie sua primeira tarefa!
      </p>
    );
  }

  return (
    <div>
      {tarefas.map((tarefa) => (
        <CartaoTarefa
          key={tarefa.id}
          tarefa={tarefa}
          aoEditar={aoEditar}
          aoExcluir={aoExcluir}
        />
      ))}
    </div>
  );
}
