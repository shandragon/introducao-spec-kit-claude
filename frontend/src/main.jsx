import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao } from './contextos/ContextoAutenticacao.jsx';
import { RotaProtegida } from './componentes/RotaProtegida/RotaProtegida.jsx';
import { Entrar } from './paginas/Entrar/Entrar.jsx';
import { Registrar } from './paginas/Registrar/Registrar.jsx';
import { Principal } from './paginas/Principal/Principal.jsx';
import { Perfil } from './paginas/Perfil/Perfil.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProvedorAutenticacao>
      <BrowserRouter>
        <Routes>
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Principal />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RotaProtegida>
                <Perfil />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProvedorAutenticacao>
  </React.StrictMode>
);
