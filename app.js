const express = require('express');
const { getCategories } = require('./controllers/categories.controllers');
const { getSingleReview, patchReview } = require('./controllers/reviews.controllers');
const { getUsers } = require('./controllers/users.controllers');
const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getSingleReview);
app.get('/api/users', getUsers);
app.patch('/api/reviews/:review_id', patchReview);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        if (err.code === "22P02") {
            res.status(400).send({ msg: "Invalid review ID" });
        }
        res.status(500).send({ msg: "Internal server error" });
    }
});

module.exports = app;