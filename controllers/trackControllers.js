const Track = require("../models/Track");
const Album = require("../models/Album");
const Artist = require("../models/Artist");

const addReview = async (req, res, next) => {
    try {
        // this adds a review but also adds the track if the track is not present in the db
        const trackId = await Track.findById(req.body._id);
        const albumId = await Album.findById(req.body.trackAlbum._id);
        const artistId = await Artist.findById(req.body.trackArtists._id);

        if (!trackId) {
            let track = {};

            track._id = req.body._id;
            track.trackName = req.body.trackName;
            track.trackLink = req.body.trackLink;
            track.trackAlbum = req.body.trackAlbum._id;
            track.trackArtists = req.body.trackArtists;
            const result = await Track.create(track);
        }

        // else {
        //     if(!albumId) {
        //         let album = {}

        //     }

        // }
    } catch (error) {
        res.status(400).setHeader("Content-Type", "application/json").json({
            success: false,
            msg: error,
        });
    }

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
        track.trackArtists = req.body.trackArtists;
        const result = await Track.create(track);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err}`,
            });
        // throw new Error(`ERROR POSTING USER: ${err.message}`);
    }
};

module.exports = {
    addReview,
    addTrack,
};
