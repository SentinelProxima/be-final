const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
    it('returns an array', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});