# Modelo de Dados: Perfil do Usuário

## Entidades afetadas

### Usuario (existente — sem migração)

Nenhum campo novo é adicionado. A feature expõe operações de leitura e atualização sobre campos já existentes.

| Campo  | Tipo   | Restrições                        | Operação nesta feature |
|--------|--------|-----------------------------------|------------------------|
| id     | String | PK, CUID                          | Somente leitura        |
| nome   | String | obrigatório, não vazio            | Atualizável via PUT /perfil |
| email  | String | obrigatório, único, formato email | Atualizável via PUT /perfil |
| senha  | String | hash bcrypt, mín. 8 chars         | Atualizável via PUT /perfil/senha |

## Regras de negócio

- `nome`: não pode ser vazio ou conter apenas espaços.
- `email`: deve ser um endereço válido e único no sistema. Se o novo e-mail já pertencer a outro usuário, a operação é rejeitada com código `EMAIL_DUPLICADO`.
- `senha` (troca): a senha atual informada deve corresponder ao hash armazenado (validado com bcrypt). A nova senha deve ter no mínimo 8 caracteres. Nova senha e confirmação devem ser idênticas.

## Sem migração de banco de dados

A tabela `usuarios` já contém todos os campos necessários. Nenhum arquivo de migração Prisma é gerado por esta feature.
