# Tarefas: Perfil do Usuário

**Input**: Documentos de design em `/specs/003-perfil-usuario/`
**Pré-requisitos**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅

**TDD obrigatório** (Princípio II da constituição): testes DEVEM ser escritos antes de qualquer implementação e DEVEM falhar antes do código de produção existir.

---

## Formato: `[ID] [P?] [Story?] Descrição com caminho do arquivo`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: história de usuário correspondente (US1, US2)

---

## Fase 1: Fundacional (pré-requisito para ambas as histórias)

**Propósito**: Infraestrutura compartilhada que bloqueia todas as histórias de usuário.

**⚠️ CRÍTICO**: Nenhuma história pode começar antes desta fase estar completa.

- [x] T001 [P] Extrair componente `Cabecalho` de `Principal.jsx` para `frontend/src/componentes/Cabecalho/Cabecalho.jsx` + `Cabecalho.css` (props: `usuario`, `aoSair`); atualizar `Principal.jsx` para importar e usar `<Cabecalho>`
- [x] T002 Adicionar função `atualizarUsuario(dados)` ao `ProvedorAutenticacao` em `frontend/src/contextos/ContextoAutenticacao.jsx` — atualiza estado e `localStorage` sem logout
- [x] T003 [P] Criar `backend/src/rotas/perfil.js` com `Router` e montar em `backend/src/index.js` sob o middleware `autenticar` no prefixo `/api/perfil`
- [x] T004 [P] Criar `backend/src/servicos/perfilServico.js` e `backend/src/controladores/perfilControlador.js` com todos os exports necessários

**Checkpoint**: Cabecalho reutilizável, contexto com atualizarUsuario, rota /api/perfil registrada — histórias podem começar em paralelo.

---

## Fase 2: História de Usuário 1 — Editar Nome e E-mail (Prioridade: P1) 🎯 MVP

**Objetivo**: Usuário autenticado acessa `/perfil`, vê nome e e-mail atuais, edita e salva. Nome é refletido no cabeçalho imediatamente.

**Teste Independente**: Fazer login → navegar para `/perfil` → alterar nome → salvar → verificar novo nome no cabeçalho sem reload. Testar também rejeição de nome vazio e e-mail duplicado.

### Testes para US1 ⚠️ — escrever ANTES, garantir que FALHAM

- [x] T005 [P] [US1] Escrever testes de contrato para `GET /api/perfil` e `PUT /api/perfil` em `backend/testes/contrato/perfil.test.js`
- [x] T006 [P] [US1] Escrever testes unitários para `perfilServico.obterPerfil` e `perfilServico.atualizarPerfil` em `backend/testes/unidade/perfilServico.test.js`
- [x] T007 [P] [US1] Escrever teste de componente para a seção de dados pessoais da página `Perfil` em `frontend/testes/componentes/Perfil.test.jsx`

### Implementação de US1

- [x] T008 [US1] Implementar `perfilServico.obterPerfil(usuarioId)` em `backend/src/servicos/perfilServico.js`
- [x] T009 [US1] Implementar `perfilServico.atualizarPerfil(usuarioId, { nome, email })` em `backend/src/servicos/perfilServico.js`
- [x] T010 [US1] Implementar `perfilControlador.obterPerfil` e `perfilControlador.atualizarPerfil` em `backend/src/controladores/perfilControlador.js` e registrar `GET /` e `PUT /` em `backend/src/rotas/perfil.js`
- [x] T011 [P] [US1] Criar `frontend/src/servicos/perfil.js` com funções `obterPerfil()` e `atualizarPerfil(dados)`
- [x] T012 [US1] Criar `frontend/src/paginas/Perfil/Perfil.jsx` com seção "Dados Pessoais"
- [x] T013 [US1] Criar `frontend/src/paginas/Perfil/Perfil.css`
- [x] T014 [US1] Registrar rota `/perfil` com `<RotaProtegida>` em `frontend/src/main.jsx` e adicionar link no nome do usuário em `Cabecalho.jsx` apontando para `/perfil`

**Checkpoint**: US1 funcional e testável de forma independente. Salvar dados pessoais atualiza o cabeçalho sem reload.

---

## Fase 3: História de Usuário 2 — Trocar Senha (Prioridade: P2)

**Objetivo**: Usuário preenche senha atual, nova senha e confirmação. Em caso de sucesso, sessão é encerrada e usuário é redirecionado ao login.

**Teste Independente**: Fazer login → ir para `/perfil` → preencher campos de senha → confirmar troca → verificar redirecionamento para `/entrar`.

### Testes para US2 ⚠️ — escrever ANTES, garantir que FALHAM

- [x] T015 [P] [US2] Escrever testes de contrato para `PUT /api/perfil/senha` em `backend/testes/contrato/perfil.test.js`
- [x] T016 [P] [US2] Escrever testes unitários para `perfilServico.trocarSenha` em `backend/testes/unidade/perfilServico.test.js`
- [x] T017 [P] [US2] Escrever teste de componente para a seção de alterar senha em `frontend/testes/componentes/Perfil.test.jsx`

### Implementação de US2

- [x] T018 [US2] Implementar `perfilServico.trocarSenha` em `backend/src/servicos/perfilServico.js`
- [x] T019 [US2] Implementar `perfilControlador.trocarSenha` e registrar `PUT /senha` em `backend/src/rotas/perfil.js`
- [x] T020 [US2] Adicionar função `trocarSenha(dados)` em `frontend/src/servicos/perfil.js`
- [x] T021 [US2] Adicionar seção "Alterar Senha" em `frontend/src/paginas/Perfil/Perfil.jsx`

**Checkpoint**: US1 e US2 funcionando de forma independente. Trocar senha encerra sessão e redireciona ao login.

---

## Fase Final: Polimento

- [x] T022 [P] Verificar conformidade com Princípio VI: sem inline style e sem `!important` em arquivos do perfil
- [x] T023 [P] Verificar cobertura de testes ≥ 80% nos arquivos de serviço e controlador

---

## Dependências e Ordem de Execução

### Dependências entre fases

- **Fundacional (Fase 1)**: sem dependências — iniciar imediatamente
- **US1 (Fase 2)**: depende da Fase 1 completa (T001–T004)
- **US2 (Fase 3)**: depende da Fase 1 completa; pode iniciar em paralelo com US1 após Fase 1
- **Polimento (Fase Final)**: depende de US1 e US2 completas

### Oportunidades de paralelismo

```
# Fase 1 — paralelizar por arquivo:
T001 (Cabecalho)  ||  T002 (Contexto)  ||  T003 (Rota)  ||  T004 (Service/Controller)

# Fases 2 e 3:
Backend US1: T005 || T006  →  T008  →  T009  →  T010
Frontend US1: T007 → T012 → T014  ||  T011 (independente)

Backend US2: T015 || T016  →  T018  →  T019
Frontend US2: T017 → T021  ||  T020 (independente)
```

---

## Notas

- `[P]` = tarefas em arquivos diferentes sem dependências incompletas
- Todo teste DEVE falhar antes de qualquer linha de produção ser escrita (Princípio II)
- Commits após cada tarefa ou grupo lógico com mensagem semântica em português
- Princípio VI: todos os estilos via CSS externo — nenhum `style={{}}` estático no JSX
