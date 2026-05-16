import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAutenticacao } from '../../contextos/ContextoAutenticacao.jsx';
import { Cabecalho } from '../../componentes/Cabecalho/Cabecalho.jsx';
import * as perfilServico from '../../servicos/perfil.js';
import './Perfil.css';

export function Perfil() {
  const { usuario, sair, atualizarUsuario } = usarAutenticacao();
  const navegar = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erroDados, setErroDados] = useState('');
  const [sucessoDados, setSucessoDados] = useState(false);
  const [salvandoDados, setSalvandoDados] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  useEffect(() => {
    perfilServico.obterPerfil().then((dados) => {
      setNome(dados.nome);
      setEmail(dados.email);
    });
  }, []);

  async function handleSalvarDados(e) {
    e.preventDefault();
    setSalvandoDados(true);
    setErroDados('');
    setSucessoDados(false);
    try {
      const dados = await perfilServico.atualizarPerfil({ nome, email });
      atualizarUsuario(dados);
      setSucessoDados(true);
    } catch (ex) {
      setErroDados(ex.response?.data?.erro || 'Erro ao salvar dados. Tente novamente.');
    } finally {
      setSalvandoDados(false);
    }
  }

  async function handleTrocarSenha(e) {
    e.preventDefault();
    setAlterandoSenha(true);
    setErroSenha('');
    try {
      await perfilServico.trocarSenha({
        senhaAtual,
        novaSenha,
        confirmacaoNovaSenha: confirmacaoSenha,
      });
      sair();
      navegar('/entrar', { state: { mensagem: 'Senha atualizada com sucesso. Faça login novamente.' } });
    } catch (ex) {
      setErroSenha(ex.response?.data?.erro || 'Erro ao alterar senha. Tente novamente.');
    } finally {
      setAlterandoSenha(false);
    }
  }

  return (
    <div className="pagina-principal">
      <Cabecalho usuario={usuario} aoSair={sair} />

      <main className="pagina-principal__container">
        <div className="perfil__secao">
          <h2 className="perfil__titulo-secao">Dados Pessoais</h2>
          <form onSubmit={handleSalvarDados} className="perfil__formulario">
            <div>
              <label htmlFor="nome" className="rotulo">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="campo"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="rotulo">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="campo"
                required
              />
            </div>
            {erroDados && <p className="mensagem-erro">{erroDados}</p>}
            {sucessoDados && <p className="perfil__mensagem-sucesso">Dados atualizados com sucesso.</p>}
            <div className="perfil__formulario-acoes">
              <button type="submit" disabled={salvandoDados} className="botao botao--primario">
                {salvandoDados ? 'Salvando...' : 'Salvar dados'}
              </button>
            </div>
          </form>
        </div>

        <div className="perfil__secao">
          <h2 className="perfil__titulo-secao">Alterar Senha</h2>
          <form onSubmit={handleTrocarSenha} className="perfil__formulario">
            <div>
              <label htmlFor="senhaAtual" className="rotulo">Senha atual</label>
              <input
                id="senhaAtual"
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••••"
                className="campo"
                required
              />
            </div>
            <div>
              <label htmlFor="novaSenha" className="rotulo">Nova senha</label>
              <input
                id="novaSenha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="campo"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmacaoSenha" className="rotulo">Confirmar nova senha</label>
              <input
                id="confirmacaoSenha"
                type="password"
                value={confirmacaoSenha}
                onChange={(e) => setConfirmacaoSenha(e.target.value)}
                placeholder="••••••••"
                className="campo"
                required
              />
            </div>
            {erroSenha && <p className="mensagem-erro">{erroSenha}</p>}
            <div className="perfil__formulario-acoes">
              <button type="submit" disabled={alterandoSenha} className="botao botao--perigo">
                {alterandoSenha ? 'Alterando...' : 'Alterar senha'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
