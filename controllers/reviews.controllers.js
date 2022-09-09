const { selectReview } = require('../models/reviews.models');

exports.getSingleReview = (req, res, next) => {
    const review_id = req.params;
    selectReview(review_id)
    .then((review) => {
        res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
    const review_id = req.params;
    selectReview(review_id)
    .then((review) => {
        console.log(req.body);
        review.votes += req.body.inc_votes;
        res.status(200).send({ review });
    })
    .catch(next);
};