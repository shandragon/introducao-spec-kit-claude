import { useState, useEffect } from 'react';
import { usarAutenticacao } from '../../contextos/ContextoAutenticacao.jsx';
import { usarTarefas } from '../../hooks/usarTarefas.js';
import { ListaTarefas } from '../../componentes/Tarefa/ListaTarefas.jsx';
import { FormularioTarefa } from '../../componentes/Tarefa/FormularioTarefa.jsx';
import { Calendario } from '../../componentes/Calendario/Calendario.jsx';
import { Arvore } from '../../componentes/Arvore/Arvore.jsx';
import { Cabecalho } from '../../componentes/Cabecalho/Cabecalho.jsx';
import './Principal.css';

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
    <div className="pagina-principal">
      <Cabecalho usuario={usuario} aoSair={sair} />

      <main className="pagina-principal__container">
        <nav className="pagina-principal__navegacao">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`aba${abaAtiva === aba.id ? ' aba--ativa' : ''}`}
            >
              {aba.rotulo}
            </button>
          ))}
          <button
            onClick={() => abrirCriacao()}
            className="botao botao--sucesso pagina-principal__botao-nova-tarefa"
          >
            + Nova Tarefa
          </button>
        </nav>

        {mostrarFormulario && (
          <div className="pagina-principal__formulario">
            <h2 className="pagina-principal__formulario-titulo">
              {tarefaEditando ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <FormularioTarefa
              tarefaInicial={tarefaEditando || (dataInicial ? { data: dataInicial } : null)}
              aoSalvar={handleSalvar}
              aoCancelar={() => { setMostrarFormulario(false); setTarefaEditando(null); }}
              tarefasDisponiveis={tarefas}
            />
          </div>
        )}

        {confirmarExclusao && (
          <div className="pagina-principal__confirmacao-exclusao">
            <p>
              A tarefa <strong>"{confirmarExclusao.titulo}"</strong> possui{' '}
              {confirmarExclusao.quantidadeFilhas} subtarefa(s). Deseja excluir tudo?
            </p>
            <div className="pagina-principal__confirmacao-acoes">
              <button onClick={confirmarExclusaoComFilhas} className="botao botao--perigo">
                Excluir tudo
              </button>
              <button onClick={() => setConfirmarExclusao(null)} className="botao botao--neutro">Cancelar</button>
            </div>
          </div>
        )}

        <div className="pagina-principal__area-conteudo">
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
      </main>
    </div>
  );
}
