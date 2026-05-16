# Guia de Início Rápido: Organizador de Tarefas

**Feature**: 001-organizador-tarefas

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+
- Git

---

## Ambiente de Desenvolvimento

### 1. Clonar e configurar variáveis de ambiente

```bash
git clone <url-do-repositorio>
cd organizador-tarefas
cp .env.example .env
```

Editar `.env` com os valores desejados:

```env
# Banco de dados
POSTGRES_DB=organizador_tarefas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha_segura_aqui

# Backend
DATABASE_URL=postgresql://postgres:senha_segura_aqui@banco:5432/organizador_tarefas
JWT_SEGREDO=seu_segredo_jwt_aqui
JWT_EXPIRACAO=7d
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

### 2. Subir os serviços em desenvolvimento

```bash
docker compose up
```

Os serviços sobem com volumes sincronizados com os arquivos locais:
- **Backend** (Express + Nodemon): hot reload automático em qualquer alteração em `backend/src/`
- **Frontend** (Vite HMR): atualização instantânea em qualquer alteração em `frontend/src/`
- **Banco** (PostgreSQL): persiste dados entre reinicializações

### 3. Aplicar migrações do banco

Em um terminal separado, enquanto os serviços estão rodando:

```bash
docker compose exec backend npx prisma migrate dev
```

### 4. Acessar o aplicativo

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| PostgreSQL | localhost:5432 |

### 5. Validar funcionamento

```bash
# Verificar saúde do backend
curl http://localhost:3000/api/saude

# Esperado:
# {"status": "ok"}
```

---

## Executar Testes

### Testes do backend

```bash
docker compose exec backend npm test
```

### Testes do frontend

```bash
docker compose exec frontend npm test
```

### Testes com cobertura (mínimo 80% requerido pela constituição)

```bash
docker compose exec backend npm run test:cobertura
docker compose exec frontend npm run test:cobertura
```

---

## Ambiente de Produção

### 1. Build e subir serviços de produção

```bash
docker compose -f docker-compose.prod.yml up --build
```

O build de produção:
- **Backend**: imagem multi-stage — stage de build instala dependências, stage final copia apenas `node_modules` de produção e o código compilado.
- **Frontend**: stage de build executa `vite build`, stage final com Nginx serve os arquivos estáticos em `/usr/share/nginx/html`.
- **Banco**: PostgreSQL com volume persistente nomeado.

### 2. Aplicar migrações em produção

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### 3. Acessar o aplicativo

| Serviço | URL |
|---------|-----|
| Frontend (via Nginx) | http://localhost:80 |
| Backend API | http://localhost:3000/api |

---

## Estrutura do Projeto

```text
organizador-tarefas/
├── backend/
│   ├── src/
│   │   ├── rotas/            # Definição de rotas Express
│   │   ├── controladores/    # Handlers das rotas
│   │   ├── servicos/         # Lógica de negócio
│   │   ├── middleware/       # Autenticação, validação
│   │   └── index.js          # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Modelo de dados
│   ├── testes/
│   │   ├── contrato/         # Testes de contrato da API
│   │   ├── integracao/       # Testes de integração
│   │   └── unidade/          # Testes unitários
│   ├── Dockerfile            # Produção (multi-stage)
│   ├── Dockerfile.dev        # Desenvolvimento
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── componentes/      # Componentes React reutilizáveis
│   │   ├── paginas/          # Páginas da aplicação
│   │   ├── servicos/         # Chamadas à API
│   │   ├── contextos/        # Contextos React (auth, tarefas)
│   │   └── hooks/            # Hooks customizados
│   ├── testes/               # Testes com Vitest + RTL
│   ├── Dockerfile            # Produção (multi-stage + Nginx)
│   ├── Dockerfile.dev        # Desenvolvimento
│   └── package.json
│
├── docker-compose.yml        # Desenvolvimento
├── docker-compose.prod.yml   # Produção
├── .env.example              # Template de variáveis de ambiente
└── specs/                    # Documentação do projeto
    └── 001-organizador-tarefas/
```

---

## Comandos Úteis

```bash
# Ver logs de um serviço específico
docker compose logs -f backend

# Acessar shell do container do backend
docker compose exec backend sh

# Resetar banco de dados (apaga todos os dados)
docker compose exec backend npx prisma migrate reset

# Visualizar banco com Prisma Studio
docker compose exec backend npx prisma studio
```

---

## Solução de Problemas

| Problema | Solução |
|----------|---------|
| Porta 5173 em uso | Alterar `ports` no `docker-compose.yml` |
| Migrações falham | Verificar `DATABASE_URL` no `.env` |
| Hot reload não funciona | Verificar se volumes estão montados corretamente |
| Token JWT inválido | Verificar `JWT_SEGREDO` no `.env` do backend |
