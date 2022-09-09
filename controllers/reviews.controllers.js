const { selectReview, updateReviewVotes } = require('../models/reviews.models');

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
        return updateReviewVotes(review, req.body.inc_votes);
    })
    .then((newReview) => {
        res.status(200).send({ review: newReview.rows[0] });
    })
    .catch(next);
};