const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const LikedTrackArtistSchema = new Schema({
    likedTrackArtist: {
        type: String,
        required: true,
    },
});

const LikedTracksSchema = new Schema({
    trackLink: {
        type: String,
        required: true,
    },
    trackName: {
        type: String,
        required: true,
    },
    trackArtist: [LikedTrackArtistSchema],
});
const LikedAlbumsSchema = new Schema({
    albumLink: {
        type: String,
        required: true,
    },
    albumName: {
        type: String,
        required: true,
    },
    albumArtist: {
        type: String,
        required: true,
    },
});

const UserSchema = new Schema(
    {
        userName: {
            type: String,
            unique: [true, "username has already been taken"],
            require: [true, "please add a username"],
            maxLength: [15, `username <= 15`],
        },
        email: {
            type: String,
            unique: [true, "email has already been taken"],
            require: [true, "please add an email"],
            validate: (email) => {
                return validator.isEmail(email);
            },
        },
        password: {
            type: String,
            required: [true, "please add a password"],
            validate: (password) => {
                return validator.isStrongPassword(password);
            },
        },
        age: {
            type: Number,
            required: true,
        },
        admin: {
            type: Boolean,
            default: false,
        },
        firstName: {
            type: String,
            required: [true, "please add your first name"],
            maxLength: [35, `first name <= 35`],
        },
        lastName: {
            type: String,
            required: [true, `please add last name`],
            maxLength: [35, `last name <= 35`],
        },
        gender: {
            type: String,
            required: [true, `please enter gender`],
            enum: [`Male`, `Female`, `Non-Binary`],
        },
        likedTracks: [LikedTracksSchema],
        likedAlbums: [LikedAlbumsSchema],
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified(`password`)) next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//generate our jwt token when user logs in or creates a new account
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// method to matchthe password for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash(`sha256`)
        .update(resetToken)
        .digest(`hex`);
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
