const db = require('../db/connection');

exports.selectReview = (id_param) => {
    const { review_id } = id_param;
    return db.query(`SELECT * FROM reviews
    WHERE review_id = $1`, [review_id])
    .then(({rows}) => {
        if (rows[0]) return rows[0];
        else return Promise.reject({status: 404, msg: "No such review"});
    });
};

exports.countComments = (id_param) => {
    const { review_id } = id_param;
    return db.query(`SELECT * FROM comments
    WHERE review_id = $1`, [review_id])
    .then(({rows}) => {
        return rows.length;
    });
};

exports.countReviews = () => {
    return db.query(`SELECT * FROM reviews`)
    .then(({rows}) => {
        return rows.length;
    });
};

exports.updateReviewVotes = (review, inc) => {
    if (isNaN(parseInt(inc))) {
        return Promise.reject({status: 400, msg: "Invalid request"});
    }
    return db.query(`UPDATE reviews
    SET votes = $1
    WHERE review_id = $2
    RETURNING *`, [review.votes + inc, review.review_id]);
};