# Modelo de Dados: Organizador de Tarefas

**Feature**: 001-organizador-tarefas
**Data**: 2026-05-16
**Banco**: PostgreSQL via Prisma ORM

---

## Entidades

### Usuário

Representa um titular de conta no sistema. Cada usuário possui um conjunto isolado de tarefas.

| Campo | Tipo | Obrigat. | Descrição |
|-------|------|----------|-----------|
| id | String (CUID) | Sim | Identificador único gerado automaticamente |
| nome | String | Sim | Nome de exibição do usuário |
| email | String | Sim | Email único no sistema; usado como login |
| senha | String | Sim | Hash bcrypt da senha (nunca armazenada em texto plano) |
| criadoEm | DateTime | Sim | Data/hora de criação do registro |
| atualizadoEm | DateTime | Sim | Data/hora da última atualização |

**Restrições**:
- `email` DEVE ser único no sistema.
- `senha` DEVE ser armazenada como hash bcrypt (salt rounds = 12).
- Um Usuário pode ter zero ou mais Tarefas.

---

### Tarefa

Unidade fundamental do sistema. Sempre associada a um Usuário. Suporta hierarquia pai-filho auto-referencial.

| Campo | Tipo | Obrigat. | Descrição |
|-------|------|----------|-----------|
| id | String (CUID) | Sim | Identificador único gerado automaticamente |
| titulo | String | Sim | Texto descritivo da tarefa |
| data | DateTime? | Não | Data de execução prevista (nullable) |
| status | StatusTarefa | Sim | Status atual (padrão: PENDENTE) |
| usuarioId | String | Sim | FK para Usuário (proprietário) |
| paiId | String? | Não | FK auto-referencial para Tarefa pai (nullable) |
| criadoEm | DateTime | Sim | Data/hora de criação do registro |
| atualizadoEm | DateTime | Sim | Data/hora da última atualização |

**Relacionamentos**:
- `usuario`: Tarefa pertence a um Usuário.
- `pai`: Tarefa pode ter uma Tarefa pai (opcional).
- `filhas`: Tarefa pode ter zero ou mais Tarefas filhas.

**Restrições**:
- `titulo` não pode ser vazio.
- `usuarioId` DEVE referenciar um Usuário existente.
- `paiId` DEVE referenciar uma Tarefa do mesmo Usuário (quando definido).
- Referência circular (tarefa ser filha de si mesma ou de sua própria descendente) DEVE ser prevenida na camada de serviço.
- Ao excluir uma Tarefa com filhas, o sistema DEVE alertar o usuário e, após confirmação, excluir a tarefa e todas as suas descendentes em cascata.

---

### StatusTarefa (Enumeração)

| Valor | Descrição |
|-------|-----------|
| PENDENTE | Tarefa criada, aguardando início |
| EM_PLANEJAMENTO | Tarefa sendo planejada |
| EM_EXECUCAO | Tarefa em andamento |
| CONCLUIDA | Tarefa finalizada |

**Regras de transição**: Livres — qualquer status pode ser alterado para qualquer outro sem restrição de sequência.

---

## Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id           String   @id @default(cuid())
  nome         String
  email        String   @unique
  senha        String
  criadoEm    DateTime @default(now()) @map("criado_em")
  atualizadoEm DateTime @updatedAt @map("atualizado_em")
  tarefas      Tarefa[]

  @@map("usuarios")
}

enum StatusTarefa {
  PENDENTE
  EM_PLANEJAMENTO
  EM_EXECUCAO
  CONCLUIDA
}

model Tarefa {
  id           String       @id @default(cuid())
  titulo       String
  data         DateTime?
  status       StatusTarefa @default(PENDENTE)
  usuarioId    String       @map("usuario_id")
  paiId        String?      @map("pai_id")
  criadoEm    DateTime     @default(now()) @map("criado_em")
  atualizadoEm DateTime     @updatedAt @map("atualizado_em")

  usuario  Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  pai      Tarefa?  @relation("TarefaHierarquia", fields: [paiId], references: [id])
  filhas   Tarefa[] @relation("TarefaHierarquia")

  @@index([usuarioId])
  @@index([data])
  @@index([status])
  @@map("tarefas")
}
```

---

## Ordenação no Calendário

Quando múltiplas tarefas compartilham a mesma data, são ordenadas automaticamente por status na seguinte sequência:

1. PENDENTE
2. EM_PLANEJAMENTO
3. EM_EXECUCAO
4. CONCLUIDA

Esta ordenação é aplicada pela camada de serviço no momento da consulta; não requer campo adicional no banco.

---

## Índices

| Tabela | Campo(s) | Motivo |
|--------|----------|--------|
| usuarios | email | Busca por login (único) |
| tarefas | usuario_id | Filtro por proprietário (toda consulta) |
| tarefas | data | Consultas de calendário por mês |
| tarefas | status | Ordenação e filtragem por status |
