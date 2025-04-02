// src/tests/integration/trajets.test.js
const request = require('supertest');
const app = require('../../../app');
const Trajet = require('../../models/TrajetModel');

describe('API Trajets', () => {
  beforeEach(async () => {
    await Trajet.deleteMany({});
  });

  test('POST /api/trajets - Créer un nouveau trajet', async () => {
    const res = await request(app)
      .post('/api/trajets')
      .send({
        points: [{ lat: 48.8566, lng: 2.3522 }],
        date: new Date()
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });
});