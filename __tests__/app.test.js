const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
    it('returns a categories array', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.categories)).toBe(true);
            expect(res.body.categories.length).toBe(4);
        });
    });
    it('returns an array of categories with slug and description properties', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then((res) => {
            expect(res.body.categories[0].hasOwnProperty("slug")).toBe(true);
            expect(res.body.categories[0].hasOwnProperty("description")).toBe(true);
        });
    });
});

describe('GET /api/reviews/:review_id', () => {
    it('returns a review object', () => {
        return request(app).get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            expect(typeof res.body.review).toBe("object");
        });
    });
    it('returns a review object with all review properties', () => {
        return request(app).get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            const rev = res.body.review;
            expect(rev.title).toBe("Agricola");
            expect(rev.category).toBe("euro game");
            expect(rev.designer).toBe("Uwe Rosenberg");
            expect(rev.owner).toBe("mallionaire");
            expect(rev.review_body).toBe("Farmyard fun!");
            expect(rev.review_img_url).toBe("https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png");
            expect(rev.created_at).toBe("2021-01-18T10:00:20.514Z");
            expect(rev.votes).toBe(1);
        });
    });
    it('returns 404 if invalid (numeric) ID passed', () => {
        return request(app).get('/api/reviews/0')
        .expect(404)
        .then((res) => {
            const msg = JSON.parse(res.text);
            expect(msg.msg).toBe("No such review");
        });
    });
    it('returns 400 if non-numeric ID passed', () => {
        return request(app).get('/api/reviews/kitten')
        .expect(400)
        .then((res) => {
            const msg = JSON.parse(res.text);
            expect(msg.msg).toBe("Invalid review ID");
        });
    });
});

describe('GET /api/users', () => {
    it('returns a users array', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.users)).toBe(true);
            expect(res.body.users.length).toBe(4);
        });
    });
    it('returns an array of users with username, name and avatar_url properties', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then((res) => {
            expect(res.body.users[0].username).toBe("mallionaire");
            expect(res.body.users[1].name).toBe("philippa");
            expect(res.body.users[2].hasOwnProperty("avatar_url")).toBe(true);
        });
    });
});