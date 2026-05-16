import { Link } from 'react-router-dom';
import './Cabecalho.css';

export function Cabecalho({ usuario, aoSair }) {
  return (
    <header className="pagina-principal__topbar">
      <div className="pagina-principal__topbar-conteudo">
        <Link to="/" className="cabecalho__link-home">
          <h1 className="pagina-principal__titulo">Organizador de Tarefas</h1>
        </Link>
        <div className="pagina-principal__usuario">
          <Link to="/perfil" className="cabecalho__nome-usuario">
            Olá, {usuario?.nome}
          </Link>
          <button onClick={aoSair} className="botao botao--neutro">Sair</button>
        </div>
      </div>
    </header>
  );
}
