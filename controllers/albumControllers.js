const Album = require("../models/Album");
const Artist = require("../models/Artist");

const addAlbumReview = async (req, res, next) => {
    try {
        const albumId = await Album.findById(req.body._id);

        for (let i = 0; i < req.body.albumArtists.length; i++) {
            const artistId = await Artist.findById(
                req.body.albumArtists[i]._id
            );
            if (!artistId) {
                const currentartist = req.body.albumArtists[i];
                let artist = {
                    _id: currentartist._id,
                    artistName: currentartist.artistName,
                    artistLink: currentartist.artistLink,
                };
                await Artist.create(artist);
            }
        }

        if (!albumId) {
            const result = await Album.create(req.body);
            resSuccess(res, 201, result);
        } else {
            const albumInfo = await Album.findById(req.body._id);
            albumInfo.albumReviews.push(req.body.albumReviews);
            const result = await albumInfo.save();
            resSuccess(res, 200, result);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};

const getAlbumReviews = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.albumId);
        resSuccess(res, 200, album.albumReviews);
    } catch (error) {
        fail = {
            album_id: "Not Found",
            error: error.message,
        };
        resFailed(res, 400, fail);
    }
};

const getAlbumReview = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.albumId);
        console.log(album.albumName);
        let review = album.albumReviews.find((albumReviews) =>
            albumReviews._id.equals(req.params.reviewId)
        );

        if (!review) {
            result = {
                success: false,
                msg: "ERROR GETTING RATINGS IN THE ITEM!",
            };
            resFailed(res, 400, result);
        } else {
            resSuccess(res, 200, review);
        }
    } catch (error) {
        resFailed(res, 400, error.message);
    }
};

const delAlbumReview = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.albumId);
        let review = album.albumReviews.find((albumReviews) =>
            albumReviews._id.equals(req.params.reviewId)
        );

        if (review) {
            const reviewIndexPosition = album.albumReviews.indexOf(review);
            album.albumReviews.splice(reviewIndexPosition, 1);
            review = {
                success: true,
                msg: `Review ${review._id} deleted`,
            };
            await album.save();
            resSuccess(res, 200, review);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};

const updAlbumReview = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.albumId);
        let review = album.albumReviews.find((albumReviews) =>
            albumReviews._id.equals(req.params.reviewId)
        );

        if (review) {
            const reviewIndexPosition = album.albumReviews.indexOf(review);
            album.albumReviews.splice(reviewIndexPosition, 1, req.body);
            albumReviews = album.albumReviews[reviewIndexPosition];
            const result = await album.save();
            resSuccess(res, 201, result);
        } else {
            resFailed(res, 400, error);
        }
    } catch (error) {
        resFailed(res, 400, error);
    }
};

const getTotalReviewsAlbum = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.albumId);
        console.log(album);
        const reviews = album.albumReviews;
        let sum = 0;
        for (let i = 0; i < reviews.length; i++) {
            sum += reviews[i].rating;
        }
        const rottenScore = sum / reviews.length;

        score = {
            album: album.albumName,
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
    addAlbumReview,
    delAlbumReview,
    updAlbumReview,
    getTotalReviewsAlbum,
    getAlbumReviews,
    getAlbumReview,
};
