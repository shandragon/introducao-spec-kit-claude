# Especificação de Feature: Horário e Duração de Tarefas

**Branch da Feature**: `002-horario-duracao-tarefa`
**Criado em**: 2026-05-16
**Status**: Implementado
**Entrada**: Descrição do usuário: "Como usuário do sistema, eu quero adicionar o horario de inicio e a duração da tarefa para obter uma melhor melhor organização das tarefas."

---

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 — Registrar Horário de Início e Duração (Prioridade: P1)

Como usuário, quero informar o horário de início e a duração esperada de uma tarefa ao criá-la ou editá-la, para que eu possa planejar meu dia com maior precisão além da data.

**Por que esta prioridade**: Sem a capacidade de registrar esses dados, nenhuma visualização temporal faz sentido. É o pré-requisito de todas as demais histórias.

**Teste Independente**: Pode ser completamente testado criando uma tarefa com horário de início e duração, editando esses valores e verificando que são salvos e exibidos corretamente — sem depender de visualização em calendário.

**Cenários de Aceite**:

1. **Dado** que estou criando ou editando uma tarefa, **Quando** informo um horário de início e uma duração, **Então** esses valores são salvos e exibidos corretamente nos detalhes da tarefa.
2. **Dado** que informei horário de início e duração, **Quando** visualizo os detalhes da tarefa, **Então** o horário de término é calculado e exibido automaticamente (início + duração).
3. **Dado** que uma tarefa já possui horário e duração cadastrados, **Quando** edito apenas a duração, **Então** o horário de término é recalculado automaticamente com base no novo valor.
4. **Dado** que estou criando uma tarefa, **Quando** não informo horário de início ou duração, **Então** a tarefa é salva normalmente sem esses campos — ambos são opcionais.
5. **Dado** que informo uma duração, **Quando** não informo horário de início, **Então** o sistema aceita a duração isoladamente sem calcular horário de término.

---

### História de Usuário 2 — Visualizar Tarefas Posicionadas por Horário no Calendário (Prioridade: P2)

Como usuário, quero que as tarefas com horário de início sejam exibidas posicionadas no horário correto dentro do dia no calendário, para que eu visualize minha agenda de forma mais clara e identifique conflitos.

**Por que esta prioridade**: Depende da HU1 (dados precisam existir) e agrega o maior valor percebido da feature — transformar o calendário de uma visão por data em uma agenda horária real.

**Teste Independente**: Pode ser testado criando duas tarefas com horários distintos no mesmo dia e verificando que aparecem posicionadas nos horários corretos na visualização diária ou semanal do calendário.

**Cenários de Aceite**:

1. **Dado** que uma tarefa possui horário de início, **Quando** visualizo o calendário em visão diária ou semanal, **Então** a tarefa aparece posicionada no bloco de horário correspondente ao seu início.
2. **Dado** que uma tarefa possui horário de início e duração, **Quando** visualizo o calendário em visão diária ou semanal, **Então** o bloco visual da tarefa tem altura proporcional à sua duração.
3. **Dado** que duas tarefas do mesmo dia têm horários sobrepostos, **Quando** visualizo o calendário, **Então** ambas são exibidas simultaneamente com indicação visual de sobreposição (dispostas lado a lado ou com destaque).
4. **Dado** que uma tarefa não possui horário de início, **Quando** visualizo o calendário em visão diária ou semanal, **Então** a tarefa aparece em uma área de "sem horário definido" no topo ou rodapé do dia.
5. **Dado** que estou na visão mensal existente, **Quando** visualizo tarefas com horário, **Então** o horário de início é exibido junto ao título da tarefa no bloco do dia.

---

### Casos Extremos

- O que acontece se a duração for maior que 24 horas? O sistema aceita e exibe corretamente (ex.: tarefa de 30 horas que ultrapassa a meia-noite).
- O que acontece se o horário de término ultrapassar a meia-noite? A tarefa é exibida nos dias abrangidos, com destaque visual indicando que continua no dia seguinte.
- O que acontece se o usuário informar uma duração de zero minutos? O sistema rejeita com mensagem orientativa — duração mínima é 1 minuto.
- Como são exibidas tarefas sem data mas com horário de início? Situação inválida — horário de início exige que uma data esteja definida. O sistema impede salvar horário sem data associada.

---

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O sistema DEVE permitir registrar um horário de início (hora e minuto) em qualquer tarefa que possua uma data definida.
- **RF-002**: O sistema DEVE permitir registrar uma duração em qualquer tarefa por meio de um campo numérico único em minutos (ex.: 90 para 1h30min), independentemente de ter horário de início. O sistema DEVE exibir a duração convertida para horas e minutos ao apresentar os detalhes da tarefa (ex.: "90 min → 1h 30min").
- **RF-003**: Quando uma tarefa possuir horário de início e duração, o sistema DEVE calcular e exibir automaticamente o horário de término.
- **RF-004**: Horário de início e duração DEVEM ser campos opcionais — a ausência de ambos não impede a criação ou edição de uma tarefa.
- **RF-005**: O sistema DEVE impedir registrar horário de início em tarefas sem data definida, com mensagem explicativa ao usuário.
- **RF-006**: O sistema DEVE rejeitar duração igual a zero, com mensagem orientativa indicando o valor mínimo aceito (1 minuto).
- **RF-007**: O sistema DEVE adicionar visões diária e semanal como novas abas no calendário, mantendo a visão mensal existente; tarefas com horário de início são posicionadas nos blocos de tempo correspondentes.
- **RF-008**: Na visão diária e semanal, o bloco visual de cada tarefa DEVE ter altura proporcional à sua duração quando esta estiver definida.
- **RF-009**: Tarefas com horários sobrepostos no mesmo dia DEVEM ser exibidas simultaneamente com indicação visual de sobreposição.
- **RF-010**: Tarefas sem horário de início DEVEM aparecer em área dedicada ("sem horário") nas visões diária e semanal.
- **RF-011**: Na visão mensal já existente, o horário de início DEVE ser exibido junto ao título da tarefa quando disponível.

### Entidades Afetadas

- **Tarefa** (existente — campos adicionados): `horarioInicio` (hora e minuto opcionais, exige data definida) e `duracao` (quantidade de minutos, opcional, mínimo 1 quando informada). O horário de término é calculado e não armazenado.

---

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: O usuário consegue registrar horário de início e duração em uma tarefa em menos de 30 segundos.
- **CS-002**: O horário de término é calculado e exibido imediatamente após o usuário informar início e duração, sem necessidade de salvar primeiro.
- **CS-003**: Na visão diária ou semanal, tarefas com horário aparecem posicionadas corretamente em seus respectivos blocos de tempo, sem sobreposição indevida com tarefas de outros horários.
- **CS-004**: 100% das tarefas sem horário definido são agrupadas visivelmente fora da grade de horários nas visões diária e semanal.

---

## Premissas

- Esta feature é uma extensão do Organizador de Tarefas existente (feature 001); requer que o sistema base esteja em funcionamento.
- Horário de início e duração são sempre opcionais — a feature não quebra o fluxo atual de tarefas sem horário.
- A duração é registrada pelo usuário como um número inteiro de minutos (ex.: 90); o sistema exibe a conversão legível (ex.: "1h 30min"). Frações de minuto não são suportadas.
- O fuso horário usado é o fuso local do dispositivo do usuário; sincronização de fuso entre dispositivos está fora do escopo.
- A detecção de conflito de horários é apenas visual (sobreposição exibida no calendário) — o sistema não bloqueia a criação de tarefas com horários sobrepostos.
- Notificações de lembrete baseadas em horário estão fora do escopo desta feature.

## Clarificações

### Sessão 2026-05-16

- Q: As visões diária e semanal substituem a visão mensal ou são adicionadas como novas abas? → A: Adicionadas — diária e semanal surgem como novas abas no calendário; a visão mensal existente é preservada.
- Q: Formato de entrada da duração (dois campos horas+minutos, campo único HH:MM, ou campo único em minutos) → A: Campo único em minutos — o usuário digita um inteiro (ex.: 90); o sistema exibe a conversão legível "1h 30min".
