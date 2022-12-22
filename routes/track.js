const express = require("express");
const router = express.Router();
const reqReceivedLogger = require("../middlewares/reqReceivedLogger");
const {
    addTrackReview,
    delTrackReview,
    updTrackReview,
    getTrackReviews,
    getTrackReview,
    getTotalReviewsTrack,
} = require("../controllers/trackControllers");

//! ============== ADD A REVIEW
router.route("/addreview").post(reqReceivedLogger, addTrackReview);

//! ============== GET REVIEWS FROM TRACKS
router.route("/:trackId/review").get(reqReceivedLogger, getTrackReviews);

//! ============== GET THE ROTTEN BANANA SCORE
router
    .route("/:trackId/review/total")
    .get(reqReceivedLogger, getTotalReviewsTrack);

//! ============== PUT/DELETE CERTAIN REVIEWS
router
    .route("/:trackId/review/:reviewId")
    .get(reqReceivedLogger, getTrackReview)
    .delete(reqReceivedLogger, delTrackReview)
    .put(reqReceivedLogger, updTrackReview);

module.exports = router;
