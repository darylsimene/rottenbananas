const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/userControllers");

const reqReceivedLogger = require("../middlewares/reqReceivedLogger");
const {
    userValidator,
    adminValidator,
} = require("../middlewares/utils/validator");
const protectedRoute = require("../middlewares/auth");

router
    .route("/")
    .get(reqReceivedLogger, protectedRoute, adminValidator, getUsers)
    .post(reqReceivedLogger, userValidator, postUser);
// .delete(reqReceivedLogger, protectedRoute, adminValidator, deleteUsers);

router.route("/login").post(reqReceivedLogger, login);

router.route("/forgotpassword").post(reqReceivedLogger, forgotPassword);
router.route("/resetpassword").put(reqReceivedLogger, resetPassword);
router
    .route("/updatepassword")
    .put(reqReceivedLogger, protectedRoute, updatePassword);
router.route("/logout").get(reqReceivedLogger, protectedRoute, logout);

router
    .route("/:userId")
    .get(reqReceivedLogger, getUser)
    .put(reqReceivedLogger, protectedRoute, updateUser)
    .delete(reqReceivedLogger, protectedRoute, deleteUser);

    

module.exports = router;
