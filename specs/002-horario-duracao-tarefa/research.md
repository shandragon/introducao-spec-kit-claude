# Pesquisa Técnica: Horário e Duração de Tarefas

**Feature**: 002-horario-duracao-tarefa
**Data**: 2026-05-16
**Contexto**: Extensão da feature 001 (Organizador de Tarefas). Toda a stack e infraestrutura já estão definidas.

---

## Decisão 1: Armazenamento do Horário de Início

**Decisão**: `String` no formato `"HH:MM"` (ex.: `"09:30"`)

**Rationale**: O PostgreSQL possui tipo `TIME`, mas o Prisma não expõe um tipo `Time` nativo — mapearia para `DateTime` com data fictícia (1970-01-01), o que é semanticamente incorreto. Armazenar como `String "HH:MM"` é legível, sem overhead de fuso horário, fácil de validar com regex, e corresponde diretamente ao formato retornado por `<input type="time">` no HTML.

**Alternativas consideradas**:
- `Int` (minutos desde meia-noite, 0–1439): compacto, mas pouco legível em inspeções de banco.
- `DateTime` com data fictícia: semanticamente incorreto e requer parsing extra.
- Dois campos `Int` separados (hora + minuto): mais campos sem ganho real.

---

## Decisão 2: Armazenamento da Duração

**Decisão**: `Int` (quantidade de minutos, mínimo 1)

**Rationale**: A duração em minutos inteiros é o formato mais simples, não ambíguo e diretamente alinhado com a UI (campo `<input type="number">`). A conversão para exibição ("1h 30min") é feita na camada de apresentação.

**Alternativas consideradas**:
- `String "HH:MM"`: requer parsing para cálculos; redundante com o formato de entrada.
- `Float` (horas decimais): frações de minuto não são suportadas; `Int` é mais direto.

---

## Decisão 3: Combinação Data + Horário nos Eventos do Calendário

**Decisão**: Combinar `data` + `horarioInicio` para gerar timestamps completos nos eventos do calendário

**Rationale**: O `react-big-calendar` usa `start` e `end` como objetos `Date` completos para posicionar eventos nas visões diária e semanal. A função `tarefaParaEvento` deve construir:
- `start = new Date(tarefa.data)` com horas/minutos de `tarefa.horarioInicio`
- `end = start + tarefa.duracao minutos` (quando duração definida)
- Se sem horário: manter comportamento atual (evento de dia inteiro / sem horário na grade)

---

## Decisão 4: Visões Diária e Semanal no react-big-calendar

**Decisão**: Adicionar `'week'` e `'day'` ao array `views` do componente existente

**Rationale**: O `react-big-calendar` suporta nativamente `month`, `week`, `day` e `agenda`. Basta adicionar as novas visões ao prop `views` e ao seletor de abas. O posicionamento por horário é automático quando `start` e `end` têm timestamps com hora definida.

**Tarefas sem horário**: A biblioteca suporta "all-day events" (eventos de dia inteiro) via prop `allDay: true`. Tarefas sem `horarioInicio` serão mapeadas como `allDay: true` e aparecem na faixa dedicada no topo das visões diária e semanal.

---

## Decisão 5: Validação do Horário de Início

**Decisão**: Regex `/^([01]\d|2[0-3]):[0-5]\d$/` no backend (zod) + `type="time"` no frontend

**Rationale**: O campo `<input type="time">` no HTML já garante formato correto no frontend. O backend valida via zod para garantir integridade independentemente do cliente.

---

## Impacto em Código Existente

| Arquivo | Tipo de mudança |
|---------|----------------|
| `backend/prisma/schema.prisma` | Adicionar campos `horarioInicio` e `duracao` ao model `Tarefa` |
| `backend/src/servicos/tarefasServico.js` | Aceitar e persistir os novos campos em criar/atualizar |
| `backend/src/servicos/autenticacaoServico.js` | Nenhuma mudança |
| `frontend/src/componentes/Tarefa/FormularioTarefa.jsx` | Adicionar campos de horário e duração + cálculo de término |
| `frontend/src/componentes/Tarefa/CartaoTarefa.jsx` | Exibir horário de início e duração quando presentes |
| `frontend/src/componentes/Calendario/Calendario.jsx` | Adicionar visões day/week, atualizar mapeamento de eventos |
| `frontend/src/servicos/tarefas.js` | Nenhuma mudança (campos passam automaticamente) |
