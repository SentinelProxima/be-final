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
    it('returns an array of categories with slug and description properties', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then((res) => {
            expect(res.body[0].hasOwnProperty("slug")).toBe(true);
            expect(res.body[0].hasOwnProperty("description")).toBe(true);
        });
    });
});