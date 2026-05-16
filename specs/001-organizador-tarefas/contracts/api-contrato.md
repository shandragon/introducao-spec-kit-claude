# Contrato da API REST: Organizador de Tarefas

**Versão**: 1.0.0
**Base URL**: `/api`
**Autenticação**: Bearer Token (JWT) no header `Authorization` — obrigatório em todas as rotas exceto autenticação.
**Formato**: JSON (Content-Type: application/json)
**Idioma das respostas de erro**: Português

---

## Convenções

### Respostas de Sucesso

```json
{
  "dados": { ... }
}
```

### Respostas de Erro

```json
{
  "erro": "Mensagem descritiva em português orientada à ação do usuário",
  "codigo": "CODIGO_DO_ERRO"
}
```

### Códigos HTTP utilizados

| Código | Significado |
|--------|-------------|
| 200 | Sucesso com retorno de dados |
| 201 | Recurso criado com sucesso |
| 204 | Sucesso sem corpo de resposta |
| 400 | Dados inválidos na requisição |
| 401 | Não autenticado |
| 403 | Sem permissão para o recurso |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex.: email já cadastrado) |
| 500 | Erro interno do servidor |

---

## Módulo: Autenticação

### POST /api/autenticacao/registrar

Cria uma nova conta de usuário.

**Corpo da requisição**:
```json
{
  "nome": "Maria Silva",
  "email": "maria@exemplo.com",
  "senha": "minhasenha123"
}
```

**Resposta 201**:
```json
{
  "dados": {
    "usuario": {
      "id": "cuid...",
      "nome": "Maria Silva",
      "email": "maria@exemplo.com"
    },
    "token": "eyJhbGci..."
  }
}
```

**Erros**:
- 400: Campo obrigatório ausente ou senha muito curta (mínimo 8 caracteres)
- 409: Email já cadastrado no sistema

---

### POST /api/autenticacao/entrar

Autentica um usuário existente e retorna um token JWT.

**Corpo da requisição**:
```json
{
  "email": "maria@exemplo.com",
  "senha": "minhasenha123"
}
```

**Resposta 200**:
```json
{
  "dados": {
    "usuario": {
      "id": "cuid...",
      "nome": "Maria Silva",
      "email": "maria@exemplo.com"
    },
    "token": "eyJhbGci..."
  }
}
```

**Erros**:
- 400: Campo obrigatório ausente
- 401: Email ou senha incorretos

---

## Módulo: Tarefas

Todas as rotas deste módulo requerem autenticação. O sistema retorna apenas tarefas do usuário autenticado.

### GET /api/tarefas

Lista tarefas do usuário com filtros opcionais.

**Query params**:
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| mes | String (YYYY-MM) | Filtra tarefas do mês (para calendário) |
| status | String | Filtra por status: PENDENTE, EM_PLANEJAMENTO, EM_EXECUCAO, CONCLUIDA |
| semData | Boolean | Se `true`, retorna apenas tarefas sem data |
| paiId | String | Filtra tarefas filhas de uma tarefa específica |

**Resposta 200**:
```json
{
  "dados": {
    "tarefas": [
      {
        "id": "cuid...",
        "titulo": "Estudar para a prova",
        "data": "2026-05-20T00:00:00.000Z",
        "status": "PENDENTE",
        "paiId": null,
        "quantidadeFilhas": 3,
        "progressoFilhas": {
          "total": 3,
          "concluidas": 1
        },
        "criadoEm": "2026-05-16T10:00:00.000Z"
      }
    ]
  }
}
```

**Ordenação**: quando `mes` informado, tarefas do mesmo dia são ordenadas por status (PENDENTE → EM_PLANEJAMENTO → EM_EXECUCAO → CONCLUIDA).

---

### POST /api/tarefas

Cria uma nova tarefa para o usuário autenticado.

**Corpo da requisição**:
```json
{
  "titulo": "Estudar para a prova",
  "data": "2026-05-20",
  "status": "PENDENTE",
  "paiId": null
}
```

**Campos**:
| Campo | Tipo | Obrigat. | Descrição |
|-------|------|----------|-----------|
| titulo | String | Sim | Mínimo 1 caractere |
| data | String (YYYY-MM-DD) | Não | Data de execução |
| status | String | Não | Padrão: PENDENTE |
| paiId | String | Não | ID de tarefa pai existente do mesmo usuário |

**Resposta 201**:
```json
{
  "dados": {
    "tarefa": {
      "id": "cuid...",
      "titulo": "Estudar para a prova",
      "data": "2026-05-20T00:00:00.000Z",
      "status": "PENDENTE",
      "paiId": null,
      "criadoEm": "2026-05-16T10:00:00.000Z"
    }
  }
}
```

**Erros**:
- 400: Título ausente ou vazio
- 404: paiId informado não encontrado ou não pertence ao usuário

---

### GET /api/tarefas/:id

Retorna os dados completos de uma tarefa, incluindo pai e filhas.

**Resposta 200**:
```json
{
  "dados": {
    "tarefa": {
      "id": "cuid...",
      "titulo": "Estudar para a prova",
      "data": "2026-05-20T00:00:00.000Z",
      "status": "PENDENTE",
      "pai": null,
      "filhas": [
        { "id": "cuid...", "titulo": "Rever capítulo 1", "status": "CONCLUIDA" }
      ],
      "progressoFilhas": {
        "total": 1,
        "concluidas": 1
      },
      "criadoEm": "2026-05-16T10:00:00.000Z",
      "atualizadoEm": "2026-05-16T10:00:00.000Z"
    }
  }
}
```

**Erros**:
- 404: Tarefa não encontrada ou não pertence ao usuário

---

### PUT /api/tarefas/:id

Atualiza dados de uma tarefa existente.

**Corpo da requisição** (todos os campos são opcionais; apenas os informados são atualizados):
```json
{
  "titulo": "Estudar para a prova final",
  "data": "2026-05-21",
  "status": "EM_EXECUCAO",
  "paiId": "cuid-do-pai"
}
```

**Resposta 200**: mesma estrutura do GET /api/tarefas/:id

**Erros**:
- 400: Título vazio (se informado)
- 404: Tarefa ou paiId não encontrado / não pertence ao usuário
- 409: Tentativa de criar referência circular na hierarquia

---

### DELETE /api/tarefas/:id

Remove uma tarefa. Se a tarefa possuir filhas, o parâmetro `confirmar=true` é obrigatório.

**Query params**:
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| confirmar | Boolean | Obrigatório quando a tarefa possui filhas |

**Resposta 204**: sem corpo

**Erros**:
- 400: Tarefa possui filhas e `confirmar=true` não foi informado
- 404: Tarefa não encontrada ou não pertence ao usuário

---

### PATCH /api/tarefas/:id/data

Atualiza apenas a data de uma tarefa (usado pelo drag-and-drop do calendário).

**Corpo da requisição**:
```json
{
  "data": "2026-05-25"
}
```

**Resposta 200**:
```json
{
  "dados": {
    "tarefa": {
      "id": "cuid...",
      "data": "2026-05-25T00:00:00.000Z",
      "atualizadoEm": "2026-05-16T11:00:00.000Z"
    }
  }
}
```

**Erros**:
- 400: Data em formato inválido
- 404: Tarefa não encontrada ou não pertence ao usuário

---

## Módulo: Hierarquia

### GET /api/tarefas/:id/arvore

Retorna uma tarefa e toda sua árvore de descendentes (recursivo).

**Resposta 200**:
```json
{
  "dados": {
    "arvore": {
      "id": "cuid...",
      "titulo": "Projeto Final",
      "status": "EM_PLANEJAMENTO",
      "filhas": [
        {
          "id": "cuid...",
          "titulo": "Módulo 1",
          "status": "EM_EXECUCAO",
          "filhas": [
            { "id": "cuid...", "titulo": "Tarefa 1.1", "status": "CONCLUIDA", "filhas": [] }
          ]
        }
      ]
    }
  }
}
```

**Erros**:
- 404: Tarefa não encontrada ou não pertence ao usuário

---

## Notas de Segurança

- Toda rota (exceto `/api/autenticacao/*`) DEVE validar o token JWT e rejeitar requisições sem token válido com status 401.
- Toda operação sobre tarefas DEVE verificar que `usuarioId` da tarefa corresponde ao usuário autenticado; caso contrário retornar 404 (não 403) para não vazar existência de recursos de outros usuários.
- Senhas nunca são retornadas em nenhuma resposta da API.
