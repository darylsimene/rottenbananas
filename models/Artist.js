const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema(
    {
        _id: {
            type: Object,
            required: true,
            unique: true,
        },
        artistName: {
            type: String,
            required: true,
        },
    },
    { _id: false },
    { timestamps: true }
);

module.exports = mongoose.model("Artist", ArtistSchema);
