import { useState } from 'react';
import { CartaoTarefa } from '../Tarefa/CartaoTarefa.jsx';
import './Arvore.css';

export function NodeArvore({ tarefa, todasTarefas, aoEditar, aoExcluir, nivel = 0 }) {
  const [expandido, setExpandido] = useState(true);

  const filhas = todasTarefas.filter((t) => t.paiId === tarefa.id);
  const temFilhas = filhas.length > 0;

  const progressoFilhas = temFilhas
    ? {
        total: filhas.length,
        concluidas: filhas.filter((f) => f.status === 'CONCLUIDA').length,
      }
    : null;

  return (
    <div style={{ marginLeft: nivel * 24 }}>
      <div className="node-arvore__linha">
        {temFilhas ? (
          <button
            onClick={() => setExpandido((e) => !e)}
            aria-label={expandido ? 'Colapsar' : 'Expandir'}
            className="node-arvore__toggle"
          >
            {expandido ? '▼' : '▶'}
          </button>
        ) : (
          <span className="node-arvore__espacador" />
        )}
        <div className="node-arvore__conteudo">
          <CartaoTarefa
            tarefa={{ ...tarefa, quantidadeFilhas: filhas.length, progressoFilhas }}
            aoEditar={aoEditar}
            aoExcluir={aoExcluir}
          />
        </div>
      </div>

      {expandido && temFilhas && (
        <div>
          {filhas.map((filha) => (
            <NodeArvore
              key={filha.id}
              tarefa={filha}
              todasTarefas={todasTarefas}
              aoEditar={aoEditar}
              aoExcluir={aoExcluir}
              nivel={nivel + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
