import { useState, useEffect } from 'react';

const STATUS_OPCOES = [
  { valor: 'PENDENTE', rotulo: 'Pendente' },
  { valor: 'EM_PLANEJAMENTO', rotulo: 'Em Planejamento' },
  { valor: 'EM_EXECUCAO', rotulo: 'Em Execução' },
  { valor: 'CONCLUIDA', rotulo: 'Concluída' },
];

export function FormularioTarefa({ tarefaInicial, aoSalvar, aoCancelar, tarefasDisponiveis = [] }) {
  const [titulo, setTitulo] = useState(tarefaInicial?.titulo || '');
  const [data, setData] = useState(
    tarefaInicial?.data ? new Date(tarefaInicial.data).toISOString().slice(0, 10) : ''
  );
  const [status, setStatus] = useState(tarefaInicial?.status || 'PENDENTE');
  const [paiId, setPaiId] = useState(tarefaInicial?.paiId || '');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (tarefaInicial) {
      setTitulo(tarefaInicial.titulo || '');
      setData(tarefaInicial.data ? new Date(tarefaInicial.data).toISOString().slice(0, 10) : '');
      setStatus(tarefaInicial.status || 'PENDENTE');
      setPaiId(tarefaInicial.paiId || '');
    }
  }, [tarefaInicial]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim()) {
      setErro('O título é obrigatório.');
      return;
    }
    setEnviando(true);
    setErro('');
    try {
      await aoSalvar({ titulo: titulo.trim(), data: data || null, status, paiId: paiId || null });
    } catch (ex) {
      setErro(ex.response?.data?.erro || 'Erro ao salvar tarefa.');
    } finally {
      setEnviando(false);
    }
  }

  const estiloInput = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label htmlFor="titulo" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Título *
        </label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da tarefa"
          style={estiloInput}
          required
        />
      </div>

      <div>
        <label htmlFor="data" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Data
        </label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          style={estiloInput}
        />
      </div>

      <div>
        <label htmlFor="status" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={estiloInput}
        >
          {STATUS_OPCOES.map((op) => (
            <option key={op.valor} value={op.valor}>{op.rotulo}</option>
          ))}
        </select>
      </div>

      {tarefasDisponiveis.length > 0 && (
        <div>
          <label htmlFor="pai" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Tarefa pai (opcional)
          </label>
          <select
            id="pai"
            value={paiId}
            onChange={(e) => setPaiId(e.target.value)}
            style={estiloInput}
          >
            <option value="">Nenhuma</option>
            {tarefasDisponiveis
              .filter((t) => t.id !== tarefaInicial?.id)
              .map((t) => (
                <option key={t.id} value={t.id}>{t.titulo}</option>
              ))}
          </select>
        </div>
      )}

      {erro && <p style={{ color: '#dc2626', margin: 0, fontSize: 14 }}>{erro}</p>}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
