const Track = require("../models/Track");
const Album = require("../models/Album");
const Artist = require("../models/Artist");

const addTrackReview = async (req, res, next) => {
    try {
        // this adds a review but also adds the track if the track is not present in the db
        const trackId = await Track.findById(req.body._id);
        const albumId = await Album.findById(req.body.trackAlbum._id);

        for (let i = 0; i < req.body.trackArtists.length; i++) {
            const artistId = await Artist.findById(
                req.body.trackArtists[i]._id
            );
            if (!artistId) {
                const currentartist = req.body.trackArtists[i];
                let artist = {
                    _id: currentartist._id,
                    artistName: currentartist.artistName,
                    artistLink: currentartist.artistLink,
                };
                await Artist.create(artist);
            }
        }

        if (!albumId) {
            const album = {
                _id: req.body.trackAlbum._id,
                albumName: req.body.trackAlbum.albumName,
                albumLink: req.body.trackAlbum.albumLink,
                releaseDate: req.body.trackAlbum.releaseDate,
                albumType: req.body.trackAlbum.albumType,
                albumArtists: req.body.trackArtists,
            };
            await Album.create(album);
        }

        if (!trackId) {
            const result = await Track.create(req.body);
            resSuccess(res, 201, result);
        } else {
            const trackInfo = await Track.findById(req.body._id);
            trackInfo.trackReviews.push(req.body.trackReviews);
            const result = await trackInfo.save();
            resSuccess(res, 201, result);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};
const getTrackReviews = async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.trackId);
        resSuccess(res, 200, track.trackReviews);
    } catch (error) {
        fail = {
            track_id: "Not Found",
            error: error.message,
        };
        resFailed(res, 400, fail);
    }
};

const getTrackReview = async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.trackId);
        let review = track.trackReviews.find((trackReviews) =>
            trackReviews._id.equals(req.params.reviewId)
        );

        if (!review) {
            result = {
                success: false,
                msg: `error retrieving reviews in ${track.trackName}`,
            };
            resFailed(res, 400, result);
        } else {
            resSuccess(res, 200, review);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};

const delTrackReview = async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.trackId);
        let review = track.trackReviews.find((trackReviews) =>
            trackReviews._id.equals(req.params.reviewId)
        );

        if (review) {
            const reviewIndexPosition = track.trackReviews.indexOf(review);
            track.trackReviews.splice(reviewIndexPosition, 1);
            review = {
                success: true,
                msg: "Review with ID deleted",
            };
            await track.save();
            resSuccess(res, 200, review);
        } else {
            resFailed(res, 400, error);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};

const updTrackReview = async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.trackId);
        let review = track.trackReviews.find((trackReviews) =>
            trackReviews._id.equals(req.params.reviewId)
        );

        if (review) {
            const reviewIndexPosition = track.trackReviews.indexOf(review);
            track.trackReviews.splice(reviewIndexPosition, 1, req.body);
            trackReviews = track.trackReviews[reviewIndexPosition];
            const result = await track.save();
            resSuccess(res, 201, result);
        } else {
            resFailed(res, 400, error);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};
const getTotalReviewsTrack = async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.trackId);
        if (!track) console.log(`i'm here`);
        const reviews = track.trackReviews;
        let sum = 0;
        for (let i = 0; i < reviews.length; i++) {
            sum += reviews[i].rating;
        }
        const rottenScore = sum / reviews.length;

        score = {
            track: track.trackName,
            rottenBanana_score: rottenScore,
        };
        resSuccess(res, 200, score);
    } catch (error) {
        resFailed(res, 400, error);
    }
};

const resSuccess = (res, statusCode, result) => {
    res.status(statusCode)
        .setHeader("Content-Type", "application/json")
        .json(result);
};
const resFailed = (res, statusCode, error) => {
    res.status(statusCode)
        .setHeader("Content-Type", "application/json")
        .json({ msg: error.message });
};
module.exports = {
    addTrackReview,
    delTrackReview,
    updTrackReview,
    getTrackReviews,
    getTrackReview,
    getTotalReviewsTrack,
};
