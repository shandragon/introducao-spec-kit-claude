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
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Criar Conta</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="senha">Senha (mínimo 8 caracteres)</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={8}
            required
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        {erro && <p style={{ color: '#dc2626', margin: 0 }}>{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Criando conta...' : 'Registrar'}
        </button>
        <p style={{ textAlign: 'center' }}>
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
