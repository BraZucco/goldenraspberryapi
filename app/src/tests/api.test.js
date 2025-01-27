const request = require('supertest');
const { app, server } = require('../server'); // Certifique-se de que o caminho está correto

describe('Producers API', () => {
  // Antes de rodar os testes, adiciona um delay para garantir que tudo esteja inicializado
  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  // Após os testes, fecha o servidor
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
      response.body.forEach((producer) => {
        expect(producer).toHaveProperty('producer');
        expect(typeof producer.producer).toBe('string');
        expect(producer).toHaveProperty('movieCount');
        expect(typeof producer.movieCount).toBe('number');
      });
    }
  });

  // Testa a rota /producers/all
  it('should return all producers sorted by name', async () => {
    const response = await request(app).get('/producers/all');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      response.body.forEach((producer) => {
        expect(producer).toHaveProperty('name');
        expect(typeof producer.name).toBe('string');
      });
    }
  });

  // Testa a rota /producers/intervals
  it('should return the min and max intervals between producers\' winning years', async () => {
    const response = await request(app).get('/producers/intervals');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    // Testa a propriedade 'min'
    expect(Array.isArray(response.body.min)).toBe(true);
    response.body.min.forEach((item) => {
      expect(item).toHaveProperty('producer');
      expect(typeof item.producer).toBe('string');
      expect(item).toHaveProperty('interval');
      expect(typeof item.interval).toBe('number');
      expect(item).toHaveProperty('previousWin');
      expect(typeof item.previousWin).toBe('number');
      expect(item).toHaveProperty('followingWin');
      expect(typeof item.followingWin).toBe('number');
    });

    // Testa a propriedade 'max'
    expect(Array.isArray(response.body.max)).toBe(true);
    response.body.max.forEach((item) => {
      expect(item).toHaveProperty('producer');
      expect(typeof item.producer).toBe('string');
      expect(item).toHaveProperty('interval');
      expect(typeof item.interval).toBe('number');
      expect(item).toHaveProperty('previousWin');
      expect(typeof item.previousWin).toBe('number');
      expect(item).toHaveProperty('followingWin');
      expect(typeof item.followingWin).toBe('number');
    });
  });
});
