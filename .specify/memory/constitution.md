<!--
SYNC IMPACT REPORT
==================
Version change: [template] → 1.0.0
Added principles:
  - I. Código Limpo (Clean Code)
  - II. TDD — Desenvolvimento Orientado a Testes (NON-NEGOTIABLE)
  - III. Design Centrado no Usuário
  - IV. Versionamento com Git Flow
  - V. Commits Semânticos
Added sections:
  - Idioma e Documentação
  - Fluxo de Desenvolvimento
  - Governance
Templates status:
  - .specify/templates/plan-template.md  ✅ alinhado (Constitution Check já presente)
  - .specify/templates/spec-template.md  ✅ alinhado (user stories + cenários de aceite)
  - .specify/templates/tasks-template.md ✅ alinhado (TDD: testes antes da implementação)
  - README.md                            ⚠ pendente (não existe; criar quando relevante)
Follow-up TODOs:
  - Nenhum placeholder deferido.
-->

# Introdução ao Claude Code — Constituição

## Princípios Fundamentais

### I. Código Limpo (Clean Code)

O código DEVE ser legível, expressivo e livre de duplicação. As seguintes regras são inegociáveis:

- Nomes de variáveis, funções, classes e módulos DEVEM revelar intenção — sem abreviações obscuras.
- Funções DEVEM fazer uma única coisa e fazê-la bem; comprimento máximo recomendado: 20 linhas.
- Comentários DEVEM explicar *por que*, nunca *o que* — código autoexplicativo dispensa comentários descritivos.
- Duplicação de lógica é PROIBIDA; extraia funções, classes ou módulos reutilizáveis.
- A regra do Escoteiro se aplica: sempre deixe o código mais limpo do que encontrou.
- Complexidade ciclomática acima de 10 por função DEVE ser justificada e revisada.

**Rationale**: Código limpo reduz a carga cognitiva, facilita manutenção e diminui a incidência de bugs.

### II. TDD — Desenvolvimento Orientado a Testes (INEGOCIÁVEL)

O ciclo Red-Green-Refactor DEVE ser seguido rigorosamente em toda implementação:

1. **Red**: Escreva o teste que expressa o comportamento desejado. O teste DEVE falhar antes de qualquer implementação.
2. **Green**: Implemente o mínimo de código necessário para o teste passar.
3. **Refactor**: Melhore o código sem alterar comportamento, mantendo todos os testes verdes.

Regras adicionais:

- Nenhuma linha de código de produção pode ser escrita sem um teste vermelho precedente.
- Testes DEVEM ser legíveis como especificação do comportamento (BDD-style: Given/When/Then).
- Cobertura mínima de 80% para código de produção crítico.
- Testes de contrato DEVEM existir para toda interface entre módulos.
- Mocks DEVEM ser usados apenas em fronteiras externas (APIs, bancos de dados, sistema de arquivos).

**Rationale**: TDD garante que o código seja testável por design, documenta comportamento esperado e previne regressões.

### III. Design Centrado no Usuário

Toda funcionalidade DEVE partir das necessidades reais do usuário, não de conveniências técnicas:

- Toda feature DEVE ser precedida por pelo menos uma história de usuário com critérios de aceite mensuráveis.
- Interfaces (UI, CLI, API) DEVEM seguir o princípio da menor surpresa — comportamento previsível e consistente.
- Erros DEVEM ser comunicados em linguagem clara, orientada à ação do usuário, nunca em jargão técnico.
- Feedback imediato DEVE ser fornecido para toda ação do usuário que demore mais de 200ms.
- Acessibilidade (a11y) DEVE ser considerada desde a concepção, não como adição posterior.
- Decisões de UX DEVEM ser validadas com usuários reais sempre que possível antes da implementação.

**Rationale**: Software que não serve ao usuário não tem valor, independentemente de sua elegância técnica.

### IV. Versionamento com Git Flow

O fluxo de trabalho Git Flow é obrigatório. A estrutura de branches DEVE seguir:

- **`main`**: código de produção — apenas releases aprovadas e tags de versão.
- **`develop`**: integração contínua de features — branch base para desenvolvimento.
- **`feature/<nome>`**: uma feature por branch, criada a partir de `develop`.
- **`release/<versão>`**: preparação de release — criada a partir de `develop`, mesclada em `main` e `develop`.
- **`hotfix/<nome>`**: correções urgentes em produção — criada a partir de `main`, mesclada em `main` e `develop`.

Regras:

- Pull Requests DEVEM ter pelo menos uma aprovação antes de serem mesclados.
- Squash merge DEVE ser usado para features, preservando histórico limpo em `develop`.
- Tags de versão seguem Semantic Versioning (MAJOR.MINOR.PATCH) e DEVEM ser criadas em `main`.
- Branches de feature DEVEM ser deletadas após o merge.

**Rationale**: Git Flow oferece rastreabilidade, isolamento de mudanças e processo claro de release.

### V. Commits Semânticos

Todas as mensagens de commit DEVEM seguir a especificação Conventional Commits:

```
<tipo>(<escopo>): <descrição curta em português>

[corpo opcional — explica o porquê, não o quê]

[rodapé opcional — breaking changes, referências a issues]
```

Tipos permitidos:

| Tipo       | Uso                                                  |
|------------|------------------------------------------------------|
| `feat`     | Nova funcionalidade para o usuário                   |
| `fix`      | Correção de bug                                      |
| `docs`     | Alterações apenas em documentação                    |
| `style`    | Formatação, ponto-e-vírgula, sem mudança de lógica   |
| `refactor` | Refatoração sem adição de feature ou correção de bug |
| `test`     | Adição ou correção de testes                         |
| `chore`    | Atualização de ferramentas, dependências, build      |
| `perf`     | Melhoria de desempenho                               |
| `ci`       | Mudanças em configuração de CI/CD                    |

Regras:

- A descrição DEVE estar em português e no imperativo ("adiciona", "corrige", "remove").
- Breaking changes DEVEM incluir `BREAKING CHANGE:` no rodapé.
- O escopo é opcional, mas recomendado para projetos com múltiplos módulos.
- Commits atômicos: cada commit DEVE representar uma única mudança lógica.

**Rationale**: Commits semânticos habilitam geração automática de changelogs e comunicam intenção de forma padronizada.

## Idioma e Documentação

O Português Brasileiro é o idioma oficial do projeto. Esta regra é inegociável:

- Todo código-fonte DEVE usar português para: nomes de variáveis, funções, classes, métodos, comentários e strings visíveis ao usuário.
- Toda documentação (README, specs, planos, changelogs, wikis) DEVE ser redigida em português.
- Mensagens de commit DEVEM estar em português (conforme Princípio V).
- Nomes de arquivos e diretórios DEVEM ser em português sempre que tecnicamente viável.
- Exceções permitidas: identificadores de bibliotecas externas, convenções técnicas obrigatórias (ex.: `index.html`, `main`, `id`), e termos sem tradução consagrada.

**Rationale**: Consistência de idioma reduz fricção de comunicação entre membros da equipe e garante que a documentação seja acessível ao público-alvo.

## Fluxo de Desenvolvimento

O ciclo de vida de toda feature DEVE seguir esta sequência:

1. **Especificação** (`/speckit-specify`): descrever a feature em história de usuário com critérios de aceite.
2. **Clarificação** (`/speckit-clarify`): resolver ambiguidades antes de planejar.
3. **Planejamento** (`/speckit-plan`): definir abordagem técnica e estrutura.
4. **Tarefas** (`/speckit-tasks`): decompor em tarefas atômicas ordenadas.
5. **Implementação** (`/speckit-implement`): executar seguindo TDD (Princípio II).
6. **Análise** (`/speckit-analyze`): verificar consistência entre artefatos.
7. **Review**: Pull Request com checagem da constituição antes do merge.

Nenhuma feature pode pular etapas sem justificativa registrada.

## Governance

Esta constituição é o documento de maior autoridade do projeto. Toda prática, processo ou decisão técnica DEVE estar alinhada com os princípios aqui definidos.

**Processo de emenda**:

1. Propor a alteração via Pull Request com justificativa documentada.
2. Toda emenda DEVE ser aprovada por pelo menos um mantenedor do projeto.
3. Após aprovação, a versão DEVE ser incrementada conforme as regras de versionamento semântico da constituição:
   - MAJOR: remoção ou redefinição incompatível de princípios.
   - MINOR: adição de novo princípio ou seção com expansão material.
   - PATCH: esclarecimentos, correções de redação, refinamentos sem impacto semântico.
4. Todos os templates dependentes DEVEM ser verificados e atualizados na mesma PR.

**Conformidade**:

- Todo Pull Request DEVE verificar conformidade com esta constituição antes de ser aprovado.
- Violações DEVEM ser registradas com justificativa no campo "Complexity Tracking" do plano.
- Complexidade extra DEVE sempre ser justificada — simplicidade é o padrão.

**Version**: 1.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
