import { NodeArvore } from './NodeArvore.jsx';
import './Arvore.css';

export function Arvore({ tarefas, todasTarefas, aoEditar, aoExcluir }) {
  if (tarefas.length === 0) {
    return (
      <p className="estado-centralizado">
        Nenhuma tarefa raiz encontrada. Crie tarefas e organize-as em hierarquias.
      </p>
    );
  }

  return (
    <div>
      <p className="arvore__descricao">
        Mostrando {tarefas.length} tarefa(s) raiz. Clique em ▶ para expandir subtarefas.
      </p>
      {tarefas.map((tarefa) => (
        <NodeArvore
          key={tarefa.id}
          tarefa={tarefa}
          todasTarefas={todasTarefas}
          aoEditar={aoEditar}
          aoExcluir={aoExcluir}
          nivel={0}
        />
      ))}
    </div>
  );
}
