---
description: "Lista de tarefas para implementação de Horário e Duração de Tarefas"
---

# Tarefas: Horário e Duração de Tarefas

**Input**: Documentos de design em `specs/002-horario-duracao-tarefa/`
**Pré-requisitos**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅
**Tipo**: Extensão da feature 001 (Organizador de Tarefas) — modifica arquivos existentes

**TDD OBRIGATÓRIO** (Princípio II da Constituição): Testes DEVEM ser escritos e falhar ANTES de qualquer implementação.

**Nenhum arquivo novo de código de produção** — apenas modificações nos existentes e uma nova migração Prisma.

## Formato: `[ID] [P?] [Historia?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Historia]**: História de usuário a que a tarefa pertence (US1, US2)

---

## Fase 1: Setup (Migração do Banco)

**Propósito**: Adicionar os novos campos ao schema e banco de dados antes de qualquer código de aplicação

- [x] T001 Adicionar campos `horarioInicio` (String?) e `duracao` (Int?) ao model Tarefa em backend/prisma/schema.prisma conforme data-model.md
- [x] T002 Gerar e aplicar migração Prisma criando colunas `horario_inicio` e `duracao` na tabela `tarefas` com as constraints de validação definidas em data-model.md

---

## Fase 2: Fundacional (Funções Auxiliares Compartilhadas)

**Propósito**: Implementar helpers usados por ambas as histórias de usuário

**⚠️ CRÍTICO**: As funções auxiliares devem estar prontas antes de qualquer implementação de HU

- [x] T003 Adicionar função `calcularHorarioFim(horarioInicio, duracao)` ao backend/src/servicos/tarefasServico.js — recebe "HH:MM" e minutos, retorna "HH:MM" (suporta ultrapassagem de meia-noite)
- [x] T004 Adicionar função `formatarDuracao(minutos)` ao backend/src/servicos/tarefasServico.js — retorna string legível (ex.: 90 → "1h 30min", 45 → "45min", 120 → "2h")

**Ponto de verificação**: Helpers prontos — implementação das histórias pode começar

---

## Fase 3: História de Usuário 1 — Registrar Horário de Início e Duração (Prioridade: P1) 🎯 MVP

**Objetivo**: Usuário consegue registrar, editar e visualizar horário de início e duração em qualquer tarefa

**Teste Independente**: Criar tarefa via POST /api/tarefas com horarioInicio e duracao, verificar que horarioFim e duracaoFormatada são retornados corretamente; verificar que CartaoTarefa exibe os dados

### Testes para HU1 — ESCREVER PRIMEIRO, GARANTIR QUE FALHEM ⚠️

> **OBRIGATÓRIO (Princípio II TDD)**: Escreva estes testes ANTES de qualquer implementação. Confirme que FALHAM antes de prosseguir.

- [x] T005 [P] [US1] Escrever testes de contrato falhando para horarioInicio e duracao em POST /api/tarefas e PUT /api/tarefas/:id em backend/testes/contrato/tarefas.test.js (incluir casos: campo válido, horario sem data → 400, duracao=0 → 400, formato inválido → 400)
- [x] T006 [P] [US1] Escrever testes unitários falhando para calcularHorarioFim() (casos: normal, ultrapassagem meia-noite) em backend/testes/unidade/tarefasServico.test.js
- [x] T007 [P] [US1] Escrever testes unitários falhando para formatarDuracao() (casos: só minutos, só horas, horas e minutos) em backend/testes/unidade/tarefasServico.test.js
- [x] T008 [P] [US1] Escrever testes falhando para FormularioTarefa com campos de horário e duração e exibição do horário de término calculado em frontend/testes/componentes/FormularioTarefa.test.jsx
- [x] T009 [P] [US1] Escrever testes falhando para CartaoTarefa exibindo horarioInicio e duracaoFormatada quando presentes em frontend/testes/componentes/CartaoTarefa.test.jsx

### Implementação do Backend — HU1

- [x] T010 [US1] Atualizar `criar()` em backend/src/servicos/tarefasServico.js para validar e persistir horarioInicio (regex HH:MM, exige data) e duracao (>= 1); usar calcularHorarioFim() e formatarDuracao() no retorno
- [x] T011 [US1] Atualizar `atualizar()` em backend/src/servicos/tarefasServico.js para aceitar horarioInicio e duracao; limpar horarioInicio automaticamente quando data for definida como null
- [x] T012 [US1] Atualizar `buscarPorId()` e `listar()` em backend/src/servicos/tarefasServico.js para incluir horarioFim e duracaoFormatada em todos os objetos Tarefa retornados

### Implementação do Frontend — HU1

- [x] T013 [US1] Atualizar frontend/src/componentes/Tarefa/FormularioTarefa.jsx adicionando campo `<input type="time">` para horarioInicio e campo `<input type="number" min="1">` para duracao; calcular e exibir horarioFim em tempo real sem salvar
- [x] T014 [US1] Atualizar frontend/src/componentes/Tarefa/CartaoTarefa.jsx para exibir horarioInicio e duracaoFormatada abaixo do título quando presentes

**Ponto de verificação**: HU1 completamente funcional — registrar, editar e visualizar horário/duração. Testar independentemente antes de avançar.

---

## Fase 4: História de Usuário 2 — Calendário com Posicionamento por Horário (Prioridade: P2)

**Objetivo**: Tarefas com horário aparecem posicionadas nos blocos corretos nas visões diária e semanal

**Teste Independente**: Criar duas tarefas com horários distintos no mesmo dia; abrir visão diária e verificar que estão posicionadas nos blocos de horário corretos; tarefa sem horário aparece em área "sem horário"

### Testes para HU2 — ESCREVER PRIMEIRO, GARANTIR QUE FALHEM ⚠️

- [x] T015 [P] [US2] Escrever testes falhando para Calendario.jsx com visões day e week (abas disponíveis, eventos posicionados por horário, tarefas sem horário como allDay) em frontend/testes/componentes/Calendario.test.jsx

### Implementação do Frontend — HU2

- [x] T016 [US2] Atualizar frontend/src/componentes/Calendario/Calendario.jsx adicionando `'week'` e `'day'` ao prop `views` e ao seletor de abas existente
- [x] T017 [US2] Atualizar função `tarefaParaEvento()` em frontend/src/componentes/Calendario/Calendario.jsx para construir timestamps completos (data + horarioInicio) no `start`; calcular `end` somando duracao; definir `allDay: true` para tarefas sem horarioInicio
- [x] T018 [US2] Atualizar mensagens de localização em frontend/src/componentes/Calendario/Calendario.jsx adicionando rótulos em português para as novas visões ("Dia", "Semana") no objeto `messages`

**Ponto de verificação**: HU1 e HU2 funcionam independentemente. Testar ambas antes de prosseguir.

---

## Fase Final: Polish e Validação

- [x] T019 [P] Verificar que CartaoTarefa exibe tarefas sem horário sem espaço em branco ou campos vazios visíveis em frontend/src/componentes/Tarefa/CartaoTarefa.jsx
- [x] T020 Executar suite completa de testes do backend e frontend para confirmar ausência de regressões nas funcionalidades da feature 001

---

## Dependências e Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Nenhuma — iniciar imediatamente
- **Fundacional (Fase 2)**: Depende de T001 e T002 (schema atualizado no banco)
- **HU1 (Fase 3)**: Depende de T003 e T004 (helpers prontos)
- **HU2 (Fase 4)**: Depende de HU1 (backend precisa retornar horarioInicio para o frontend construir os eventos com horário)
- **Polish (Fase Final)**: Depende de HU1 e HU2 completas

### Dentro de cada História

- Testes DEVEM ser escritos e FALHAR antes de qualquer implementação (TDD obrigatório)
- Backend antes de frontend (novos campos precisam estar na API)

### Oportunidades de Paralelismo

- T005, T006, T007, T008, T009 — todos os testes de HU1 em paralelo (antes de implementar)
- T010, T011 — podem ser escritos em paralelo (funções distintas no mesmo arquivo)
- T013, T014 — arquivos diferentes, podem ser escritos em paralelo

---

## Estratégia de Implementação

### MVP Primeiro (somente HU1)

1. Fase 1: Setup (migração)
2. Fase 2: Helpers (calcularHorarioFim, formatarDuracao)
3. Fase 3: HU1 (registrar e exibir horário/duração)
4. **PARAR E VALIDAR**: Testar HU1 independentemente
5. Avançar para HU2 quando aprovado

### Entrega Incremental

1. Migração + helpers → Base pronta
2. HU1 → Testar → Demo (MVP: registro de horário funciona)
3. HU2 → Testar → Demo (calendário com posicionamento por horário)
4. Polish → Verificação de regressões

---

## Notas

- [P] = arquivos diferentes, sem dependências entre si
- Esta é uma extensão — não criar arquivos novos de produção além da migração Prisma
- TDD é inegociável (Princípio II): confirme que os testes falham ANTES de implementar
- Verificar regressão nos testes existentes da feature 001 após cada fase
- Commit após cada tarefa ou grupo lógico com mensagem semântica em português
