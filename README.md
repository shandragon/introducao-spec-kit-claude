# Organizador de Tarefas

Aplicativo web pessoal para gerenciamento de tarefas com visualização em calendário (arrastar e soltar), árvore hierárquica pai-filho e quatro níveis de progresso.

## Funcionalidades

- **Gestão de tarefas** — criar, editar, excluir e alterar status individualmente
- **Calendário interativo** — visualize tarefas por data e reorganize-as arrastando entre dias
- **Hierarquia pai-filho** — decomponha projetos em subtarefas com visualização em árvore expansível
- **Quatro status** — Pendente · Em Planejamento · Em Execução · Concluída, com indicadores visuais distintos
- **Autenticação** — cadastro e login com email e senha; dados isolados por usuário

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js 20 + Express 4 + Prisma 5 |
| Frontend | React 18 + Vite + React Router 6 |
| Banco de dados | PostgreSQL 16 |
| Autenticação | JWT + bcrypt |
| Drag-and-drop | @dnd-kit/core |
| Calendário | react-big-calendar |
| Testes backend | Jest + Supertest |
| Testes frontend | Vitest + React Testing Library |
| Infraestrutura | Docker + Docker Compose |

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

## Início Rápido

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com seus valores. Os padrões do `.env.example` funcionam para desenvolvimento local.

### 2. Subir o ambiente de desenvolvimento

```bash
docker compose up
```

Os três serviços sobem com hot reload automático:

| Serviço | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### 3. Aplicar as migrações do banco

Em um terminal separado (com os containers rodando):

```bash
docker compose exec backend npx prisma migrate dev
```

### 4. Criar sua conta

Acesse http://localhost:5173/registrar e crie uma conta para começar a usar.

## Estrutura do Projeto

```
organizador-tarefas/
├── backend/
│   ├── src/
│   │   ├── rotas/            # Rotas Express (autenticacao, tarefas, saude)
│   │   ├── controladores/    # Handlers das requisições
│   │   ├── servicos/         # Lógica de negócio
│   │   ├── middleware/       # Autenticação JWT e tratamento de erros
│   │   └── index.js          # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Modelo de dados
│   └── testes/               # Testes de contrato e unitários
│
├── frontend/
│   ├── src/
│   │   ├── componentes/      # Componentes reutilizáveis (Tarefa, Calendario, Arvore)
│   │   ├── paginas/          # Páginas (Entrar, Registrar, Principal)
│   │   ├── servicos/         # Chamadas à API REST
│   │   ├── contextos/        # Contexto de autenticação
│   │   └── hooks/            # Hooks customizados
│   └── testes/               # Testes de componentes e páginas
│
├── docker-compose.yml         # Ambiente de desenvolvimento
├── docker-compose.prod.yml    # Ambiente de produção
└── .env.example               # Template de variáveis de ambiente
```

## Comandos Úteis

```bash
# Executar testes do backend
docker compose exec backend npm test

# Executar testes do frontend
docker compose exec frontend npm test

# Verificar cobertura de testes (mínimo 80%)
docker compose exec backend npm run test:cobertura

# Acessar o banco com Prisma Studio
docker compose exec backend npx prisma studio

# Ver logs de um serviço
docker compose logs -f backend
```

## Ambiente de Produção

```bash
# Build e inicialização
docker compose -f docker-compose.prod.yml up --build

# Aplicar migrações em produção
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

O build de produção usa imagens multi-stage:
- **Backend**: elimina `devDependencies` na imagem final
- **Frontend**: Vite gera os estáticos; Nginx os serve na porta 80

## API

A documentação completa da API REST está em [`specs/001-organizador-tarefas/contracts/api-contrato.md`](specs/001-organizador-tarefas/contracts/api-contrato.md).

Endpoints principais:

```
POST   /api/autenticacao/registrar
POST   /api/autenticacao/entrar
GET    /api/tarefas
POST   /api/tarefas
GET    /api/tarefas/:id
PUT    /api/tarefas/:id
DELETE /api/tarefas/:id
PATCH  /api/tarefas/:id/data
GET    /api/tarefas/:id/arvore
GET    /api/saude
```

## Documentação Técnica

| Artefato | Descrição |
|----------|-----------|
| [Especificação](specs/001-organizador-tarefas/spec.md) | Histórias de usuário e requisitos funcionais |
| [Plano](specs/001-organizador-tarefas/plan.md) | Arquitetura e decisões técnicas |
| [Modelo de dados](specs/001-organizador-tarefas/data-model.md) | Schema Prisma e entidades |
| [Contrato da API](specs/001-organizador-tarefas/contracts/api-contrato.md) | Endpoints, formatos e exemplos |
| [Guia rápido](specs/001-organizador-tarefas/quickstart.md) | Dev, produção e troubleshooting |
| [Constituição](specs/memory/constitution.md) | Princípios e governança do projeto |

## Licença

MIT
