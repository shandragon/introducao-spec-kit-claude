import { useState, useEffect } from 'react';
import './FormularioTarefa.css';

const STATUS_OPCOES = [
  { valor: 'PENDENTE', rotulo: 'Pendente' },
  { valor: 'EM_PLANEJAMENTO', rotulo: 'Em Planejamento' },
  { valor: 'EM_EXECUCAO', rotulo: 'Em Execução' },
  { valor: 'CONCLUIDA', rotulo: 'Concluída' },
];

function calcularHorarioFimLocal(horarioInicio, duracao) {
  if (!horarioInicio || !duracao) return null;
  const [h, m] = horarioInicio.split(':').map(Number);
  const total = h * 60 + m + Number(duracao);
  const hf = Math.floor(total / 60);
  const mf = total % 60;
  return `${String(hf).padStart(2, '0')}:${String(mf).padStart(2, '0')}`;
}

export function FormularioTarefa({ tarefaInicial, aoSalvar, aoCancelar, tarefasDisponiveis = [] }) {
  const [titulo, setTitulo] = useState(tarefaInicial?.titulo || '');
  const [data, setData] = useState(
    tarefaInicial?.data ? tarefaInicial.data.slice(0, 10) : ''
  );
  const [status, setStatus] = useState(tarefaInicial?.status || 'PENDENTE');
  const [paiId, setPaiId] = useState(tarefaInicial?.paiId || '');
  const [horarioInicio, setHorarioInicio] = useState(tarefaInicial?.horarioInicio || '');
  const [duracao, setDuracao] = useState(tarefaInicial?.duracao ? String(tarefaInicial.duracao) : '');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const horarioFim = calcularHorarioFimLocal(horarioInicio, duracao);

  useEffect(() => {
    if (tarefaInicial) {
      setTitulo(tarefaInicial.titulo || '');
      setData(tarefaInicial.data ? tarefaInicial.data.slice(0, 10) : '');
      setStatus(tarefaInicial.status || 'PENDENTE');
      setPaiId(tarefaInicial.paiId || '');
      setHorarioInicio(tarefaInicial.horarioInicio || '');
      setDuracao(tarefaInicial.duracao ? String(tarefaInicial.duracao) : '');
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
      await aoSalvar({
        titulo: titulo.trim(),
        data: data || null,
        status,
        paiId: paiId || null,
        horarioInicio: horarioInicio || null,
        duracao: duracao ? Number(duracao) : null,
      });
    } catch (ex) {
      setErro(ex.response?.data?.erro || 'Erro ao salvar tarefa.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="formulario-tarefa">
      <div>
        <label htmlFor="titulo" className="rotulo">
          Título *
        </label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da tarefa"
          className="campo"
          required
        />
      </div>

      <div>
        <label htmlFor="data" className="rotulo">
          Data
        </label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="campo"
        />
      </div>

      <div>
        <label htmlFor="status" className="rotulo">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="campo"
        >
          {STATUS_OPCOES.map((op) => (
            <option key={op.valor} value={op.valor}>{op.rotulo}</option>
          ))}
        </select>
      </div>

      <div className="formulario-tarefa__linha">
        <div>
          <label htmlFor="horarioInicio" className="rotulo">
            Horário de início
          </label>
          <input
            id="horarioInicio"
            type="time"
            value={horarioInicio}
            onChange={(e) => setHorarioInicio(e.target.value)}
            className="campo"
          />
        </div>
        <div>
          <label htmlFor="duracao" className="rotulo">
            Duração (min)
          </label>
          <input
            id="duracao"
            type="number"
            min="1"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Ex.: 90"
            className="campo"
          />
        </div>
      </div>

      {horarioFim && (
        <p className="formulario-tarefa__horario-fim">
          Término: <strong>{horarioFim}</strong>
        </p>
      )}

      {tarefasDisponiveis.length > 0 && (
        <div>
          <label htmlFor="pai" className="rotulo">
            Tarefa pai (opcional)
          </label>
          <select
            id="pai"
            value={paiId}
            onChange={(e) => setPaiId(e.target.value)}
            className="campo"
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

      {erro && <p className="mensagem-erro">{erro}</p>}

      <div className="formulario-tarefa__acoes">
        <button type="button" onClick={aoCancelar} disabled={enviando} className="botao botao--neutro">
          Cancelar
        </button>
        <button type="submit" disabled={enviando} className="botao botao--primario">
          {enviando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
