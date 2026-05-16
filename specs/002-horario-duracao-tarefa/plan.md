# Plano de Implementação: Horário e Duração de Tarefas

**Branch**: `002-horario-duracao-tarefa` | **Data**: 2026-05-16 | **Spec**: [spec.md](./spec.md)
**Input**: Especificação da feature em `specs/002-horario-duracao-tarefa/spec.md`

## Resumo

Extensão do Organizador de Tarefas para registrar horário de início ("HH:MM") e duração (minutos inteiros) em tarefas. O horário de término é calculado automaticamente. O calendário ganha visões diária e semanal com posicionamento de eventos por horário, mantendo a visão mensal existente.

## Contexto Técnico

**Linguagem/Versão**: Node.js 20 LTS (backend) / React 18 (frontend) — sem alteração
**Dependências Principais**: Sem novas dependências — react-big-calendar já suporta visões day/week
**Storage**: PostgreSQL 16 — migração Prisma para adicionar 2 colunas à tabela `tarefas`
**Testes**: Jest + Supertest (backend) / Vitest + React Testing Library (frontend) — sem alteração
**Plataforma Alvo**: Web — sem alteração
**Tipo de Projeto**: Extensão de feature existente (feature 001)
**Metas de Desempenho**: Cálculo de horário de término em tempo real (< 100ms); sem novas metas de throughput
**Restrições**: Retrocompatível — campos opcionais, sem quebra de clientes existentes
**Escala/Escopo**: Mesma base de usuários da feature 001

## Constitution Check

*GATE: Deve passar antes da Phase 0. Reavaliado após Phase 1.*

| Princípio | Gate | Status | Observação |
|-----------|------|--------|-----------|
| I. Código Limpo | Funções ≤ 20 linhas; nomes revelam intenção | ✅ | Funções auxiliares para cálculo de horário de término |
| II. TDD (INEGOCIÁVEL) | Testes escritos e falhando ANTES de qualquer implementação | ✅ | Testes de modificação/regressão nos serviços e componentes existentes |
| III. Design Centrado no Usuário | Feature com histórias e critérios mensuráveis | ✅ | 2 histórias de usuário, 4 critérios de sucesso |
| IV. Git Flow | Feature branch de `develop` | ✅ | Branch `002-horario-duracao-tarefa` ativo |
| V. Commits Semânticos | Conventional Commits em português | ✅ | |
| Idioma | Novos campos em português; exceções para libs externas | ✅ | `horarioInicio`, `duracao`, `horarioFim`, `duracaoFormatada` |

**Nenhuma violação. Complexidade Tracking vazio.**

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/002-horario-duracao-tarefa/
├── plan.md              # Este arquivo
├── research.md          # Decisões de armazenamento e integração
├── data-model.md        # Mudanças no schema Prisma
├── contracts/
│   └── api-contrato.md  # Extensões do contrato da API
└── tasks.md             # Gerado por /speckit-tasks
```

### Arquivos Modificados (sem criação de novos arquivos de código)

```text
backend/
├── prisma/
│   ├── schema.prisma              # + horarioInicio (String?) e duracao (Int?)
│   └── migrations/<timestamp>/   # Nova migração gerada pelo Prisma
├── src/
│   └── servicos/
│       └── tarefasServico.js      # + validação e persistência dos novos campos
│                                  # + função calcularHorarioFim()
│                                  # + função formatarDuracao()
└── testes/
    ├── contrato/
    │   └── tarefas.test.js        # + testes para horarioInicio e duracao
    └── unidade/
        └── tarefasServico.test.js # + testes para calcularHorarioFim e formatarDuracao

frontend/
└── src/
    ├── componentes/
    │   ├── Tarefa/
    │   │   ├── FormularioTarefa.jsx  # + campos de horário e duração + cálculo em tempo real
    │   │   └── CartaoTarefa.jsx      # + exibição de horário e duração formatada
    │   └── Calendario/
    │       └── Calendario.jsx        # + views day/week + mapeamento com timestamp completo
    └── testes/
        ├── componentes/
        │   ├── FormularioTarefa.test.jsx  # + testes dos novos campos
        │   └── CartaoTarefa.test.jsx      # + testes de exibição de horário
        └── (novos)
            └── Calendario.test.jsx        # Testes das visões diária e semanal
```

**Decisão de estrutura**: Extensão in-place — nenhum arquivo novo de código de produção é criado. Apenas migração de banco e testes novos/atualizados.

## Complexity Tracking

> Nenhuma violação da constituição identificada. Tabela vazia.

---

## Fases de Implementação

### Phase 0 — Pesquisa e Decisões Técnicas ✅ Concluída

Resultados em [research.md](./research.md).

**Decisões tomadas**:
- `horarioInicio`: armazenado como `String "HH:MM"` (evita complexidade de tipo Time no Prisma)
- `duracao`: armazenado como `Int` (minutos, min 1)
- `horarioFim` e `duracaoFormatada`: campos calculados, não armazenados
- Visões diária e semanal: prop `views` do react-big-calendar estendida com `'day'` e `'week'`
- Tarefas sem horário: mapeadas como `allDay: true` nas novas visões

### Phase 1 — Design e Contratos ✅ Concluída

| Artefato | Arquivo | Status |
|----------|---------|--------|
| Modelo de dados (diff) | [data-model.md](./data-model.md) | ✅ |
| Contrato da API (extensão) | [contracts/api-contrato.md](./contracts/api-contrato.md) | ✅ |

**Constitution Check pós-design**:
- Retrocompatibilidade confirmada: campos opcionais, null por padrão ✅
- Cálculo de horário de término fora do banco (sem coluna computada) ✅
- Nomes em português para todos os novos campos ✅

### Phase 2 — Geração de Tarefas

Executar `/speckit-tasks` para gerar `tasks.md` com as tarefas atômicas.
