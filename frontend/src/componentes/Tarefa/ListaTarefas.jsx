import { CartaoTarefa } from './CartaoTarefa.jsx';

export function ListaTarefas({ tarefas, aoEditar, aoExcluir, carregando, erro }) {
  if (carregando) {
    return <p className="estado-centralizado">Carregando tarefas...</p>;
  }

  if (erro) {
    return <p className="estado-centralizado estado-centralizado--erro">{erro}</p>;
  }

  if (tarefas.length === 0) {
    return (
      <p className="estado-centralizado">
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
