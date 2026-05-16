# Contrato de API: Perfil do Usuário

**Base URL**: `/api/perfil`
**Autenticação**: Bearer Token (JWT) obrigatório em todos os endpoints.
**Compatibilidade**: Extensão da API existente — nenhum endpoint existente é alterado.

---

## GET /api/perfil

Retorna os dados do usuário autenticado.

**Request**
```
GET /api/perfil
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "dados": {
    "id": "clx1234abc",
    "nome": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

**Response 401** — token ausente ou inválido
```json
{ "erro": "Token inválido ou expirado." }
```

---

## PUT /api/perfil

Atualiza nome e/ou e-mail do usuário autenticado.

**Request**
```
PUT /api/perfil
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João Souza",
  "email": "joao.souza@exemplo.com"
}
```

**Response 200**
```json
{
  "dados": {
    "id": "clx1234abc",
    "nome": "João Souza",
    "email": "joao.souza@exemplo.com"
  }
}
```

**Response 400** — dados inválidos (nome vazio, e-mail malformado)
```json
{ "erro": "Nome é obrigatório." }
```

**Response 409** — e-mail já em uso por outro usuário
```json
{ "erro": "Este email já está cadastrado no sistema.", "codigo": "EMAIL_DUPLICADO" }
```

**Response 401** — token ausente ou inválido
```json
{ "erro": "Token inválido ou expirado." }
```

---

## PUT /api/perfil/senha

Troca a senha do usuário autenticado. Em caso de sucesso, o cliente DEVE encerrar a sessão.

**Request**
```
PUT /api/perfil/senha
Authorization: Bearer <token>
Content-Type: application/json

{
  "senhaAtual": "minhasenhaatual",
  "novaSenha": "novasenha123",
  "confirmacaoNovaSenha": "novasenha123"
}
```

**Response 200**
```json
{
  "dados": {
    "mensagem": "Senha atualizada com sucesso. Faça login novamente."
  }
}
```

**Response 400** — nova senha e confirmação não coincidem, ou nova senha inválida
```json
{ "erro": "A nova senha e a confirmação não coincidem." }
```

```json
{ "erro": "A nova senha deve ter no mínimo 8 caracteres." }
```

**Response 401** — senha atual incorreta
```json
{ "erro": "Senha atual incorreta.", "codigo": "SENHA_INCORRETA" }
```

**Response 401** — token ausente ou inválido
```json
{ "erro": "Token inválido ou expirado." }
```

---

## Notas de implementação

- O campo `senha` nunca é retornado em nenhum endpoint de perfil.
- O backend não invalida o token JWT após a troca de senha — a sessão é encerrada pelo cliente ao receber o status `200` de `PUT /api/perfil/senha`.
- O middleware `autenticar` existente extrai `usuarioId` de `req.usuarioId` — todos os endpoints de perfil usam esse valor para identificar o usuário, nunca um ID vindo do body.
