const { selectReview, countComments, countReviews, updateReviewVotes } = require('../models/reviews.models');

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

exports.getReviews = (req, res, next) => {
    countReviews()
    .then((num) => {
        const promiseArray = [];
        for (let i = 1; i <= num; i++) {
            promiseArray.push(selectReview({review_id: i}));
        }
        return promiseArray;
    })
    .then((promiseArray) => {
        Promise.all(promiseArray).then((output) => {
            const sortedOutput = output.sort((a, b) => {
                return b.created_at - a.created_at;
            })
            res.status(200).send({ reviews: sortedOutput });
        });
    });
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