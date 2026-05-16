import { createContext, useContext, useState } from 'react';

const ContextoAutenticacao = createContext(null);

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  function entrar(dadosUsuario, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  function atualizarUsuario(dadosUsuario) {
    const atualizado = { ...usuario, ...dadosUsuario };
    localStorage.setItem('usuario', JSON.stringify(atualizado));
    setUsuario(atualizado);
  }

  return (
    <ContextoAutenticacao.Provider value={{ usuario, entrar, sair, atualizarUsuario }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

export function usarAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);
  if (!contexto) {
    throw new Error('usarAutenticacao deve ser usado dentro de ProvedorAutenticacao');
  }
  return contexto;
}
