# Especificação de Feature: Perfil do Usuário

**Feature Branch**: `003-perfil-usuario`
**Created**: 2026-05-16
**Status**: Implementado
**Input**: Descrição do usuário: "Quero que, ao logar, o usuário tenha uma opção de perfil, onde será possivel editar seu nome e e-mail. Deve ter uma opção de troca de senha, em que o usuário digita a senha atual, a nova senha e a confirmação da nova senha."

---

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 — Editar Nome e E-mail (Prioridade: P1)

Como usuário autenticado, quero acessar meu perfil e atualizar meu nome e e-mail, para que minhas informações pessoais estejam sempre corretas e atualizadas.

**Por que esta prioridade**: É a funcionalidade mais direta e de maior valor imediato. Permite ao usuário corrigir dados pessoais sem depender de suporte. Não depende da troca de senha.

**Teste Independente**: Pode ser testado fazendo login, acessando a tela de perfil, alterando nome e/ou e-mail, salvando e verificando que os novos dados são exibidos corretamente na interface — sem interagir com nenhum campo de senha.

**Cenários de Aceite**:

1. **Dado** que estou autenticado, **Quando** acesso a opção de perfil, **Então** vejo um formulário com meu nome e e-mail atuais preenchidos.
2. **Dado** que estou no formulário de perfil, **Quando** altero meu nome e salvo, **Então** o novo nome é salvo e exibido na interface (inclusive no cabeçalho da aplicação).
3. **Dado** que estou no formulário de perfil, **Quando** altero meu e-mail para um e-mail válido e único, **Então** o novo e-mail é salvo com sucesso.
4. **Dado** que estou no formulário de perfil, **Quando** tento salvar com o campo nome vazio, **Então** o sistema exibe uma mensagem de erro e não salva.
5. **Dado** que estou no formulário de perfil, **Quando** informo um e-mail inválido (sem @, sem domínio), **Então** o sistema rejeita com mensagem de orientação.
6. **Dado** que estou no formulário de perfil, **Quando** informo um e-mail já cadastrado por outro usuário, **Então** o sistema informa que o e-mail já está em uso.

---

### História de Usuário 2 — Trocar Senha (Prioridade: P2)

Como usuário autenticado, quero poder trocar minha senha informando a senha atual, a nova senha e sua confirmação, para manter minha conta segura sem precisar de suporte.

**Por que esta prioridade**: Complementa o gerenciamento de conta mas requer lógica de segurança adicional (validação da senha atual, regras de complexidade). Não bloqueia a HU1.

**Teste Independente**: Pode ser testado acessando a seção de troca de senha, preenchendo senha atual correta, nova senha e confirmação válidas, e verificando que a senha é alterada — confirmando com um logout e novo login com a senha nova.

**Cenários de Aceite**:

1. **Dado** que estou na tela de perfil, **Quando** acesso a seção de troca de senha, **Então** vejo três campos: senha atual, nova senha e confirmação da nova senha.
2. **Dado** que preenchi os três campos corretamente e a senha atual está correta, **Quando** confirmo a troca, **Então** minha senha é atualizada, a sessão é encerrada automaticamente e sou redirecionado para a tela de login com mensagem de sucesso.
3. **Dado** que informei uma senha atual incorreta, **Quando** confirmo a troca, **Então** o sistema rejeita com mensagem de erro sem revelar detalhes da conta.
4. **Dado** que a nova senha e a confirmação são diferentes, **Quando** confirmo a troca, **Então** o sistema rejeita com mensagem indicando que as senhas não coincidem.
5. **Dado** que a nova senha tem menos de 8 caracteres, **Quando** confirmo a troca, **Então** o sistema rejeita com mensagem indicando o comprimento mínimo.
6. **Dado** que a nova senha é idêntica à senha atual, **Quando** confirmo a troca, **Então** o sistema aceita normalmente (sem restrição de reutilização).

---

### Casos Extremos

- O que acontece se o usuário tentar acessar a tela de perfil sem estar autenticado? O sistema redireciona para a tela de login.
- O que acontece se a sessão expirar enquanto o usuário edita o perfil? O sistema rejeita o salvamento e redireciona para o login.
- O que acontece se dois usuários tentarem cadastrar o mesmo e-mail simultaneamente? O sistema garante unicidade — apenas o primeiro é aceito.
- O que acontece se o usuário deixar todos os campos de senha em branco e tentar salvar o perfil? A seção de troca de senha é ignorada — apenas nome e e-mail são salvos.

---

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O sistema DEVE exibir uma opção de acesso ao perfil no cabeçalho da aplicação (ex.: nome do usuário clicável), que navega para a página `/perfil`, acessível apenas por usuários autenticados.
- **RF-002**: O sistema DEVE apresentar um formulário de perfil com os campos nome e e-mail preenchidos com os dados atuais do usuário.
- **RF-003**: O sistema DEVE permitir que o usuário atualize seu nome, sendo o campo obrigatório e não vazio.
- **RF-004**: O sistema DEVE permitir que o usuário atualize seu e-mail, validando formato correto e unicidade no sistema.
- **RF-005**: O sistema DEVE exibir mensagens de erro descritivas para nome vazio, e-mail inválido e e-mail já em uso.
- **RF-006**: O sistema DEVE atualizar imediatamente o nome exibido na interface (ex.: saudação no cabeçalho) após salvar com sucesso.
- **RF-007**: O sistema DEVE disponibilizar uma seção de troca de senha com três campos: senha atual, nova senha e confirmação da nova senha.
- **RF-008**: O sistema DEVE validar que a senha atual informada corresponde à senha cadastrada antes de realizar a troca.
- **RF-009**: Após uma troca de senha bem-sucedida, o sistema DEVE encerrar automaticamente a sessão do usuário e redirecioná-lo para a tela de login com mensagem confirmando o sucesso da operação.
- **RF-010**: O sistema DEVE exigir que a nova senha e a confirmação sejam idênticas.
- **RF-011**: O sistema DEVE exigir que a nova senha tenha no mínimo 8 caracteres.
- **RF-012**: O sistema DEVE permitir salvar alterações de nome e e-mail sem necessidade de preencher os campos de senha.
- **RF-013**: A rota `/perfil` DEVE ser protegida — usuários não autenticados que tentarem acessá-la são redirecionados ao login.

### Entidades Afetadas

- **Usuário** (existente — campos atualizados): `nome` (editável) e `email` (editável, único). O campo `senha` é atualizado via fluxo dedicado com verificação da senha atual.

---

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: O usuário consegue atualizar nome e e-mail em menos de 30 segundos a partir do acesso à tela de perfil.
- **CS-002**: O nome atualizado é refletido em toda a interface sem necessidade de recarregar a página.
- **CS-003**: O usuário consegue trocar a senha em menos de 60 segundos a partir do acesso à seção correspondente.
- **CS-004**: 100% das tentativas de troca com senha atual incorreta são rejeitadas sem revelar informações da conta.
- **CS-005**: 100% das tentativas de cadastro de e-mail duplicado são rejeitadas com mensagem orientativa.

---

## Clarificações

### Sessão 2026-05-16

- Q: Após troca de senha bem-sucedida, o usuário permanece logado ou a sessão é encerrada? → A: A sessão é encerrada automaticamente e o usuário é redirecionado ao login com mensagem de sucesso.
- Q: Como a tela de perfil é apresentada ao usuário? → A: Página dedicada com rota própria (`/perfil`), seguindo o padrão das demais páginas da aplicação.

---

## Premissas

- O sistema de autenticação existente (JWT) é reutilizado — o perfil é uma extensão da conta já criada.
- A tela de perfil é uma página dedicada na rota `/perfil`, acessada a partir do nome do usuário clicável no cabeçalho da aplicação, seguindo o padrão de roteamento já adotado (`/entrar`, `/registrar`).
- Não há verificação por e-mail ao alterar o endereço de e-mail — a mudança é imediata (fora do escopo: fluxo de confirmação por e-mail).
- Não há requisito de complexidade de senha além do comprimento mínimo de 8 caracteres (já vigente no cadastro).
- Recuperação de senha por e-mail (esqueci minha senha) está fora do escopo desta feature.
- Upload de foto de perfil está fora do escopo desta feature.
