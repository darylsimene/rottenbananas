const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const user = require(`./routes/user`);
const bananas = require(`./routes/bananas`);

//To read our config values
dotenv.config({ path: "./config/config.env" });

connectDB();

//initialize our express framework
const app = express();

//use the morgan logger for development purposes ONLY
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// read/parse json data
app.use(bodyParser.json());

//parse cookies
app.use(cookieParser());

//file upload middlware
app.use(fileupload());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //for every 10 minutes
    max: 100,
});

app.use(limiter);
app.use(helmet());
app.use(cors());
//use our logger
app.use(logger);

//hook up our routes
app.use("/user", user);
app.use("/bananas", bananas);

//handles our errors
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

//process our error and close off our server
// process.on("unhandledRejection", (err, promise) => {
//     console.log(`Error: ${err.message}`);
//     //kill our server
//     server.close(() => process.exit(1));
// });
