---
description: "Lista de tarefas para implementação do Organizador de Tarefas"
---

# Tarefas: Organizador de Tarefas

**Input**: Documentos de design em `specs/001-organizador-tarefas/`
**Pré-requisitos**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**TDD OBRIGATÓRIO** (Princípio II da Constituição): Testes DEVEM ser escritos e falhar ANTES de qualquer implementação.
Ciclo: Escreva o teste (vermelho) → Implemente o mínimo (verde) → Refatore (mantendo verde).

**Organização**: Tarefas agrupadas por história de usuário para implementação e teste independentes.

## Formato: `[ID] [P?] [Historia?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Historia]**: História de usuário a que a tarefa pertence (US1, US2, US3)
- Incluir caminhos de arquivo exatos nas descrições

## Convenções de Caminhos

- Backend: `backend/src/`, `backend/testes/`, `backend/prisma/`
- Frontend: `frontend/src/`, `frontend/testes/`
- Infra: `docker-compose.yml`, `docker-compose.prod.yml`, `.env.example`

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Propósito**: Inicialização do projeto e estrutura base de todos os serviços

- [x] T001 Criar estrutura de diretórios do projeto conforme plan.md (backend/, frontend/, docker files na raiz)
- [x] T002 [P] Inicializar projeto Node.js do backend com dependências em backend/package.json (express, prisma, jsonwebtoken, bcrypt, zod)
- [x] T003 [P] Inicializar projeto React+Vite do frontend com dependências em frontend/package.json (react-router-dom, @dnd-kit/core, @dnd-kit/sortable, react-big-calendar, axios)
- [x] T004 [P] Criar docker-compose.yml para ambiente de desenvolvimento com volumes sincronizados (backend, frontend, banco)
- [x] T005 [P] Criar docker-compose.prod.yml para ambiente de produção com imagens multi-stage
- [x] T006 [P] Criar backend/Dockerfile.dev para desenvolvimento com nodemon e hot reload
- [x] T007 [P] Criar backend/Dockerfile para produção com multi-stage (build → produção sem devDependencies)
- [x] T008 [P] Criar frontend/Dockerfile.dev para desenvolvimento com Vite HMR
- [x] T009 [P] Criar frontend/Dockerfile para produção com multi-stage (vite build → Nginx servindo estáticos)
- [x] T010 [P] Criar .env.example com todas as variáveis necessárias (DATABASE_URL, JWT_SEGREDO, JWT_EXPIRACAO, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, VITE_API_URL)

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Propósito**: Infraestrutura central que DEVE estar completa antes de qualquer história de usuário

**⚠️ CRÍTICO**: Nenhuma história de usuário pode começar até que esta fase esteja completa

- [x] T011 Criar schema Prisma com models Usuario, Tarefa e enum StatusTarefa conforme data-model.md em backend/prisma/schema.prisma
- [x] T012 Aplicar migração inicial do Prisma criando tabelas `usuarios` e `tarefas` no banco
- [x] T013 Criar entry point da aplicação Express com configurações de middleware e rotas em backend/src/index.js
- [x] T014 [P] Criar middleware de autenticação JWT que valida Bearer token e injeta usuário na requisição em backend/src/middleware/autenticar.js
- [x] T015 [P] Criar middleware global de tratamento de erros com mensagens em português em backend/src/middleware/tratarErros.js
- [x] T016 Criar endpoint de saúde GET /api/saude retornando `{"status": "ok"}` em backend/src/rotas/saude.js
- [x] T017 Criar cliente HTTP do frontend com axios configurado com baseURL e interceptor de token em frontend/src/servicos/api.js
- [x] T018 Criar ContextoAutenticacao com estado do usuário, token JWT e funções entrar/sair em frontend/src/contextos/ContextoAutenticacao.jsx
- [x] T019 [P] Criar componente RotaProtegida que redireciona para login quando não autenticado em frontend/src/componentes/RotaProtegida/RotaProtegida.jsx
- [x] T020 Configurar React Router com rotas (/, /entrar, /registrar) e RotaProtegida em frontend/src/main.jsx

**Ponto de verificação**: Fundação pronta — desenvolvimento das histórias de usuário pode começar em paralelo

---

## Fase 3: História de Usuário 1 — Gerenciar Tarefas Básicas (Prioridade: P1) 🎯 MVP

**Objetivo**: Usuário consegue criar, visualizar, editar, alterar status e excluir tarefas individualmente

**Teste Independente**: Subir apenas backend + banco, criar conta via POST /api/autenticacao/registrar, criar tarefa via POST /api/tarefas, editar via PUT /api/tarefas/:id, excluir via DELETE /api/tarefas/:id

### Testes para HU1 — ESCREVER PRIMEIRO, GARANTIR QUE FALHEM ⚠️

> **OBRIGATÓRIO (Princípio II TDD)**: Escreva estes testes ANTES de qualquer implementação. Confirme que FALHAM antes de prosseguir.

- [x] T021 [P] [US1] Escrever testes de contrato falhando para POST /api/autenticacao/registrar e POST /api/autenticacao/entrar em backend/testes/contrato/autenticacao.test.js
- [x] T022 [P] [US1] Escrever testes de contrato falhando para POST, GET, GET/:id, PUT/:id, DELETE/:id em /api/tarefas em backend/testes/contrato/tarefas.test.js
- [x] T023 [P] [US1] Escrever testes unitários falhando para autenticacaoServico (registrar, entrar, validar token) em backend/testes/unidade/autenticacaoServico.test.js
- [x] T024 [P] [US1] Escrever testes unitários falhando para tarefasServico (criar, listar, buscarPorId, atualizar, excluir) em backend/testes/unidade/tarefasServico.test.js
- [x] T025 [P] [US1] Escrever testes falhando para componente Entrar (formulário, validação, redirecionamento) em frontend/testes/paginas/Entrar.test.jsx
- [x] T026 [P] [US1] Escrever testes falhando para componente Registrar (formulário, validação, redirecionamento) em frontend/testes/paginas/Registrar.test.jsx
- [x] T027 [P] [US1] Escrever testes falhando para FormularioTarefa (criação, edição, campos obrigatórios) em frontend/testes/componentes/FormularioTarefa.test.jsx
- [x] T028 [P] [US1] Escrever testes falhando para CartaoTarefa (exibição de dados, indicador visual de status) em frontend/testes/componentes/CartaoTarefa.test.jsx

### Implementação do Backend — HU1

- [x] T029 [US1] Implementar autenticacaoServico com funções registrar (bcrypt hash) e entrar (bcrypt compare + JWT sign) em backend/src/servicos/autenticacaoServico.js
- [x] T030 [US1] Implementar autenticacaoControlador com handlers de registro e login em backend/src/controladores/autenticacaoControlador.js
- [x] T031 [US1] Registrar rotas POST /api/autenticacao/registrar e POST /api/autenticacao/entrar em backend/src/rotas/autenticacao.js
- [x] T032 [US1] Implementar tarefasServico com funções criar, listar (com filtros), buscarPorId, atualizar, excluir em backend/src/servicos/tarefasServico.js
- [x] T033 [US1] Implementar tarefasControlador com handlers para CRUD de tarefas em backend/src/controladores/tarefasControlador.js
- [x] T034 [US1] Registrar rotas CRUD de tarefas com middleware autenticar em backend/src/rotas/tarefas.js

### Implementação do Frontend — HU1

- [x] T035 [US1] Implementar serviço de autenticação (registrar, entrar) usando api.js em frontend/src/servicos/autenticacao.js
- [x] T036 [US1] Criar página Entrar com formulário de login e integração com ContextoAutenticacao em frontend/src/paginas/Entrar/Entrar.jsx
- [x] T037 [US1] Criar página Registrar com formulário de cadastro e redirecionamento pós-registro em frontend/src/paginas/Registrar/Registrar.jsx
- [x] T038 [US1] Implementar serviço de tarefas (criar, listar, buscar, atualizar, excluir) usando api.js em frontend/src/servicos/tarefas.js
- [x] T039 [US1] Criar hook usarTarefas para gerenciamento de estado e operações de tarefas em frontend/src/hooks/usarTarefas.js
- [x] T040 [US1] Criar componente FormularioTarefa (formulário de criação e edição com campos titulo, data, status) em frontend/src/componentes/Tarefa/FormularioTarefa.jsx
- [x] T041 [US1] Criar componente CartaoTarefa com exibição de dados e indicador visual de status (cor/ícone por status) em frontend/src/componentes/Tarefa/CartaoTarefa.jsx
- [x] T042 [US1] Criar componente ListaTarefas com lista de CartaoTarefa e ações de editar/excluir em frontend/src/componentes/Tarefa/ListaTarefas.jsx
- [x] T043 [US1] Criar página Principal com ListaTarefas integrada e navegação entre visões em frontend/src/paginas/Principal/Principal.jsx

**Ponto de verificação**: HU1 completamente funcional — criar, visualizar, editar e excluir tarefas individualmente. Testar independentemente antes de avançar.

---

## Fase 4: História de Usuário 2 — Calendário com Arrastar e Soltar (Prioridade: P2)

**Objetivo**: Usuário consegue visualizar tarefas no calendário e reorganizá-las entre datas arrastando

**Teste Independente**: Com tarefas já criadas (HU1 funcional), acessar a visão de calendário, verificar que tarefas aparecem nas datas corretas, arrastar para outra data e confirmar que a data foi atualizada

### Testes para HU2 — ESCREVER PRIMEIRO, GARANTIR QUE FALHEM ⚠️

- [x] T044 [P] [US2] Escrever teste de contrato falhando para PATCH /api/tarefas/:id/data em backend/testes/contrato/tarefas.test.js
- [x] T045 [P] [US2] Escrever teste unitário falhando para atualizarData em tarefasServico em backend/testes/unidade/tarefasServico.test.js
- [x] T046 [P] [US2] Escrever testes falhando para componente Calendario (exibição por data, ordenação por status, navegação entre meses) em frontend/testes/componentes/Calendario.test.jsx

### Implementação do Backend — HU2

- [x] T047 [US2] Adicionar função atualizarData ao tarefasServico e handler no tarefasControlador em backend/src/servicos/tarefasServico.js e backend/src/controladores/tarefasControlador.js
- [x] T048 [US2] Registrar rota PATCH /api/tarefas/:id/data com middleware autenticar em backend/src/rotas/tarefas.js

### Implementação do Frontend — HU2

- [x] T049 [US2] Adicionar função listarPorMes ao serviço de tarefas (GET /api/tarefas?mes=YYYY-MM) em frontend/src/servicos/tarefas.js
- [x] T050 [US2] Criar componente Calendario base com react-big-calendar em visão mensal, exibindo tarefas por data em frontend/src/componentes/Calendario/Calendario.jsx
- [x] T051 [US2] Implementar ordenação automática por status (PENDENTE → EM_PLANEJAMENTO → EM_EXECUCAO → CONCLUIDA) no componente Calendario em frontend/src/componentes/Calendario/Calendario.jsx
- [x] T052 [US2] Implementar drag-and-drop no Calendario usando @dnd-kit para atualizar data via PATCH /api/tarefas/:id/data em frontend/src/componentes/Calendario/Calendario.jsx
- [x] T053 [US2] Implementar criação de tarefa pelo clique em dia do calendário (abre FormularioTarefa com data preenchida) em frontend/src/componentes/Calendario/Calendario.jsx
- [x] T054 [US2] Adicionar navegação entre meses (anterior/próximo) ao componente Calendario em frontend/src/componentes/Calendario/Calendario.jsx
- [x] T055 [US2] Integrar aba/visão de Calendário à página Principal em frontend/src/paginas/Principal/Principal.jsx

**Ponto de verificação**: HU1 e HU2 funcionam independentemente. Testar ambas antes de avançar.

---

## Fase 5: História de Usuário 3 — Árvore Hierárquica (Prioridade: P3)

**Objetivo**: Usuário consegue organizar tarefas em hierarquias pai-filho e visualizá-las em árvore expansível

**Teste Independente**: Com tarefas já criadas (HU1 funcional), associar uma tarefa como filha de outra via PUT /api/tarefas/:id, acessar a visão em árvore e verificar o relacionamento com expansão/colapso corretos

### Testes para HU3 — ESCREVER PRIMEIRO, GARANTIR QUE FALHEM ⚠️

- [x] T056 [P] [US3] Escrever teste de contrato falhando para GET /api/tarefas/:id/arvore em backend/testes/contrato/tarefas.test.js
- [x] T057 [P] [US3] Escrever testes unitários falhando para operações de hierarquia em tarefasServico (buscarArvore, associarPai, validarReferênciaCircular, excluirComDescendentes) em backend/testes/unidade/tarefasServico.test.js
- [x] T058 [P] [US3] Escrever testes falhando para componente NodeArvore (expansão, colapso, indentação, indicador de progresso) em frontend/testes/componentes/NodeArvore.test.jsx
- [x] T059 [P] [US3] Escrever testes falhando para componente Arvore (renderização da árvore completa, interações) em frontend/testes/componentes/Arvore.test.jsx

### Implementação do Backend — HU3

- [x] T060 [US3] Implementar buscarArvore (consulta recursiva de descendentes) e validarReferenciaCircular no tarefasServico em backend/src/servicos/tarefasServico.js
- [x] T061 [US3] Atualizar atualizar no tarefasServico para validar referência circular ao definir paiId em backend/src/servicos/tarefasServico.js
- [x] T062 [US3] Atualizar excluir no tarefasServico para exclusão em cascata de todos os descendentes com confirmação em backend/src/servicos/tarefasServico.js
- [x] T063 [US3] Registrar rota GET /api/tarefas/:id/arvore no tarefasControlador e tarefas.js em backend/src/controladores/tarefasControlador.js e backend/src/rotas/tarefas.js

### Implementação do Frontend — HU3

- [x] T064 [US3] Adicionar função buscarArvore ao serviço de tarefas (GET /api/tarefas/:id/arvore) em frontend/src/servicos/tarefas.js
- [x] T065 [US3] Criar componente NodeArvore (nó recursivo com botão expandir/colapsar e indicador de progresso das filhas) em frontend/src/componentes/Arvore/NodeArvore.jsx
- [x] T066 [US3] Criar componente Arvore que carrega e renderiza a árvore de tarefas raiz usando NodeArvore em frontend/src/componentes/Arvore/Arvore.jsx
- [x] T067 [US3] Adicionar seletor de tarefa pai ao FormularioTarefa (lista de tarefas disponíveis para associar como pai) em frontend/src/componentes/Tarefa/FormularioTarefa.jsx
- [x] T068 [US3] Adicionar diálogo de confirmação ao excluir tarefa com filhas (lista as subtarefas afetadas) em frontend/src/componentes/Tarefa/FormularioTarefa.jsx
- [x] T069 [US3] Integrar aba/visão de Árvore à página Principal em frontend/src/paginas/Principal/Principal.jsx

**Ponto de verificação**: Todas as três histórias funcionam independentemente. Testar as três antes de avançar para polish.

---

## Fase Final: Polish e Preocupações Transversais

**Propósito**: Melhorias que afetam múltiplas histórias de usuário

- [x] T070 [P] Aplicar distinção visual completa dos quatro status (paleta de cores + ícones) em todos os componentes que exibem status em frontend/src/componentes/Tarefa/CartaoTarefa.jsx e frontend/src/componentes/Calendario/Calendario.jsx
- [x] T071 [P] Adicionar estados de carregamento (spinner/skeleton) e feedback de erro em português para todas as ações assíncronas em frontend/src/componentes/
- [x] T072 [P] Exibir tarefas sem data em lista dedicada "Sem data" na página Principal em frontend/src/paginas/Principal/Principal.jsx
- [x] T073 Executar relatório de cobertura de testes e verificar mínimo de 80% exigido pela constituição (Princípio II) em backend/ e frontend/
- [x] T074 Validar todos os passos do quickstart.md subindo o ambiente de desenvolvimento e executando os fluxos principais

---

## Dependências e Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — pode iniciar imediatamente
- **Fundacional (Fase 2)**: Depende da conclusão da Fase 1 — BLOQUEIA todas as histórias
- **HU1 (Fase 3)**: Depende da Fase 2 — Nenhuma dependência de HU2 ou HU3
- **HU2 (Fase 4)**: Depende da Fase 2 — Pode iniciar em paralelo com HU1 se houver capacidade de equipe; integra com HU1 na página Principal
- **HU3 (Fase 5)**: Depende da Fase 2 — Pode iniciar em paralelo; integra com HU1 (usa FormularioTarefa)
- **Polish (Fase Final)**: Depende de todas as histórias desejadas estarem completas

### Dependências dentro de cada História

- Testes DEVEM ser escritos e FALHAR antes de qualquer implementação (TDD obrigatório)
- Backend antes de frontend (API precisa existir para integração)
- Serviços antes de controladores antes de rotas (backend)
- Serviços antes de hooks antes de componentes (frontend)

### Oportunidades de Paralelismo

Todas as tarefas marcadas com [P] podem ser executadas simultaneamente por diferentes desenvolvedores:

- Setup (Fase 1): T002–T010 em paralelo após T001
- Fundacional (Fase 2): T014–T015 em paralelo; T018–T019 em paralelo
- HU1 — Testes: T021–T028 todos em paralelo (antes de qualquer implementação)
- HU2 — Testes: T044–T046 em paralelo (antes de qualquer implementação)
- HU3 — Testes: T056–T059 em paralelo (antes de qualquer implementação)

---

## Exemplo de Paralelismo: História de Usuário 1

```bash
# Escrever todos os testes de HU1 em paralelo (ANTES de implementar):
Tarefa: "T021 — Testes de contrato de autenticação em backend/testes/contrato/autenticacao.test.js"
Tarefa: "T022 — Testes de contrato de tarefas em backend/testes/contrato/tarefas.test.js"
Tarefa: "T023 — Testes unitários de autenticacaoServico em backend/testes/unidade/"
Tarefa: "T024 — Testes unitários de tarefasServico em backend/testes/unidade/"
Tarefa: "T025 — Testes da página Entrar em frontend/testes/paginas/"
Tarefa: "T026 — Testes da página Registrar em frontend/testes/paginas/"
Tarefa: "T027 — Testes de FormularioTarefa em frontend/testes/componentes/"
Tarefa: "T028 — Testes de CartaoTarefa em frontend/testes/componentes/"

# Após confirmar que TODOS os testes falham, iniciar implementação:
Tarefa: "T029 — autenticacaoServico (backend)"
Tarefa: "T032 — tarefasServico (backend)"
```

---

## Estratégia de Implementação

### MVP Primeiro (somente HU1)

1. Completar Fase 1: Setup
2. Completar Fase 2: Fundacional (CRÍTICO — bloqueia todas as histórias)
3. Completar Fase 3: HU1 (Gerenciar Tarefas Básicas)
4. **PARAR E VALIDAR**: Testar HU1 independentemente seguindo quickstart.md
5. Demonstrar MVP se pronto; avançar para HU2 quando aprovado

### Entrega Incremental

1. Setup + Fundacional → Base pronta
2. HU1 → Testar independentemente → Demo (MVP!)
3. HU2 → Testar independentemente → Demo
4. HU3 → Testar independentemente → Demo
5. Polish → Refinamentos transversais

### Estratégia com Equipe em Paralelo

Com múltiplos desenvolvedores após a Fase 2 concluída:

1. Equipe completa as Fases 1 e 2 juntas
2. Fase Fundacional concluída → histórias começam em paralelo:
   - Desenvolvedor A: HU1 (backend → frontend)
   - Desenvolvedor B: HU2 (backend → frontend)
   - Desenvolvedor C: HU3 (backend → frontend)
3. Histórias completadas e integradas independentemente

---

## Notas

- Tarefas [P] = arquivos diferentes, sem dependências entre si
- Rótulo [Historia] mapeia a tarefa para a história de usuário correspondente
- Cada história de usuário é implementável e testável independentemente
- **TDD é inegociável** (Princípio II da Constituição): confirme que os testes falham ANTES de implementar
- Comite após cada tarefa ou grupo lógico com mensagem semântica em português
- Pare em cada ponto de verificação para validar a história independentemente
- Evite: tarefas vagas, conflitos de arquivo, dependências entre histórias que quebrem independência
