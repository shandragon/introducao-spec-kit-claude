import { useState, useEffect } from 'react';
import { usarAutenticacao } from '../../contextos/ContextoAutenticacao.jsx';
import { usarTarefas } from '../../hooks/usarTarefas.js';
import { ListaTarefas } from '../../componentes/Tarefa/ListaTarefas.jsx';
import { FormularioTarefa } from '../../componentes/Tarefa/FormularioTarefa.jsx';
import { Calendario } from '../../componentes/Calendario/Calendario.jsx';
import { Arvore } from '../../componentes/Arvore/Arvore.jsx';

const ABAS = [
  { id: 'lista', rotulo: 'Lista' },
  { id: 'calendario', rotulo: 'Calendário' },
  { id: 'arvore', rotulo: 'Árvore' },
];

export function Principal() {
  const { usuario, sair } = usarAutenticacao();
  const { tarefas, carregando, erro, carregar, adicionar, modificar, moverParaData, remover } =
    usarTarefas();
  const [abaAtiva, setAbaAtiva] = useState('lista');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dataInicial, setDataInicial] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSalvar(dados) {
    if (tarefaEditando) {
      await modificar(tarefaEditando.id, dados);
    } else {
      await adicionar({ ...dados, data: dataInicial || dados.data });
    }
    setMostrarFormulario(false);
    setTarefaEditando(null);
    setDataInicial(null);
    await carregar();
  }

  function abrirCriacao(data = null) {
    setTarefaEditando(null);
    setDataInicial(data);
    setMostrarFormulario(true);
  }

  function abrirEdicao(tarefa) {
    setTarefaEditando(tarefa);
    setMostrarFormulario(true);
  }

  async function handleExcluir(tarefa) {
    if (tarefa.quantidadeFilhas > 0) {
      setConfirmarExclusao(tarefa);
      return;
    }
    await remover(tarefa.id, false);
    await carregar();
  }

  async function confirmarExclusaoComFilhas() {
    await remover(confirmarExclusao.id, true);
    setConfirmarExclusao(null);
    await carregar();
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Organizador de Tarefas</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Olá, {usuario?.nome}</span>
          <button onClick={sair}>Sair</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            style={{
              padding: '8px 16px',
              background: abaAtiva === aba.id ? '#3b82f6' : '#f3f4f6',
              color: abaAtiva === aba.id ? '#fff' : '#374151',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {aba.rotulo}
          </button>
        ))}
        <button
          onClick={() => abrirCriacao()}
          style={{ marginLeft: 'auto', padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          + Nova Tarefa
        </button>
      </div>

      {mostrarFormulario && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 16px' }}>{tarefaEditando ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <FormularioTarefa
            tarefaInicial={tarefaEditando || (dataInicial ? { data: dataInicial } : null)}
            aoSalvar={handleSalvar}
            aoCancelar={() => { setMostrarFormulario(false); setTarefaEditando(null); }}
            tarefasDisponiveis={tarefas}
          />
        </div>
      )}

      {confirmarExclusao && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <p>
            A tarefa <strong>"{confirmarExclusao.titulo}"</strong> possui{' '}
            {confirmarExclusao.quantidadeFilhas} subtarefa(s). Deseja excluir tudo?
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={confirmarExclusaoComFilhas} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>
              Excluir tudo
            </button>
            <button onClick={() => setConfirmarExclusao(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {abaAtiva === 'lista' && (
        <ListaTarefas
          tarefas={tarefas}
          aoEditar={abrirEdicao}
          aoExcluir={handleExcluir}
          carregando={carregando}
          erro={erro}
        />
      )}

      {abaAtiva === 'calendario' && (
        <Calendario
          tarefas={tarefas}
          aoMoverTarefa={moverParaData}
          aoCriarNaData={abrirCriacao}
          aoEditar={abrirEdicao}
          aoRecarregar={carregar}
        />
      )}

      {abaAtiva === 'arvore' && (
        <Arvore
          tarefas={tarefas.filter((t) => !t.paiId)}
          todasTarefas={tarefas}
          aoEditar={abrirEdicao}
          aoExcluir={handleExcluir}
        />
      )}
    </div>
  );
}
