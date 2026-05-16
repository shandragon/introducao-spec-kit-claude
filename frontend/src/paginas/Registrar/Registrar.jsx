import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usarAutenticacao } from '../../contextos/ContextoAutenticacao.jsx';
import * as autenticacaoServico from '../../servicos/autenticacao.js';

export function Registrar() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { entrar } = usarAutenticacao();
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      const { usuario, token } = await autenticacaoServico.registrar(nome, email, senha);
      entrar(usuario, token);
      navegar('/');
    } catch (ex) {
      setErro(ex.response?.data?.erro || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-autenticacao">
      <div className="pagina-autenticacao__cartao">
        <div className="pagina-autenticacao__cabecalho">
          <div className="pagina-autenticacao__marca">OT</div>
          <h1 className="pagina-autenticacao__titulo">Criar conta</h1>
          <p className="pagina-autenticacao__subtitulo">
            Preencha os dados para começar a organizar suas tarefas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="pagina-autenticacao__formulario">
          <div className="pagina-autenticacao__campo-grupo">
            <label htmlFor="nome" className="rotulo">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              required
              className="campo"
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
              className="campo"
            />
          </div>

          {erro && <p className="mensagem-erro">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="botao botao--primario pagina-autenticacao__botao-submit"
          >
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>

          <hr className="pagina-autenticacao__divisor" />

          <p className="pagina-autenticacao__rodape">
            Já tem conta? <Link to="/entrar">Fazer login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
