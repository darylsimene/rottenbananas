const express = require("express");
const router = express.Router();
const reqReceivedLogger = require("../middlewares/reqReceivedLogger");

const {
    addAlbumReview,
    delAlbumReview,
    updAlbumReview,
    getTotalReviewsAlbum,
    getAlbumReviews,
    getAlbumReview,
} = require("../controllers/albumControllers");

//! ============== ADD A REVIEW
router.route("/addreview").post(reqReceivedLogger, addAlbumReview);

//! ============== GET REVIEWS FROM ALBUM/ TRACKS
router.route("/:albumId/review").get(reqReceivedLogger, getAlbumReviews);

//! ============== GET THE ROTTEN BANANA SCORE
router
    .route("/:albumId/review/total")
    .get(reqReceivedLogger, getTotalReviewsAlbum);
//! ============== PUT/DELETE CERTAIN REVIEWS
router
    .route("/:albumId/review/:reviewId")
    .get(reqReceivedLogger, getAlbumReview)
    .delete(reqReceivedLogger, delAlbumReview)
    .put(reqReceivedLogger, updAlbumReview);

module.exports = router;
