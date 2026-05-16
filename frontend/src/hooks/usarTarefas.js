import { useState, useCallback } from 'react';
import * as tarefasServico from '../servicos/tarefas.js';

export function usarTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async (filtros = {}) => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await tarefasServico.listar(filtros);
      setTarefas(dados);
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao carregar tarefas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  const adicionar = useCallback(async (dados) => {
    const nova = await tarefasServico.criar(dados);
    setTarefas((prev) => [...prev, nova]);
    return nova;
  }, []);

  const modificar = useCallback(async (id, dados) => {
    const atualizada = await tarefasServico.atualizar(id, dados);
    setTarefas((prev) => prev.map((t) => (t.id === id ? atualizada : t)));
    return atualizada;
  }, []);

  const moverParaData = useCallback(async (id, data) => {
    const atualizada = await tarefasServico.atualizarData(id, data);
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, data: atualizada.data } : t))
    );
  }, []);

  const remover = useCallback(async (id, confirmar = false) => {
    await tarefasServico.excluir(id, confirmar);
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tarefas, carregando, erro, carregar, adicionar, modificar, moverParaData, remover };
}
