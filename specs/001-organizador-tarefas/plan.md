# Plano de Implementação: Organizador de Tarefas

**Branch**: `001-organizador-tarefas` | **Data**: 2026-05-16 | **Spec**: [spec.md](./spec.md)
**Input**: Especificação da feature em `specs/001-organizador-tarefas/spec.md`

## Resumo

Aplicativo web de gerenciamento pessoal de tarefas com visualização em calendário (arrastar e soltar), árvore hierárquica pai-filho e quatro status de progresso. Backend em Node.js + Express + Prisma com PostgreSQL; frontend em React + Vite. Infraestrutura Docker com ambientes separados para desenvolvimento (volumes sincronizados) e produção (multi-stage builds).

## Contexto Técnico

**Linguagem/Versão**: Node.js 20 LTS (backend) / React 18 (frontend)
**Dependências Principais**:
- Backend: Express 4, Prisma 5, jsonwebtoken, bcrypt, zod (validação)
- Frontend: React 18, React Router 6, @dnd-kit/core, react-big-calendar, axios
- Testes Backend: Jest, Supertest
- Testes Frontend: Vitest, React Testing Library

**Storage**: PostgreSQL 16 via Prisma ORM
**Testes**: Jest + Supertest (backend) / Vitest + React Testing Library (frontend)
**Plataforma Alvo**: Web — desktop (Linux/macOS/Windows via Docker)
**Tipo de Projeto**: Aplicação web (backend API REST + frontend SPA)
**Metas de Desempenho**: Ações principais completadas em < 30s (CS-001); drag-and-drop com atualização imediata (CS-002)
**Restrições**: Sem recuperação de senha no MVP; sem mobile responsivo obrigatório; sem integração com calendários externos
**Escala/Escopo**: Uso pessoal (conta única por usuário); sem múltiplos usuários simultâneos no escopo inicial

## Constitution Check

*GATE: Deve passar antes da Phase 0. Reavaliado após Phase 1.*

| Princípio | Gate | Status | Observação |
|-----------|------|--------|-----------|
| I. Código Limpo | Funções ≤ 20 linhas; sem duplicação; nomes revelam intenção | ✅ Aprovado | Aplicado a todo código customizado |
| II. TDD (INEGOCIÁVEL) | Testes escritos e falhando ANTES de qualquer implementação | ✅ Aprovado | Incluído nas fases de implementação |
| III. Design Centrado no Usuário | Toda feature tem história de usuário com critérios mensuráveis | ✅ Aprovado | 3 histórias com 12 cenários de aceite |
| IV. Git Flow | Feature branch criado a partir de `develop` | ✅ Aprovado | Branch `001-organizador-tarefas` ativo |
| V. Commits Semânticos | Commits no formato Conventional Commits em português | ✅ Aprovado | Aplicado em todo o fluxo |
| Idioma | Código customizado em português; exceções para APIs de libs | ✅ Aprovado | Exceção documentada em research.md |

**Nenhuma violação detectada. Complexidade Tracking vazio.**

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/001-organizador-tarefas/
├── plan.md              # Este arquivo
├── research.md          # Decisões técnicas e alternativas
├── data-model.md        # Schema Prisma e entidades
├── quickstart.md        # Como rodar e validar
├── contracts/
│   └── api-contrato.md  # Contrato da API REST
└── tasks.md             # Gerado por /speckit-tasks
```

### Código-Fonte (raiz do repositório)

```text
organizador-tarefas/
├── backend/
│   ├── src/
│   │   ├── rotas/                  # Rotas Express por módulo
│   │   │   ├── autenticacao.js     # POST /api/autenticacao/*
│   │   │   └── tarefas.js          # CRUD /api/tarefas/*
│   │   ├── controladores/          # Handlers das requisições
│   │   │   ├── autenticacaoControlador.js
│   │   │   └── tarefasControlador.js
│   │   ├── servicos/               # Lógica de negócio
│   │   │   ├── autenticacaoServico.js
│   │   │   └── tarefasServico.js
│   │   ├── middleware/             # Middlewares Express
│   │   │   ├── autenticar.js       # Validação JWT
│   │   │   └── tratarErros.js      # Error handler global
│   │   └── index.js                # Entry point Express
│   ├── prisma/
│   │   ├── schema.prisma           # Modelo de dados
│   │   └── migrations/             # Histórico de migrações
│   ├── testes/
│   │   ├── contrato/               # Testes de contrato da API (Supertest)
│   │   ├── integracao/             # Testes de integração
│   │   └── unidade/                # Testes unitários de serviços
│   ├── Dockerfile                  # Produção (multi-stage)
│   ├── Dockerfile.dev              # Desenvolvimento (nodemon)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── componentes/            # Componentes React reutilizáveis
│   │   │   ├── Calendario/         # Calendário com drag-and-drop
│   │   │   ├── Tarefa/             # Card e formulário de tarefa
│   │   │   └── Arvore/             # Visualização em árvore hierárquica
│   │   ├── paginas/                # Páginas da aplicação
│   │   │   ├── Entrar/             # Login
│   │   │   ├── Registrar/          # Cadastro
│   │   │   └── Principal/          # Dashboard principal
│   │   ├── servicos/               # Chamadas à API REST
│   │   │   ├── autenticacao.js
│   │   │   └── tarefas.js
│   │   ├── contextos/              # Contextos React
│   │   │   └── ContextoAutenticacao.jsx
│   │   └── hooks/                  # Hooks customizados
│   │       └── usarTarefas.js
│   ├── testes/                     # Testes Vitest + RTL
│   ├── Dockerfile                  # Produção (multi-stage + Nginx)
│   ├── Dockerfile.dev              # Desenvolvimento (Vite HMR)
│   └── package.json
│
├── docker-compose.yml              # Desenvolvimento
├── docker-compose.prod.yml         # Produção
├── .env.example                    # Template de variáveis
└── specs/
```

**Decisão de estrutura**: Opção 2 (aplicação web com backend e frontend separados), com containers Docker isolados para cada serviço e um serviço adicional para o banco de dados PostgreSQL.

## Complexity Tracking

> Nenhuma violação da constituição identificada. Tabela vazia.

---

## Fases de Implementação

### Phase 0 — Pesquisa e Decisões Técnicas ✅ Concluída

Resultados em [research.md](./research.md).

**Decisões tomadas**:
- Banco: PostgreSQL 16 via Prisma 5
- Autenticação: JWT + bcrypt
- Drag-and-drop: @dnd-kit/core
- Calendário: react-big-calendar
- Testes backend: Jest + Supertest
- Testes frontend: Vitest + React Testing Library

### Phase 1 — Design e Contratos ✅ Concluída

| Artefato | Arquivo | Status |
|----------|---------|--------|
| Modelo de dados | [data-model.md](./data-model.md) | ✅ |
| Contrato da API | [contracts/api-contrato.md](./contracts/api-contrato.md) | ✅ |
| Guia de início rápido | [quickstart.md](./quickstart.md) | ✅ |

**Constitution Check pós-design**:
- Modelo de dados: entidade Usuário com isolamento de dados confirmado (RF-014) ✅
- API: todas as rotas validam proprietário, retornam 404 (não 403) para não vazar recursos ✅
- Nomes em português para entidades e campos customizados ✅

### Phase 2 — Geração de Tarefas

Executar `/speckit-tasks` para gerar `tasks.md` com as tarefas atômicas ordenadas.
