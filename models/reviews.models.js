const db = require('../db/connection');

exports.selectReview = (id_param) => {
    const review_id = parseInt(id_param.review_id.slice(1));
    return db.query(`SELECT * FROM reviews
    WHERE review_id = $1`, [review_id])
    .then(({rows}) => {
        if (rows[0]) return rows[0];
        else return Promise.reject({status: 404, msg: "Invalid review ID"});
    });
};