# Pesquisa Técnica: Organizador de Tarefas

**Feature**: 001-organizador-tarefas
**Data**: 2026-05-16
**Plano**: [plan.md](./plan.md)

---

## Decisão 1: Banco de Dados

**Decisão**: PostgreSQL via Prisma ORM

**Rationale**: PostgreSQL é o banco relacional mais bem suportado pelo Prisma, com suporte nativo a UUID, enums, auto-referência (relação pai-filho em tarefas) e índices parciais. A natureza relacional dos dados (Usuário → Tarefas → Hierarquia) favorece um banco SQL.

**Alternativas consideradas**:
- MySQL: também suportado pelo Prisma, mas PostgreSQL tem melhor suporte a tipos avançados e é o padrão de mercado para novos projetos.
- SQLite: adequado para desenvolvimento local, mas sem suporte robusto para produção multi-usuário. Descartado por limitações de concorrência.
- MongoDB: schema flexível não agrega valor aqui; o modelo de dados é bem definido e relacional.

---

## Decisão 2: Autenticação

**Decisão**: JWT (JSON Web Token) com bcrypt para hash de senhas

**Rationale**: JWT é stateless, não requer sessão no servidor, e funciona bem com a separação backend/frontend via Docker. bcrypt é o padrão de mercado para hash de senhas com custo configurável.

**Alternativas consideradas**:
- Sessions com express-session + Redis: requer serviço adicional (Redis), aumenta complexidade de infraestrutura sem ganho funcional para um app single-user.
- Passport.js: abstração útil para múltiplos provedores, mas desnecessária aqui (apenas email/senha).

**Detalhes de implementação**:
- Token de acesso: JWT com expiração de 7 dias (personal app, conforto > segurança máxima).
- Senha: bcrypt com salt rounds = 12.
- Token armazenado em localStorage no frontend (sem compartilhamento multi-dispositivo no escopo).

---

## Decisão 3: Bibliotecas de Frontend

**Decisão**: React + Vite + React Router + @dnd-kit + react-big-calendar

**Rationale**:
- **Vite**: build tool moderno, HMR instantâneo, ideal para desenvolvimento com Docker volumes.
- **React Router v6**: roteamento declarativo padrão do ecossistema React.
- **@dnd-kit/core**: biblioteca de drag-and-drop mais moderna e acessível que react-beautiful-dnd (que foi descontinuada). Suporte a touch e teclado nativo.
- **react-big-calendar**: calendário open-source com suporte a visualização mensal, eventos com data, e integração com drag-and-drop via add-on próprio.

**Alternativas consideradas**:
- react-beautiful-dnd: descontinuada pelo Atlassian em 2023. Descartada.
- FullCalendar: poderoso mas possui versão paga para recursos avançados; react-big-calendar cobre as necessidades do MVP.
- Next.js: SSR não agrega valor para um app de uso pessoal single-page; aumentaria complexidade do Docker.

---

## Decisão 4: Estrutura de Testes

**Decisão**: Jest + Supertest (backend) / Vitest + React Testing Library (frontend)

**Rationale**:
- **Jest + Supertest**: padrão consolidado para testes de APIs Express. Supertest permite testar endpoints HTTP sem servidor real.
- **Vitest**: compatível com a config do Vite, mais rápido que Jest no frontend, API idêntica ao Jest.
- **React Testing Library**: testa comportamento do usuário (não implementação), alinhado com o Princípio III da constituição (Design Centrado no Usuário).

**Cobertura mínima**: 80% do código de produção crítico (conforme Princípio II da constituição).

---

## Decisão 5: Docker

**Decisão**: Docker Compose com configurações separadas para desenvolvimento e produção

**Rationale**: Separação clara de responsabilidades entre ambientes evita configurações híbridas propensas a erros.

**Estratégia de desenvolvimento**:
- `docker-compose.yml`: monta volumes locais nos containers; backend usa `nodemon` para hot reload; frontend usa Vite dev server com HMR.
- Banco de dados PostgreSQL como serviço isolado.
- Sem build de produção em desenvolvimento — arquivos locais são montados diretamente.

**Estratégia de produção**:
- `docker-compose.prod.yml`: usa imagens construídas com Dockerfiles multi-stage.
- Backend: stage de build (instala deps) → stage de produção (copia apenas o necessário, sem devDependencies).
- Frontend: stage de build (Vite build) → stage de produção com Nginx servindo arquivos estáticos.
- Banco de dados: PostgreSQL com volume persistente.

**Portas padrão**:
- Backend: 3000
- Frontend (dev): 5173 / Frontend (prod via Nginx): 80
- PostgreSQL: 5432 (não exposta em produção)

---

## Decisão 6: Organização de Código (Idioma)

**Decisão**: Português para código customizado; inglês para convenções de bibliotecas externas

**Rationale**: A constituição exige português para identificadores, mas também prevê exceções para "convenções técnicas obrigatórias" e "termos sem tradução consagrada". As exceções aplicadas:

| Contexto | Idioma | Justificativa |
|----------|--------|---------------|
| Nomes de rotas HTTP (GET, POST, etc.) | Inglês | Protocolo HTTP |
| Métodos do Prisma (findMany, create, etc.) | Inglês | API da biblioteca |
| Hooks do React (useState, useEffect, etc.) | Inglês | API da biblioteca |
| Nomes de arquivos de configuração (.env, schema.prisma) | Inglês | Convenção técnica |
| Variáveis, funções, classes customizadas | Português | Regra da constituição |
| Comentários e documentação | Português | Regra da constituição |
