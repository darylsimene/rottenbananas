const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const AlbumSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
            unique: true,
        },
        albumName: {
            type: String,
            required: true,
        },
        albumLink: {
            type: String,
            required: true,
        },
        artists: [ArtistSchema],
        ratings: [RatingSchema],
    },
    { timestamps: true },
    { _id: false }
);
module.exports = mongoose.model("Album", AlbumSchema);
