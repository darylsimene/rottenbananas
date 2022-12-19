const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 100,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const ArtistSchema = new Schema(
    {
        _id: {
            type: Schema.Types.String,
            ref: "Artist._id",
        },
        artistName: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const TrackSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
            unique: true,
        },
        trackName: {
            type: String,
            required: true,
        },
        trackLink: {
            type: String,
            required: true,
        },
        trackAlbum: {
            type: Schema.Types.String,
            ref: "Album._id",
        },
        trackArtists: [ArtistSchema],
        trackRatings: [RatingSchema],
    },
    { timestamps: true },
    { _id: false }
);
module.exports = mongoose.model("Track", TrackSchema);
