let registeredPassword;

jest.mock('../database', () => ({
    get: jest.fn((query, params, callback) => {
        callback(null, null);
    }),
    run: jest.fn((query, params, callback) => {
         registeredPassword = params[1];
         callback(null);
    })
}));

const request = require('supertest');
const app = require('../app');
const db = require('../database');

describe('Authentication routes', () => {
    test('GET /auth/login should return status 200', async () => {
        const response = await request(app).get('/auth/login');

        expect(response.statusCode).toBe(200);
    });
});

test('GET /auth/register should return status 200', async () => {
    const response = await request(app).get('/auth/register');

    expect(response.statusCode).toBe(200);
});

test('GET /auth/logout should redirect to login', async () => {
    const response = await request(app).get('/auth/logout');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
});

test('GET /auth/login should contain login page', async () => {
    const response = await request(app).get('/auth/login');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Login');
});

test('POST /auth/register should not store password in plain text', async () => {
    await request(app)
    .post('/auth/register')
    .type('form')
    .send({
        username: 'testuser',
        password: 'secret123'
    });

    expect(registeredPassword).toEqual(expect.any(String));
    expect(registeredPassword).not.toBe('secret123');
});