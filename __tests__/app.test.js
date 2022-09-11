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
            expect(rev.review_id).toBe(1);
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
    it('returns review object with a comment_count property', () => {
        return request(app).get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            expect(res.body.review.comment_count).toBe(0);
        });
    });
    it('comment_count counts the comments matching the review_id', () => {
        return request(app).get('/api/reviews/2')
        .expect(200)
        .then((res) => {
            expect(res.body.review.comment_count).toBe(3);
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
            res.body.users.forEach(user => {
                expect(user).toEqual(expect.objectContaining({
                    name: expect.any(String),
                    username: expect.any(String),
                    avatar_url: expect.any(String)
                }));
            });
        });
    });
});

describe('PATCH /api/reviews/:review_id', () => {
    it('returns a review object', () => {
        return request(app).patch('/api/reviews/1').send({inc_votes: 1})
        .expect(200)
        .then((res) => {
            expect(typeof res.body.review).toBe("object");
        });
    });
    it('returns a review with votes incremented by inc_votes', () => {
        return request(app).patch('/api/reviews/1').send({inc_votes: 1})
        .expect(200)
        .then((res) => {
            expect(res.body.review.votes).toBe(2);
        });
    });
    it('decrements votes if inc_votes is negative', () => {
        return request(app).patch('/api/reviews/2').send({inc_votes: -2})
        .expect(200)
        .then((res) => {
            expect(res.body.review.votes).toBe(3);
        });
    });
    it('returns 404 if invalid (numeric) ID passed', () => {
        return request(app).patch('/api/reviews/0').send({inc_votes: 1})
        .expect(404)
        .then((res) => {
            const msg = JSON.parse(res.text);
            expect(msg.msg).toBe("No such review");
        });
    });
    it('returns 400 if non-numeric ID passed', () => {
        return request(app).patch('/api/reviews/kitten').send({inc_votes: 1})
        .expect(400)
        .then((res) => {
            const msg = JSON.parse(res.text);
            expect(msg.msg).toBe("Invalid review ID");
        });
    });
    it('returns 400 if body has no inc_votes property', () => {
        return request(app).patch('/api/reviews/1').send({})
        .expect(400)
        .then((res) => {
            const msg = JSON.parse(res.text);
            expect(msg.msg).toBe("Invalid request");
        });
    });
    it('returns 400 if inc_votes is not an integer', () => {
        return request(app).patch('/api/reviews/1').send({inc_votes: "a"})
        .expect(400)
        .then((res) => {
            const msg = JSON.parse(res.text);
            expect(msg.msg).toBe("Invalid request");
        });
    });
});