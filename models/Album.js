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

const AlbumSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: [150, "track name can not be more than 15 characters"],
        },
        albumLink: {
            type: String,
            required: true,
        },
        artists: [ArtistsSchema],
        ratings: [RatingSchema],
    },
    { timestamps: true }
);
module.exports = mongoose.model("Album", AlbumSchema);
