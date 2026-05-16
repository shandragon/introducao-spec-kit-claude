import request from 'supertest';
import aplicacao from '../../src/index.js';

async function criarUsuarioELogin() {
  const email = `perfil${Date.now()}@ex.com`;
  const resposta = await request(aplicacao)
    .post('/api/autenticacao/registrar')
    .send({ nome: 'Usuário Teste', email, senha: 'senha1234' });
  return resposta.body.dados;
}

describe('GET /api/perfil', () => {
  it('deve retornar dados do usuário autenticado sem senha', async () => {
    const { token, usuario } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .get('/api/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.nome).toBe(usuario.nome);
    expect(resposta.body.dados.email).toBe(usuario.email);
    expect(resposta.body.dados.senha).toBeUndefined();
  });

  it('deve rejeitar sem token com 401', async () => {
    const resposta = await request(aplicacao).get('/api/perfil');
    expect(resposta.status).toBe(401);
  });
});

describe('PUT /api/perfil', () => {
  it('deve atualizar nome e email com sucesso', async () => {
    const { token } = await criarUsuarioELogin();
    const novoNome = 'Nome Atualizado';
    const novoEmail = `atualizado${Date.now()}@ex.com`;

    const resposta = await request(aplicacao)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: novoNome, email: novoEmail });

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.nome).toBe(novoNome);
    expect(resposta.body.dados.email).toBe(novoEmail);
    expect(resposta.body.dados.senha).toBeUndefined();
  });

  it('deve rejeitar nome vazio com 400', async () => {
    const { token } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: '', email: 'valido@ex.com' });

    expect(resposta.status).toBe(400);
  });

  it('deve rejeitar email inválido com 400', async () => {
    const { token } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Nome', email: 'naoEhEmail' });

    expect(resposta.status).toBe(400);
  });

  it('deve rejeitar email já cadastrado por outro usuário com 409', async () => {
    const dados1 = await criarUsuarioELogin();
    const dados2 = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${dados2.token}`)
      .send({ nome: 'Nome', email: dados1.usuario.email });

    expect(resposta.status).toBe(409);
  });

  it('deve rejeitar sem token com 401', async () => {
    const resposta = await request(aplicacao)
      .put('/api/perfil')
      .send({ nome: 'Teste', email: 'teste@ex.com' });

    expect(resposta.status).toBe(401);
  });
});

describe('PUT /api/perfil/senha', () => {
  it('deve trocar a senha com dados válidos', async () => {
    const { token } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil/senha')
      .set('Authorization', `Bearer ${token}`)
      .send({ senhaAtual: 'senha1234', novaSenha: 'novasenha456', confirmacaoNovaSenha: 'novasenha456' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.mensagem).toBeDefined();
  });

  it('deve rejeitar senha atual incorreta com 401', async () => {
    const { token } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil/senha')
      .set('Authorization', `Bearer ${token}`)
      .send({ senhaAtual: 'errada', novaSenha: 'novasenha456', confirmacaoNovaSenha: 'novasenha456' });

    expect(resposta.status).toBe(401);
  });

  it('deve rejeitar quando senhas não coincidem com 400', async () => {
    const { token } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil/senha')
      .set('Authorization', `Bearer ${token}`)
      .send({ senhaAtual: 'senha1234', novaSenha: 'nova1', confirmacaoNovaSenha: 'nova2' });

    expect(resposta.status).toBe(400);
  });

  it('deve rejeitar nova senha com menos de 8 caracteres com 400', async () => {
    const { token } = await criarUsuarioELogin();

    const resposta = await request(aplicacao)
      .put('/api/perfil/senha')
      .set('Authorization', `Bearer ${token}`)
      .send({ senhaAtual: 'senha1234', novaSenha: 'curta', confirmacaoNovaSenha: 'curta' });

    expect(resposta.status).toBe(400);
  });

  it('deve rejeitar sem token com 401', async () => {
    const resposta = await request(aplicacao)
      .put('/api/perfil/senha')
      .send({ senhaAtual: 'a', novaSenha: 'novasenha456', confirmacaoNovaSenha: 'novasenha456' });

    expect(resposta.status).toBe(401);
  });
});
