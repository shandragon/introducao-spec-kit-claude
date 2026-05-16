# Modelo de Dados: Horário e Duração de Tarefas

**Feature**: 002-horario-duracao-tarefa
**Data**: 2026-05-16
**Tipo**: Extensão do modelo existente (feature 001)

---

## Mudanças no Model Existente

### Tarefa (campos adicionados)

| Campo | Tipo | Obrigat. | Validação | Descrição |
|-------|------|----------|-----------|-----------|
| `horarioInicio` | String? | Não | Regex `^([01]\d\|2[0-3]):[0-5]\d$` | Horário de início no formato "HH:MM". Exige que `data` esteja definida. |
| `duracao` | Int? | Não | `>= 1` | Duração em minutos. Mínimo: 1. |

**Regras de negócio:**
- `horarioInicio` DEVE ser `null` se `data` for `null` — o sistema rejeita horário sem data.
- `duracao` pode existir sem `horarioInicio` (planejamento de tempo sem horário fixo).
- O horário de término (`horarioFim`) é **calculado**, nunca armazenado: `horarioFim = horarioInicio + duracao minutos`.
- Não há restrição de unicidade — múltiplas tarefas podem ter o mesmo horário de início.

---

## Schema Prisma Atualizado (diff)

```prisma
model Tarefa {
  id           String       @id @default(cuid())
  titulo       String
  data         DateTime?
  horarioInicio String?     @map("horario_inicio")   // NOVO: "HH:MM" ou null
  duracao      Int?                                   // NOVO: minutos >= 1 ou null
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

## Migração Necessária

```sql
ALTER TABLE tarefas
  ADD COLUMN horario_inicio VARCHAR(5),
  ADD COLUMN duracao INTEGER;

-- Constraint de validação
ALTER TABLE tarefas
  ADD CONSTRAINT chk_horario_inicio
    CHECK (horario_inicio IS NULL OR horario_inicio ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE tarefas
  ADD CONSTRAINT chk_duracao
    CHECK (duracao IS NULL OR duracao >= 1);
```

---

## Campo Calculado (não armazenado)

| Campo | Cálculo | Tipo de retorno |
|-------|---------|----------------|
| `horarioFim` | `horarioInicio` + `duracao` minutos | String "HH:MM" (pode ser dia seguinte: "25:30" exibido como "+1d 01:30") |
| `duracaoFormatada` | `duracao ÷ 60`h `duracao % 60`min | String "1h 30min" / "45min" / "2h" |

---

## Impacto em Respostas da API

Todos os endpoints que retornam objetos `Tarefa` passam a incluir os novos campos:

```json
{
  "id": "cuid...",
  "titulo": "Reunião de planejamento",
  "data": "2026-05-20T00:00:00.000Z",
  "horarioInicio": "09:30",
  "duracao": 90,
  "horarioFim": "11:00",
  "duracaoFormatada": "1h 30min",
  "status": "PENDENTE",
  ...
}
```

`horarioFim` e `duracaoFormatada` são calculados pelo backend antes de retornar — não são armazenados.
