const Track = require("../models/Track");
const Album = require("../models/Album");
const Artist = require("../models/Artist");

const search = async (req, res, next) => {
    // this adds a review but also adds the track if the track is not present in the db
    const trackId = await Track.findById(req.body._id);
    if (!trackId) console.log();
    // const albumId = await Album.findById(req.body._id);
    // if (albumId) albumPresent = true;

    // const artists = req.body.artists;
    // const length = Object.entries(artists).length;

    // for(let i=0; i < length; i++) {
    //     const currentArtist = artists[i]._id;
    //     const artist = await Artist.findById(currentArtist);

    //     if(!artist) console.log("hello");
    // }
};

const addTrack = async (req, res, next) => {
    try {
        let track = {};

        track._id = req.body._id;
        track.trackName = req.body.trackName;
        track.trackLink = req.body.trackLink;
        track.trackAlbum = req.body.trackAlbum._id;
        track.trackArtists = req.trackArtists;
        // const result = await Track.create(track);
        console.log(track);

        // sendTokenResponse(result, 201, res);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err.message}`,
            });
        // throw new Error(`ERROR POSTING USER: ${err.message}`);
    }
};

module.exports = {
    search,
    addTrack,
};
