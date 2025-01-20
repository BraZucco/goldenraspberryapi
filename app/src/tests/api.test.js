const request = require('supertest');
const { app, server } = require('../server'); // Certifique-se de que o caminho está correto

describe('Producers API', () => {
  // Espera que a inicialização do banco de dados seja concluída
  beforeAll(async () => {
    // Adiciona um pequeno delay para garantir que o banco de dados e a leitura do CSV estejam prontos
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      server.close(() => {
        console.log("Server closed");
        resolve();
      });
    });
  });

  // Testa a rota /producers/repeated
  it('should return producers with more than one movie', async () => {
    const response = await request(app).get('/producers/repeated');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('producer');
      expect(response.body[0]).toHaveProperty('movieCount');
    }
  });

  // Testa a rota /producers/all
  it('should return all producers sorted by name', async () => {
    const response = await request(app).get('/producers/all');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('name');
    }
  });

  // Testa a rota /producers/intervals
  it('should return the min and max intervals between producers\' winning years', async () => {
    const response = await request(app).get('/producers/intervals');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
    expect(Array.isArray(response.body.min)).toBe(true);
    expect(Array.isArray(response.body.max)).toBe(true);
  });
});
