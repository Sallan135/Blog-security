jest.mock('../database', () => ({
    get: jest.fn(),
    run: jest.fn()
}));

const request = require('supertest');
const app = require('../app');

describe('Users routes', () => {
    test('GET /users should return status 404', async () => {
        const response = await request(app).get('/users');

        expect(response.statusCode).toBe(404);
    });
});