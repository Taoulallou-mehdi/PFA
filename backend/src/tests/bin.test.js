const request = require('supertest');
const app = require('../app');
const Bin = require('../models/Bin');

describe('Gestion des poubelles', () => {
  beforeEach(async () => {
    await Bin.deleteMany({});
  });

  test('PUT /api/bins/:id - Met à jour le niveau de remplissage', async () => {
    const bin = await Bin.create({ location: { lat: 48.8566, lng: 2.3522 }, fillLevel: 50 });
    const res = await request(app)
      .put(`/api/bins/${bin._id}`)
      .send({ fillLevel: 85 });
    expect(res.statusCode).toBe(200);
    expect(res.body.fillLevel).toBe(85);
  });
});