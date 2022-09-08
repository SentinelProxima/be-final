const express = require('express');
const { getCategories } = require('./controllers/categories.controllers');
const { getSingleReview } = require('./controllers/reviews.controllers');
const { getUsers } = require('./controllers/users.controllers');
const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getSingleReview);
app.get('/api/users', getUsers);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        res.status(500).send({ msg: "Internal server error" });
    }
});

module.exports = app;