import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usarAutenticacao } from '../../contextos/ContextoAutenticacao.jsx';
import * as autenticacaoServico from '../../servicos/autenticacao.js';

export function Entrar() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { entrar } = usarAutenticacao();
  const navegar = useNavigate();
  const { state } = useLocation();
  const mensagemSucesso = state?.mensagem || '';

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      const { usuario, token } = await autenticacaoServico.entrar(email, senha);
      entrar(usuario, token);
      navegar('/');
    } catch (ex) {
      setErro(ex.response?.data?.erro || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-autenticacao">
      <div className="pagina-autenticacao__cartao">
        <div className="pagina-autenticacao__cabecalho">
          <div className="pagina-autenticacao__marca">OT</div>
          <h1 className="pagina-autenticacao__titulo">Bem-vindo de volta</h1>
          <p className="pagina-autenticacao__subtitulo">
            Faça login para acessar suas tarefas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="pagina-autenticacao__formulario">
          <div className="pagina-autenticacao__campo-grupo">
            <label htmlFor="email" className="rotulo">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="campo"
            />
          </div>

          <div className="pagina-autenticacao__campo-grupo">
            <label htmlFor="senha" className="rotulo">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="campo"
            />
          </div>

          {mensagemSucesso && <p className="pagina-autenticacao__mensagem-sucesso">{mensagemSucesso}</p>}
          {erro && <p className="mensagem-erro">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="botao botao--primario pagina-autenticacao__botao-submit"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>

          <hr className="pagina-autenticacao__divisor" />

          <p className="pagina-autenticacao__rodape">
            Não tem conta? <Link to="/registrar">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
