import request from 'supertest';
import aplicacao from '../../src/index.js';

async function obterToken() {
  const email = `tarefa${Date.now()}@ex.com`;
  const resposta = await request(aplicacao)
    .post('/api/autenticacao/registrar')
    .send({ nome: 'Usuário Teste', email, senha: 'senha1234' });
  return resposta.body.dados.token;
}

describe('POST /api/tarefas', () => {
  it('deve criar uma tarefa para o usuário autenticado', async () => {
    const token = await obterToken();
    const resposta = await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Minha tarefa' });

    expect(resposta.status).toBe(201);
    expect(resposta.body.dados.tarefa.titulo).toBe('Minha tarefa');
    expect(resposta.body.dados.tarefa.status).toBe('PENDENTE');
  });

  it('deve rejeitar título vazio com 400', async () => {
    const token = await obterToken();
    const resposta = await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: '' });

    expect(resposta.status).toBe(400);
  });

  it('deve rejeitar requisição sem token com 401', async () => {
    const resposta = await request(aplicacao)
      .post('/api/tarefas')
      .send({ titulo: 'Sem token' });

    expect(resposta.status).toBe(401);
  });
});

describe('GET /api/tarefas', () => {
  it('deve listar tarefas do usuário autenticado', async () => {
    const token = await obterToken();
    await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Tarefa listada' });

    const resposta = await request(aplicacao)
      .get('/api/tarefas')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body.dados.tarefas)).toBe(true);
    expect(resposta.body.dados.tarefas.length).toBeGreaterThan(0);
  });
});

describe('GET /api/tarefas/:id', () => {
  it('deve retornar tarefa por id', async () => {
    const token = await obterToken();
    const criada = await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Buscar por id' });

    const id = criada.body.dados.tarefa.id;
    const resposta = await request(aplicacao)
      .get(`/api/tarefas/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.tarefa.id).toBe(id);
  });

  it('deve retornar 404 para id inexistente', async () => {
    const token = await obterToken();
    const resposta = await request(aplicacao)
      .get('/api/tarefas/id-inexistente')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(404);
  });
});

describe('PUT /api/tarefas/:id', () => {
  it('deve atualizar titulo e status da tarefa', async () => {
    const token = await obterToken();
    const criada = await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Original' });

    const id = criada.body.dados.tarefa.id;
    const resposta = await request(aplicacao)
      .put(`/api/tarefas/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Atualizada', status: 'EM_EXECUCAO' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.tarefa.titulo).toBe('Atualizada');
    expect(resposta.body.dados.tarefa.status).toBe('EM_EXECUCAO');
  });
});

describe('DELETE /api/tarefas/:id', () => {
  it('deve excluir tarefa sem filhas', async () => {
    const token = await obterToken();
    const criada = await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Para excluir' });

    const id = criada.body.dados.tarefa.id;
    const resposta = await request(aplicacao)
      .delete(`/api/tarefas/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(204);
  });
});

describe('PATCH /api/tarefas/:id/data', () => {
  it('deve atualizar a data de uma tarefa', async () => {
    const token = await obterToken();
    const criada = await request(aplicacao)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Tarefa com data' });

    const id = criada.body.dados.tarefa.id;
    const resposta = await request(aplicacao)
      .patch(`/api/tarefas/${id}/data`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: '2026-06-01' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.dados.tarefa.data).toContain('2026-06-01');
  });
});
