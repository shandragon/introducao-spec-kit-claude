# Contrato da API — Alterações: Horário e Duração de Tarefas

**Feature**: 002-horario-duracao-tarefa
**Data**: 2026-05-16
**Tipo**: Extensão do contrato existente (feature 001)
**Base URL**: `/api` (sem alteração)

---

## Campos Adicionados a Todos os Endpoints de Tarefa

Todos os endpoints que aceitam ou retornam objetos `Tarefa` são estendidos com os novos campos opcionais.

### Campos de Entrada (Request Body)

| Campo | Tipo | Obrigat. | Validação | Descrição |
|-------|------|----------|-----------|-----------|
| `horarioInicio` | String \| null | Não | Formato "HH:MM" (ex.: "09:30") | Horário de início. Inválido sem `data`. |
| `duracao` | Integer \| null | Não | `>= 1` | Duração em minutos. |

### Campos de Saída (Response Body)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `horarioInicio` | String \| null | "HH:MM" ou null |
| `duracao` | Integer \| null | Minutos ou null |
| `horarioFim` | String \| null | "HH:MM" calculado (início + duração); null se algum campo ausente |
| `duracaoFormatada` | String \| null | Ex.: "1h 30min", "45min", "2h"; null se duração ausente |

---

## Endpoints Modificados

### POST /api/tarefas

**Corpo da requisição (campos adicionados)**:
```json
{
  "titulo": "Reunião de planejamento",
  "data": "2026-05-20",
  "horarioInicio": "09:30",
  "duracao": 90,
  "status": "PENDENTE"
}
```

**Resposta 201 (campos adicionados)**:
```json
{
  "dados": {
    "tarefa": {
      "id": "cuid...",
      "titulo": "Reunião de planejamento",
      "data": "2026-05-20T00:00:00.000Z",
      "horarioInicio": "09:30",
      "duracao": 90,
      "horarioFim": "11:00",
      "duracaoFormatada": "1h 30min",
      "status": "PENDENTE"
    }
  }
}
```

**Novos erros**:
- `400 HORARIO_SEM_DATA`: `horarioInicio` informado sem `data` definida na tarefa.
- `400 DURACAO_INVALIDA`: `duracao` menor que 1.
- `400 HORARIO_INVALIDO`: `horarioInicio` em formato diferente de "HH:MM".

---

### PUT /api/tarefas/:id

**Corpo da requisição (campos adicionados)**:
```json
{
  "horarioInicio": "14:00",
  "duracao": 45
}
```

**Comportamento**:
- Enviar `horarioInicio: null` limpa o horário de início.
- Enviar `duracao: null` remove a duração.
- Atualizar `data` para `null` em uma tarefa que tem `horarioInicio` também limpa `horarioInicio` automaticamente (regra de negócio: horário exige data).

**Resposta 200**: mesma estrutura do POST com campos calculados incluídos.

---

### GET /api/tarefas e GET /api/tarefas/:id

Sem alteração de parâmetros. Todos os objetos `Tarefa` retornados passam a incluir `horarioInicio`, `duracao`, `horarioFim` e `duracaoFormatada`.

---

## Endpoints Sem Alteração

- `POST /api/autenticacao/registrar`
- `POST /api/autenticacao/entrar`
- `PATCH /api/tarefas/:id/data` (altera apenas a data; `horarioInicio` é preservado)
- `DELETE /api/tarefas/:id`
- `GET /api/tarefas/:id/arvore`
- `GET /api/saude`

---

## Notas de Compatibilidade

- Esta extensão é **retrocompatível**: clientes que não enviam `horarioInicio` e `duracao` continuam funcionando normalmente — os campos são `null` por padrão.
- Clientes existentes que não processam os novos campos de resposta (`horarioFim`, `duracaoFormatada`) simplesmente os ignoram.
