import request from 'supertest';
import aplicacao from '../../src/index.js';

describe('POST /api/autenticacao/registrar', () => {
  it('deve criar uma conta e retornar token', async () => {
    const resposta = await request(aplicacao)
      .post('/api/autenticacao/registrar')
      .send({ nome: 'Teste', email: `teste${Date.now()}@ex.com`, senha: 'senha1234' });

    expect(resposta.status).toBe(201);
    expect(resposta.body.dados.token).toBeDefined();
    expect(resposta.body.dados.usuario.email).toBeDefined();
    expect(resposta.body.dados.usuario.senha).toBeUndefined();
  });

  it('deve rejeitar email duplicado com 409', async () => {
    const email = `dup${Date.now()}@ex.com`;
    await request(aplicacao)
      .post('/api/autenticacao/registrar')
      .send({ nome: 'A', email, senha: 'senha1234' });

    const resposta = await request(aplicacao)
      .post('/api/autenticacao/registrar')
      .send({ nome: 'B', email, senha: 'senha1234' });

    expect(resposta.status).toBe(409);
  });

  it('deve rejeitar senha menor que 8 caracteres com 400', async () => {
    const resposta = await request(aplicacao)
      .post('/api/autenticacao/registrar')
      .send({ nome: 'C', email: 'c@ex.com', senha: '123' });

    expect(resposta.status).toBe(400);
  });
});

describe('POST /api/autenticacao/entrar', () => {
  it('deve autenticar com credenciais válidas', async () => {
    const email = `entrar${Date.now()}@ex.com`;
    await request(aplicacao)
      .post('/api/autenticacao/registrar')
      .send({ nome: 'D', email, senha: 'senha1234' });

    const resposta = await request(aplicacao)
      .post('/api/autenticacao/entrar')
      .send({ email, senha: 'senha1234' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.token).toBeDefined();
  });

  it('deve rejeitar credenciais incorretas com 401', async () => {
    const resposta = await request(aplicacao)
      .post('/api/autenticacao/entrar')
      .send({ email: 'naoexiste@ex.com', senha: 'errada' });

    expect(resposta.status).toBe(401);
  });
});
