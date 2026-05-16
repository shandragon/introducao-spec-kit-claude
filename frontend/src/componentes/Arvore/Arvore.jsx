import { NodeArvore } from './NodeArvore.jsx';

export function Arvore({ tarefas, todasTarefas, aoEditar, aoExcluir }) {
  if (tarefas.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>
        Nenhuma tarefa raiz encontrada. Crie tarefas e organize-as em hierarquias.
      </p>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
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
