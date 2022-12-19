const express = require("express");
const router = express.Router();

//connect to spotify

const {
    getUserInfo,
    loginSpotify,
    enterUser,
    getTrack,
} = require("../controllers/spotifyControllers");

router.route("/").get(enterUser);
router.route("/login").get(loginSpotify);
router.route("/userInfo").get(getUserInfo);

module.exports = router;
