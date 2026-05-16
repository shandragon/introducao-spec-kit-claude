# Research: Perfil do Usuário

## Decisão 1 — Armazenamento dos dados de perfil

**Decisão**: Reutilizar a entidade `Usuario` existente no Prisma. Nenhuma migração necessária.
**Rationale**: Os campos `nome`, `email` e `senha` já existem no modelo. A feature apenas expõe novos endpoints para leitura e atualização desses campos.
**Alternativas consideradas**: Tabela separada `Perfil` — rejeitada por sobrecarga sem benefício.

## Decisão 2 — Rotas da API de perfil

**Decisão**: Três endpoints sob `/api/perfil`, protegidos pelo middleware `autenticar` existente:
- `GET /api/perfil` — retorna dados do usuário autenticado
- `PUT /api/perfil` — atualiza nome e/ou e-mail
- `PUT /api/perfil/senha` — troca de senha (valida senha atual, exige nova + confirmação)

**Rationale**: Separar atualização de dados pessoais da troca de senha segue o princípio de responsabilidade única e permite que o frontend trate os dois fluxos de forma independente.
**Alternativas consideradas**: `PATCH /api/usuarios/:id` — rejeitado por expor ID do usuário na URL e misturar as duas operações.

## Decisão 3 — Comportamento pós-troca de senha

**Decisão**: O backend apenas retorna sucesso `200`. O frontend é responsável por chamar `sair()` do contexto de autenticação após o sucesso, limpando localStorage e redirecionando para `/entrar`.
**Rationale**: Mantém o backend stateless (JWT). A invalidação é do lado do cliente — padrão consistente com o modelo JWT existente.
**Alternativas consideradas**: Blacklist de tokens no backend — rejeitada por acrescentar estado e dependência de storage adicional.

## Decisão 4 — Componente Cabecalho compartilhado

**Decisão**: Extrair o `<header>` de `Principal.jsx` para um componente `Cabecalho` reutilizável em `frontend/src/componentes/Cabecalho/Cabecalho.jsx`.
**Rationale**: A página `/perfil` precisa do mesmo topbar (app shell). Duplicar o markup viola o Princípio I da constituição (sem duplicação). O componente recebe `usuario` e `aoSair` via props.
**Alternativas consideradas**: Repetir o markup na página Perfil — rejeitada por duplicação; Layout wrapper com React Router Outlet — over-engineering para 2 páginas.

## Decisão 5 — Página de perfil: visual

**Decisão**: A página `/perfil` reutiliza o app shell (`.pagina-principal`, `.pagina-principal__topbar`, `.pagina-principal__container`) e organiza o conteúdo em dois cards distintos:
1. **Card "Dados Pessoais"** — campos nome e e-mail + botão Salvar
2. **Card "Alterar Senha"** — campos senha atual, nova senha, confirmação + botão Alterar Senha

**Rationale**: Dois cards separados reforçam que são operações independentes (RF-011) e reutilizam `.pagina-principal__area-conteudo` já definida. Nenhuma nova variável CSS necessária.

## Decisão 6 — Contexto de autenticação

**Decisão**: Adicionar função `atualizarUsuario(dados)` ao `ContextoAutenticacao` para sincronizar nome/e-mail atualizado no estado global e no `localStorage` sem exigir novo login.
**Rationale**: Após salvar dados pessoais, o cabeçalho deve refletir o novo nome imediatamente (RF-006/CS-002) sem reload de página.
