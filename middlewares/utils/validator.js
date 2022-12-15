const userValidator = (req, res, next) => {
    if (req.body) {
        if (
            !req.body.userName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.gender
        ) {
            res.status(400)
                .setHeader("Content-Type", "application/json")
                .end("Missing required fields!");
        } else {
            next();
        }
    } else {
        res.end(
            `Request for route path: ${req.protocol} and method: ${req.method} is missing payload`
        );
    }
};

const adminValidator = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        res.status(403).setHeader("Content-Type", "application/json").json({
            success: false,
            msg: `UNAUTHORIZED ACCESS`,
        });
    }
};

module.exports = {
    userValidator,
    adminValidator,
};
