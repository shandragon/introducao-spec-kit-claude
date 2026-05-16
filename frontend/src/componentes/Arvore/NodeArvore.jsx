import { useState } from 'react';
import { CartaoTarefa } from '../Tarefa/CartaoTarefa.jsx';

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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        {temFilhas ? (
          <button
            onClick={() => setExpandido((e) => !e)}
            aria-label={expandido ? 'Colapsar' : 'Expandir'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              padding: '12px 0',
              flexShrink: 0,
            }}
          >
            {expandido ? '▼' : '▶'}
          </button>
        ) : (
          <span style={{ width: 24, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
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
