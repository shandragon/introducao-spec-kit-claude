import { Navigate } from 'react-router-dom';
import { usarAutenticacao } from '../../contextos/ContextoAutenticacao.jsx';

export function RotaProtegida({ children }) {
  const { usuario } = usarAutenticacao();

  if (!usuario) {
    return <Navigate to="/entrar" replace />;
  }

  return children;
}
