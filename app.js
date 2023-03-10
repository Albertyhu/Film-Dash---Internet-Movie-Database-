var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const genre = require("./model/Genres");
const mongoose = require("mongoose");
require("dotenv").config();
var app = express();

const mongoDB = `mongodb+srv://${process.env.USER}:${process.env.PASS}@locallibrarycluster.lyfvtsg.mongodb.net/MovieRental?retryWrites=true&w=majority`;

//The explanation behind useNewUrlPaser is that Mongoose is using a new parser for url
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connection to MongoDB is successful.");
    }
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

var indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

//serves files from public
app.use(express.static("public"));

app.use("/favicon.ico", express.static("images/favicon.png"));

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

const { populateDatabase } = require("./controller/populate");

//populateDatabase();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  genre.find({}).exec((error, result) => {
    if (error) return next(error);

    res.render("error", {
      title: "Error",
      error: err.message,
      logoURL: "../../../images/FilmDashLogo.png",
      burgerMenu: "../../../icon/hamburger_menu_white.png",
      genre_list: result,
    });
  });
});

app.listen(9000);

module.exports = app;
