const db = require('../db/connection');

exports.selectReview = (id_param) => {
    const { review_id } = id_param;
    if (isNaN(parseInt(review_id))) {
        return Promise.reject({status: 400, msg: "Invalid review ID"});
    }
    return db.query(`SELECT * FROM reviews
    WHERE review_id = $1`, [review_id])
    .then(({rows}) => {
        if (rows[0]) return rows[0];
        else return Promise.reject({status: 404, msg: "No such review"});
    });
};