# Plano de Implementação: Perfil do Usuário

**Branch**: `003-perfil-usuario` | **Data**: 2026-05-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-perfil-usuario/spec.md`

## Resumo

Adicionar página de perfil do usuário (`/perfil`) com dois formulários independentes: edição de nome e e-mail, e troca de senha com validação da senha atual. No backend, três novos endpoints protegidos por JWT. No frontend, novo componente de cabeçalho compartilhado, nova página seguindo o app shell existente e atualização do contexto de autenticação.

## Contexto Técnico

**Language/Version**: Node.js 20 (backend) / React 18 (frontend)
**Primary Dependencies**: Express 4, Prisma 5, Zod, bcrypt, JWT (backend) · React Router 6, axios (frontend)
**Storage**: PostgreSQL 16 — sem migração (entidade Usuario já completa)
**Testing**: Jest + Supertest (backend) · Vitest + React Testing Library (frontend)
**Target Platform**: Docker (dev com hot reload, prod multi-stage)
**Project Type**: Web application (backend API + frontend SPA)
**Performance Goals**: Atualização de perfil refletida na UI sem reload de página
**Constraints**: Sessão encerrada pelo cliente após troca de senha bem-sucedida (backend stateless)

## Constitution Check

| Princípio | Gate | Status |
|---|---|---|
| I. Código Limpo | Sem duplicação — `Cabecalho` extraído como componente compartilhado | ✅ |
| II. TDD (INEGOCIÁVEL) | Testes escritos antes da implementação em cada tarefa | ✅ |
| III. Design Centrado no Usuário | Histórias de usuário com critérios mensuráveis definidos | ✅ |
| IV. Git Flow | Branch `003-perfil-usuario` criada a partir de `develop` | ✅ |
| V. Commits Semânticos | Commits em português, tipo `feat`/`test`/`refactor` | ✅ |
| VI. Consistência Visual | Reutiliza classes CSS existentes — sem inline style, sem `!important` | ✅ |

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/003-perfil-usuario/
├── plan.md              # Este arquivo
├── spec.md
├── research.md
├── data-model.md
├── contracts/
│   └── api-contrato.md
└── checklists/
    └── requirements.md
```

### Código-fonte

```text
backend/src/
├── rotas/
│   ├── autenticacao.js        (existente)
│   ├── tarefas.js             (existente)
│   └── perfil.js              ← NOVO
├── controladores/
│   ├── autenticacaoControlador.js  (existente)
│   ├── tarefasControlador.js       (existente)
│   └── perfilControlador.js        ← NOVO
└── servicos/
    ├── autenticacaoServico.js      (existente)
    ├── tarefasServico.js           (existente)
    └── perfilServico.js            ← NOVO

backend/testes/
├── contrato/
│   └── perfil.test.js              ← NOVO
└── unidade/
    └── perfilServico.test.js       ← NOVO

frontend/src/
├── componentes/
│   └── Cabecalho/
│       ├── Cabecalho.jsx           ← NOVO (extraído de Principal.jsx)
│       └── Cabecalho.css           ← NOVO
├── paginas/
│   ├── Principal/
│   │   └── Principal.jsx           (modificado — usa <Cabecalho>)
│   └── Perfil/
│       ├── Perfil.jsx              ← NOVO
│       └── Perfil.css              ← NOVO
├── servicos/
│   └── perfil.js                   ← NOVO
├── contextos/
│   └── ContextoAutenticacao.jsx    (modificado — adiciona atualizarUsuario)
└── main.jsx                        (modificado — adiciona rota /perfil)

frontend/testes/componentes/
└── Perfil.test.jsx                 ← NOVO
```

## Complexity Tracking

Nenhuma violação à constituição identificada. Nenhum justificativa de complexidade extra necessária.
