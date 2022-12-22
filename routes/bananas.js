const express = require("express");
const router = express.Router();

//connect to spotify

const {
    getUserInfo,
    loginSpotify,
    enterUser,
    getTrack,
    getAlbum,
} = require("../controllers/spotifyControllers");

router.route("/").get(enterUser);
router.route("/login").get(loginSpotify);
router.route("/userInfo").get(getUserInfo);
router.route("/track").get(getTrack);
router.route("/album").get(getAlbum);

module.exports = router;
