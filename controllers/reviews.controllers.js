const { selectReview, countComments, updateReviewVotes } = require('../models/reviews.models');

exports.getSingleReview = (req, res, next) => {
    const review_id = req.params;
    let num = 0;
    countComments(review_id)
    .then((comment_count) => {
        num = comment_count;
        return selectReview(review_id)
    })
    .then((review) => {
        review.comment_count = num;
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