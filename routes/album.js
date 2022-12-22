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
const protectedRoute = require("../middlewares/auth");

//! ============== ADD A REVIEW
router
    .route("/addreview")
    .post(reqReceivedLogger, protectedRoute, addAlbumReview);

//! ============== GET REVIEWS FROM ALBUM/ TRACKS
router.route("/:albumId/review").get(reqReceivedLogger, getAlbumReviews);

//! ============== GET THE ROTTEN BANANA SCORE
router
    .route("/:albumId/review/total")
    .get(reqReceivedLogger, getTotalReviewsAlbum);
//! ============== PUT/DELETE CERTAIN REVIEWS
router
    .route("/:albumId/review/:reviewId")
    .get(reqReceivedLogger, protectedRoute, getAlbumReview)
    .delete(reqReceivedLogger, protectedRoute, delAlbumReview)
    .put(reqReceivedLogger, protectedRoute, updAlbumReview);

module.exports = router;
