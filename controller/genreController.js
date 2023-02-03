const { body, validationRequest } = require("express-validator");
const async = require("async");

const Genres = require("../model/Genres");
const Movies = require("../model/Movies");
const Directors = require("../model/Directors");

exports.GenreList = (req, res, next) => {
  Genres.find({}, (err, results) => {
    if (err) {
      return next(err);
    }
    res.render("genre_list", {
      title: "Genres",
      genre_list: results,
    });
  });
};

exports.GenreDetail = (req, res, next) => {
  async.waterfall(
    [
      function (callback) {
        Genres.findById(req.params.id).exec(callback);
      },

      function (genre, callback) {
        Movies.find({ genres: { $in: genre._id } }, (err, movie_list) => {
          callback(err, genre, movie_list);
        });
      },
    ],
    (err, genre, movie_list) => {
      if (err) {
        return next(err);
      }
      const category = "genre";
      res.render("genre_detail", {
        title: genre.name,
        movie_list: movie_list,
        updateURL: `/catalog/${category}/${req.params.id}/update`,
        deleteURL: `/catalog/${category}/${req.params.id}/update`,
      });
    }
  );
};

exports.GenreCreate_Get = (req, res, next) => {};

exports.GenreCreate_Post = [];
