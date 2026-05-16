# Especificação de Feature: Organizador de Tarefas

**Branch da Feature**: `001-organizador-tarefas`
**Criado em**: 2026-05-16
**Status**: Implementado
**Entrada**: Descrição do usuário: "Crie um aplicativo que me ajude a organizar minhas tarefas. As tarefas são agrupados por data e podem ser reorganizados arrastando e soltando em um calendário. Tarefas podem possuir uma tarefa pai e diversas tarefas filhas. As tarefas possuem status como pendente, em planejamento, em execução e concluída. As tarefas podem ser visualizadas individualmente, em uma árvore hierarquica ou no calendário."

---

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 — Gerenciar Tarefas Básicas (Prioridade: P1)

Como usuário, quero criar, visualizar, editar e excluir tarefas individualmente, para que eu possa registrar e acompanhar o que preciso fazer.

**Por que esta prioridade**: Sem a capacidade de criar e gerenciar tarefas individualmente, nenhuma outra funcionalidade faz sentido. É o núcleo do aplicativo.

**Teste Independente**: Pode ser completamente testado criando uma tarefa, editando seus dados, alterando seu status e excluindo-a — sem necessidade de calendário ou hierarquia.

**Cenários de Aceite**:

1. **Dado** que estou na tela principal, **Quando** crio uma nova tarefa informando título, data e status inicial, **Então** a tarefa aparece listada com os dados informados e status "pendente" como padrão.
2. **Dado** que visualizo uma tarefa, **Quando** edito seu título ou data, **Então** as alterações são salvas e refletidas imediatamente na interface.
3. **Dado** que uma tarefa existe, **Quando** altero seu status para "em planejamento", "em execução" ou "concluída", **Então** o novo status é exibido visualmente com distinção clara (cor ou ícone).
4. **Dado** que visualizo uma tarefa, **Quando** solicito sua exclusão e confirmo, **Então** a tarefa é removida do sistema e não aparece mais em nenhuma visualização.

---

### História de Usuário 2 — Organizar Tarefas no Calendário com Arrastar e Soltar (Prioridade: P2)

Como usuário, quero visualizar minhas tarefas em um calendário e reorganizá-las arrastando-as para outras datas, para que eu possa planejar minha agenda visualmente.

**Por que esta prioridade**: A visão de calendário com arrastar e soltar é o diferencial central do aplicativo para planejamento temporal.

**Teste Independente**: Pode ser testado criando tarefas com datas e verificando se aparecem no calendário nas datas corretas, e se arrastar para outra data atualiza a data da tarefa.

**Cenários de Aceite**:

1. **Dado** que estou na visão de calendário, **Quando** visualizo o mês corrente, **Então** cada tarefa aparece no dia correspondente à sua data, com título e indicador de status visíveis.
2. **Dado** que visualizo o calendário, **Quando** arrasto uma tarefa de um dia para outro, **Então** a data da tarefa é atualizada para o dia de destino e a tarefa aparece no novo dia imediatamente.
3. **Dado** que visualizo o calendário, **Quando** há múltiplas tarefas em um mesmo dia, **Então** todas são exibidas de forma legível naquele dia, ordenadas automaticamente por status (pendente → em planejamento → em execução → concluída).
4. **Dado** que estou no calendário, **Quando** navego entre meses, **Então** as tarefas do mês selecionado são exibidas corretamente.
5. **Dado** que estou na visão de calendário, **Quando** clico em um dia específico, **Então** o formulário de criação de tarefa é aberto com a data daquele dia preenchida automaticamente.

---

### História de Usuário 3 — Visualizar e Gerenciar Hierarquia de Tarefas (Prioridade: P3)

Como usuário, quero organizar tarefas em hierarquias pai-filho e visualizá-las em uma árvore, para que eu possa decompor trabalhos complexos em subtarefas.

**Por que esta prioridade**: A hierarquia enriquece o gerenciamento de projetos complexos, mas não é pré-requisito para o uso básico do aplicativo.

**Teste Independente**: Pode ser testado criando uma tarefa pai com duas subtarefas e verificando se a árvore exibe o relacionamento corretamente.

**Cenários de Aceite**:

1. **Dado** que crio uma tarefa, **Quando** associo outra tarefa como sua filha, **Então** a relação pai-filho é estabelecida e visível na visão em árvore.
2. **Dado** que visualizo a árvore hierárquica, **Quando** expando uma tarefa pai, **Então** todas as suas tarefas filhas são exibidas com indentação visual adequada.
3. **Dado** que uma tarefa possui filhas, **Quando** visualizo o status da tarefa pai, **Então** há uma indicação visual do progresso agregado baseado nos status das filhas.
4. **Dado** que visualizo a árvore, **Quando** movo uma tarefa filha para outro pai, **Então** a hierarquia é atualizada corretamente em todas as visões.
5. **Dado** que uma tarefa possui filhas, **Quando** a excluo, **Então** o sistema alerta sobre as subtarefas existentes e pede confirmação antes de excluir o conjunto.

---

### Casos Extremos

- O que acontece quando uma tarefa não possui data definida? A tarefa existe mas não aparece no calendário; fica acessível em uma lista de "sem data".
- Como o sistema lida com uma hierarquia muito profunda (mais de 5 níveis)? Exibe normalmente, sem limite definido de profundidade, com rolagem vertical se necessário.
- O que acontece ao arrastar uma tarefa pai no calendário? Apenas a data da tarefa pai é alterada; as filhas mantêm suas próprias datas.
- Como são exibidas tarefas "concluídas" no calendário? Visíveis, mas com visual diferenciado — por exemplo, riscadas ou com opacidade reduzida.

---

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O sistema DEVE permitir criar tarefas com título (obrigatório), data (opcional) e status inicial (padrão: pendente).
- **RF-002**: O sistema DEVE permitir editar título, data e status de qualquer tarefa existente.
- **RF-003**: O sistema DEVE permitir excluir tarefas, com confirmação obrigatória quando a tarefa possuir subtarefas.
- **RF-004**: O sistema DEVE suportar quatro status de tarefa: **pendente**, **em planejamento**, **em execução** e **concluída**, com representação visual distinta para cada um. A transição entre status é livre — qualquer status pode ser alterado para qualquer outro sem restrição de sequência.
- **RF-005**: O sistema DEVE exibir tarefas em visão de calendário, agrupadas por data.
- **RF-006**: O sistema DEVE permitir reorganizar tarefas no calendário por arrastar e soltar, atualizando a data da tarefa automaticamente.
- **RF-007**: O sistema DEVE permitir associar uma tarefa como filha de outra tarefa (relação pai-filho).
- **RF-008**: O sistema DEVE exibir tarefas em visão de árvore hierárquica, com expansão e colapso de nós.
- **RF-009**: O sistema DEVE exibir cada tarefa individualmente com todos os seus dados e relacionamentos (pai, filhas, status).
- **RF-010**: O sistema DEVE permitir navegar entre meses no calendário.
- **RF-011**: O sistema DEVE exibir indicador visual de progresso agregado em tarefas pai baseado nos status das filhas.
- **RF-012**: Tarefas sem data DEVEM ser acessíveis em uma área dedicada fora do calendário.
- **RF-013**: O sistema DEVE exigir autenticação por email e senha para acessar e gerenciar tarefas; o cadastro de novos usuários é gerenciado pelo próprio aplicativo.
- **RF-014**: Cada usuário autenticado DEVE visualizar e gerenciar apenas suas próprias tarefas, sem acesso a dados de outros usuários.
- **RF-015**: O sistema DEVE permitir criar uma nova tarefa diretamente pelo calendário, clicando em um dia; o formulário de criação DEVE abrir com a data do dia clicado preenchida automaticamente.
- **RF-016**: Quando um dia do calendário exibir múltiplas tarefas, o sistema DEVE ordená-las automaticamente por status, seguindo a sequência: pendente → em planejamento → em execução → concluída.

### Entidades Principais

- **Usuário**: Titular de uma conta no sistema. Atributos: nome (obrigatório), email (obrigatório, único no sistema), senha (armazenada de forma segura, nunca em texto plano). Cada usuário possui um conjunto isolado de tarefas.
- **Tarefa**: Unidade fundamental do sistema, sempre associada a um Usuário. Atributos: título (obrigatório), data (opcional), status (obrigatório, padrão: pendente), referência à tarefa pai (opcional), lista de referências às tarefas filhas (pode ser vazia).
- **Status**: Enumeração com quatro valores: pendente, em planejamento, em execução, concluída. Cada valor possui representação visual distinta (cor e/ou ícone). Transições entre status são livres, sem restrição de sequência.
- **Hierarquia**: Relação entre tarefas do mesmo usuário. Uma tarefa pode ter no máximo um pai e múltiplas filhas. Uma tarefa filha pode também ser pai de outras tarefas (hierarquia multinível).

---

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: O usuário consegue criar, visualizar e alterar o status de uma tarefa em menos de 30 segundos.
- **CS-002**: O usuário consegue reorganizar uma tarefa no calendário (arrastar e soltar) com a nova data refletida imediatamente após soltar.
- **CS-003**: O usuário consegue visualizar toda a hierarquia de um projeto com até 20 tarefas na visão em árvore sem necessidade de rolagem horizontal excessiva.
- **CS-004**: O calendário exibe corretamente todas as tarefas do mês selecionado, com distinção visual entre os quatro status.
- **CS-005**: 90% das ações principais (criar, editar, mover, expandir árvore) completam-se sem erros e sem necessidade de recarregar a aplicação.

---

## Premissas

- O aplicativo suporta múltiplos usuários com dados completamente isolados; não há funcionalidade de compartilhamento entre contas.
- Suporte a dispositivos desktop é prioridade; responsividade para dispositivos móveis é desejável mas não obrigatória para o MVP.
- Não há integração com serviços externos de calendário (como Google Calendar ou Outlook) no escopo desta feature.
- O sistema persiste dados em servidor associado a uma conta de usuário com autenticação simples; o acesso requer login.
- Não há funcionalidade de notificações ou lembretes no escopo inicial.
- Não há recuperação de senha no escopo inicial; o usuário que perder o acesso deve criar uma nova conta.
- Tarefas filhas não herdam automaticamente a data da tarefa pai; cada tarefa gerencia sua própria data de forma independente.

## Clarificações

### Sessão 2026-05-16

- Q: Modelo de persistência de dados (local vs. conta de usuário vs. híbrido) → A: Com conta de usuário — autenticação simples, dados salvos em servidor.
- Q: Regras de transição de status entre os quatro valores (livre, sequencial com retrocesso, somente para frente) → A: Livre — qualquer status pode ser alterado para qualquer outro sem restrição de sequência.
- Q: Criação de tarefas pela visão de calendário (sim com data preenchida / não, apenas formulário dedicado) → A: Sim — clicar em um dia abre o formulário de criação com a data preenchida automaticamente.
- Q: Ordenação de múltiplas tarefas no mesmo dia do calendário (manual, por status, por criação) → A: Por status — ordenadas automaticamente na sequência pendente → em planejamento → em execução → concluída.
- Q: Mecanismo de autenticação (email/senha, login social OAuth2, magic link) → A: Email e senha — cadastro e login clássicos, gerenciados pelo próprio aplicativo.
- Q: Recuperação de senha (sim com link por email / não, fora do escopo) → A: Não — sem recuperação de senha no escopo inicial.
- Q: Dados do usuário a armazenar além das credenciais (nome+email, nome+email+foto, só email) → A: Apenas nome e email — mínimo necessário para identificação e autenticação.
