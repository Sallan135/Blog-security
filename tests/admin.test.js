jest.mock('../database', () => ({
    get: jest.fn((query, params, callback) => {
        callback(null, {
            username: 'testuser'
        });
    }),
    run: jest.fn(),
    all: jest.fn((query, callback) => {
        callback(null, []);
    })
}));

const request = require('supertest');
const app = require('../app');

describe('Admin routes', () => {
    test('GET /admin should return 403 when user is not logged in', async () => {
        const response = await request(app).get('/admin');

        expect(response.statusCode).toBe(403);
        expect(response.text).toBe('Access denied');
    });
});

test('GET /admin should return 403 for a non-admin user', async () => {
    const response = await request(app)
        .get('/admin')
        .set('Cookie', ['sessionId=test-session']);

    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('Access denied');
});

test('GET /new-post should redirect to login when user is not logged in', async () => {
    const response = await request(app).get('/new-post');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
});

test('GET / should redirect to login when user is not logged in', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
});

test('POST /new-post should redirect to login when user is not logged in', async () => {
    const response = await request(app)
        .post('/new-post')
        .send({
            title: 'Test post',
            content: 'Test content'
        });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
});