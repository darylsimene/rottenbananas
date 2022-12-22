const User = require("../models/User");
const crypto = require("crypto");

const getUsers = async (req, res, next) => {
    const filter = {}; //filters to return only selected fields
    const options = {}; //sorting/pagination

    if (Object.keys(req.query).length) {
        //query parameter

        const {
            userName,
            email,
            password,
            admin,
            firstName,
            lastName,
            gender,
            limit,
            sortByFirstName,
        } = req.query;

        if (userName) filter.userName = true;
        if (email) filter.email = true;
        if (password) filter.password = true;
        if (admin) filter.admin = true;
        if (firstName) filter.firstName = true;
        if (lastName) filter.lastName = true;
        if (gender) filter.gender = true;
        if (limit) options.limit = limit;
        if (sortByFirstName)
            options.sort = {
                firstName: sortByFirstName === "asc" ? 1 : -1,
            };
    }

    try {
        const users = await User.find({}, filter, options);

        res.status(200)
            .setHeader("Content-Type", "application/json")
            .json(users);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err.message}`,
            });
        // throw new Error(`ERROR RETRIEVING USERS: ${err.message}`);
    }
};

const postUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err.message}`,
            });
        // new Error(`ERROR POSTING USER: ${err.message}`);
    }
};

// const deleteUsers = async (req, res, next) => {
//     try {
//         await User.deleteMany();

//         res.status(200)
//             .setHeader("Content-Type", "applicaton/json")
//             .json({ success: true, msg: "succesfully deleted all users!" });
//     } catch (err) {
//         throw new Error(`ERROR DELETING USERS: ${err.message}`);
//     }
// };

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        res.status(200)
            .setHeader("Content-Type", "application/json")
            .json(user);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err.message}`,
            });
        // throw new Error(
        //     `ERROR GETTING USER ${req.params.userId}: ${err.message}`
        // );
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: req.body },
            { new: true }
        );

        res.status(200)
            .setHeader("Content-Type", "application/json")
            .json(user);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err.message}`,
            });
        // throw new Error(
        //     `ERROR UPDATING USER  ${req.params.userId}: ${err.message}`
        // );
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.userId);

        res.status(200)
            .setHeader("Content-Type", "application/json")
            .json({
                success: true,
                msg: `User with id ${req.params.userId} has been deleted!`,
            });
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${err.message}`,
            });
        // throw new Error(
        //     `ERROR DELETING USER ${req.params.userId}: ${err.message}`
        // );
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`fill email and password`}`,
            });

    //find a user by email
    const user = await User.findOne({ email }).select("+password");

    //check to see if the user is returned
    if (!user)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`invalid credentials`}`,
            });

    //check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`invalid credentials`}`,
            });

    sendTokenResponse(user, 200, res);
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`invalid credentials`}`,
            });

    const resetToken = user.getResetPasswordToken();

    try {
        await user.save({ validateBeforeSave: false });

        res.status(200)
            .setHeader("Content-Type", "application/json")
            .json({
                success: true,
                msg: `YOU CAN RESET PW WITH TOKEN: ${resetToken}`,
            });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`failed to save password token`}`,
            });
    }
};

const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.query.resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`invalid token`}`,
            });

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
};

const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!user)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`invalid credentials`}`,
            });

    // throw new Error(`Invalid Credentials`);

    const passwordMatches = await user.matchPassword(req.body.password);

    if (!passwordMatches)
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({
                success: false,
                msg: `${`pw is incorrect`}`,
            });

    //throw new Error(`Password is incorrect`);

    await user.save();

    sendTokenResponse(user, 200, res);
};

const logout = async (req, res, next) => {
    res.status(200)
        .cookie("token", "none", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        })
        .json({ success: true, msg: "Successfully logged out!" });
};

const likeAlbum = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            text = `User ${req.params.userId} not found`;
            resSuccess(res, 400, text);
        } else {
            user.likedAlbums.push(req.body);
            const result = await user.save();
            resSuccess(res, 201, result);
        }
    } catch (error) {
        resFailed(res, 400, error.message);
    }
};

const likeTrack = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            text = `User ${req.params.userId} not found`;
            resSuccess(res, 400, text);
        } else {
            user.likedTracks.push(req.body);
            const result = await user.save();
            resSuccess(res, 201, result);
        }
    } catch (error) {
        resFailed(res, 400, error.message);
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        // set expiration for cookie to be ~2 hrs
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // security to hide/encrypt payload
    };

    if (process.env.NODE_ENV === "production") options.secure = true;

    res.status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, token });
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
    getUsers,
    postUser,
    // deleteUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    likeAlbum,
    likeTrack,
};
