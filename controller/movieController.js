const { body, validationResult } = require("express-validator");
const async = require("async");
const fs = require("fs");
const Movie = require("../model/Movies");
const Actor = require("../model/Actors");
const Director = require("../model/Directors");
const Genre = require("../model/Genres");
const MovieInstance = require("../model/MovieInstance");
const MobileFunctions = require("../util/mobileMenuFunctions");
const MovieData = require("../data/movie.json");
const MPAA = require("../data/MPAA_ratings.js");
const path = require("path");
const ParseText = require("../util/parseText");
const { ifError } = require("assert");

const logo = fs
  .readFileSync(path.join(__dirname, "../public/images/FilmDashLogo.png"))
  .toString("base64");
const burgerMenu = fs
  .readFileSync(path.join(__dirname, "../public/icon/hamburger_menu_white.png"))
  .toString("base64");

const htmlEntities = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27": "'",
};

exports.MovieList = (req, res, next) => {
  async.parallel(
    {
      MovieList(callback) {
        Movie.find({})
          .sort({ title: 1 })
          .populate('director')
          .populate("actors")
          .populate("genres")
          .exec(callback);
      },
      DirectorList(callback) {
        Director.find({}).exec(callback);
      },
      GenreList(callback) {
        Genre.find({}).exec(callback);
      },
    },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result != null) {
        res.render("index", {
          title: "Movies",
          movie_list: result.MovieList,
          director_list: result.DirectorList,
          genre_list: result.GenreList,
          video: "video/red_glitter.mp4",
          logo: logo,
            burgerMenu: "../../icon/hamburger_menu_white.png",
            searchIcon: "/icon/search-white.png",
          DataList: result.MovieList, 
        });
      }
    }
  );
};

//Waterfall example for future reference
//exports.MovieDetail = (req, res, next) => {
//    //The waterfall method must be written an array of functions as the first argument
//    async.waterfall(
//        [
//            function(callback) {
//                Movie.findById(req.params.id)
//                    .populate('actors')
//                    .populate('genres')
//                    .populate('director')
//                    .exec(callback)
//            },
//            function (movie, callback) {
//                Genre.find({}).exec((err, genres) => { callback(err, movie, genres)})
//            },
//            //The argument 'movie' carries the results of the previous function, which is the movie founded with req.params.id
//            function(movie, genres, callback) {
//                if (movie && Array.isArray(movie.director)) {
//                    Director.find({ _id: { $in: movie.director } }, (err, directors) => {
//                        //Once the task of finding the director of the movie is done, use the following line to pass the movie and director data to the next task
//                        callback(err, movie, genres, directors)
//                    })
//                }
//                else if (movie) {
//                    Director.findById(movie.director, (err, director) => {
//                        callback(err, movie, genres, director);
//                    })
//                }
//                else {
//                    callback(null, null, null, null)
//                }
//            }
//        ],
//        //movie and director has to be in the following paramters for this to work
//        (err, movie, genres, director) => {
//            if (err) {
//                return next(err)
//            }
//            const category = 'movie'
//            res.render('movie_detail', {
//                movie: movie,
//                director: director,
//                genre_list: genres,
//                updateURL: `/catalog/${category}/${req.params.id}/update`,
//                deleteURL: `/catalog/${category}/${req.params.id}/update`,
//                logo: logo,
//                burgerMenu: "../../icon/hamburger_menu_white.png",
//            })
//        }
//    )
//}

exports.MovieDetail = (req, res, next) => {
  async.parallel(
    {
      SelectedMovie(callback) {
        Movie.findById(req.params.id)
          .populate("actors")
          .populate("genres")
          .populate("director")
          .exec(callback);
      },
      GenreList(callback) {
        Genre.find({}).exec(callback);
      },
      MovieInstanceList(callback) {
        MovieInstance.find({ movie: req.params.id }).exec(callback);
      },
    },
    (err, result) => {
      if (err) {
        return next(err);
      }
      const category = "movie";
      res.render("movie_detail", {
        movie: result.SelectedMovie,
        director: result.SelectedMovie.director,
        genre_list: result.GenreList,
        movieinstances: result.MovieInstanceList,
        updateURL: `/catalog/${category}/${req.params.id}/update`,
        deleteURL: `/catalog/${category}/${req.params.id}/delete`,
        logoURL: "../../images/FilmDashLogo.png",
        burgerMenu: "../../icon/hamburger_menu_white.png",
      });
    }
  );
};

exports.MovieCreate_Get = (req, res, next) => {
  async.parallel(
    {
      GenreList(callback) {
        Genre.find({}).exec(callback);
      },
      ActorList(callback) {
        Actor.find({}).exec(callback);
      },
      DirectorList(callback) {
        Director.find({}).exec(callback);
      },
    },
    (err, result) => {
      if (err) return next(err);

      if (!Array.isArray(result.DirectorList)) {
        result.DirectorList =
          typeof result.DirectorList != "undefined"
            ? [result.DirectorList]
            : [];
      }

      res.render("movie_form", {
        title: "Add a movie to the database",
        genre_list: result.GenreList,
        actor_list: result.ActorList,
        director_list: result.DirectorList,
        MPAA_ratings: MPAA,
        logoURL: "/images/FilmDashLogo.png",
        burgerMenu: "../../../icon/hamburger_menu_white.png",
        errors: [],
      });
    }
  );
};

exports.MovieCreate_Post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre != "undefined" ? [req.body.genre] : [];
    }
    if (!Array.isArray(req.body.actor)) {
      req.body.actor =
        typeof req.body.actor != "undefined" ? [req.body.actor] : [];
    }
    if (!Array.isArray(req.body.director)) {
      req.body.director =
        typeof req.body.director != "undefined" ? [req.body.director] : [];
    }
    next();
  },
  body("title", "Title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title of the movie needs to be specified.")
    .escape(),
  body("year").trim().escape(),
  body("director.*").escape(),
  body("actor.*").escape(),
  body("genre.*").escape(),
  body("tagline").escape(),
  body("imdb_rating").escape(),
  body("parental_guide").escape(),
  body("production_company").escape(),
  body("date").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("budget").escape(),
  body("runtime").escape(),
  body("poster").trim().escape(),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        async.parallel(
          {
            GenreList(callback) {
              Genre.find({}).exec(callback);
            },
            ActorList(callback) {
              Actor.find({}).exec(callback);
            },
            DirectorList(callback) {
              Director.find({}).exec(callback);
            },
          },
          (err, result) => {
            if (err) return next(err);
            res.render("movie_form", {
              title: "Add a movie to the database",
              genre_list: result.GenreList,
              actor_list: result.ActorList,
              director_list: result.DirectorList,
              MPAA_ratings: MPAA,
              logoURL: "/images/FilmDashLogo.png",
              burgerMenu: "../../../icon/hamburger_menu_white.png",
              errors: errors.array(),
            });
          }
        );
        return;
      }

      const obj = {
        title: ParseText(decodeURIComponent(req.body.title)),
        year: req.body.year,
        director: req.body.director,
        actors: req.body.actor,
        genres: req.body.genre,
        tagline: ParseText(decodeURIComponent(req.body.tagline)),
        imdb_rating: req.body.imdb_rating,
        parental_guide: req.body.parental_guide,
        production_company: ParseText(
          decodeURIComponent(req.body.production_company)
        ),
        release_date: req.body.release_date,
        budget: ParseText(decodeURIComponent(req.body.budget)),
        runtime: req.body.runtime,
        poster: ParseText(decodeURIComponent(req.body.poster)),
      };

      const newMovie = new Movie(obj);

      newMovie.save((err) => {
        if (err) {
          console.log("Error in saving movie to the database: ", err);
          return next(err);
        }
        res.redirect(newMovie.url);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },
];

exports.Update_Get = (req, res, next) => {
  async.parallel(
    {
      SelectedMovie(callback) {
        Movie.findById(req.params.id)
          .populate("actors")
          .populate("genres")
          .exec(callback);
      },
      ActorList(callback) {
        Actor.find({}).exec(callback);
      },
      GenreList(callback) {
        Genre.find({}).exec(callback);
      },
      DirectorList(callback) {
        Director.find({}).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      var defaultDirector = [];

      if (Array.isArray(results.SelectedMovie.director)) {
        results.SelectedMovie.director.forEach((director) => {
          defaultDirector.push(director._id);
        });
      } else {
        defaultDirector.push(results.SelectedMovie.director._id);
      }
      var defaultActors = [];
      results.SelectedMovie.actors.forEach((actor) => {
        defaultActors.push(actor._id);
      });

      var defaultGenres = [];
      results.SelectedMovie.genres.forEach((val) => {
        defaultGenres.push(val._id);
      });

      res.render("movie_form", {
        title: `Update details about ${results.SelectedMovie.title}`,
        movie: results.SelectedMovie,
        defaultDirector: defaultDirector,
        director_list: results.DirectorList,
        defaultActors: defaultActors,
        actor_list: results.ActorList,
        defaultGenres: defaultGenres,
        genre_list: results.GenreList,
        MPAA_ratings: MPAA,
        logoURL: "/images/FilmDashLogo.png",
        burgerMenu: "../../../icon/hamburger_menu_white.png",
        errors: [],
      });
    }
  );
};

exports.Update_Post = [
  (req, res, next) => {
    req.body.genre = !Array.isArray(req.body.genre)
      ? typeof req.body.genre != "undefined"
        ? [req.body.genre]
        : []
      : req.body.genre;
    req.body.director =
      typeof req.body.director != "undefined" ? req.body.director : [];
    req.body.actor = !Array.isArray(req.body.actor)
      ? typeof req.body.actor != "undfined"
        ? [req.body.actor]
        : []
      : req.body.actor;
    next();
  },
  body("title", "Title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title of the movie needs to be specified.")
    .escape(),
  body("year").trim().escape(),
  body("director.*").escape(),
  body("actor.*").escape(),
  body("genre.*").escape(),
  body("tagline").trim().escape(),
  body("imdb_rating").escape(),
  body("parental_guide").escape(),
  body("date").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("budget").trim().escape(),
  body("runtime").trim().escape(),
  body("poster").trim().escape(),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        async.parallel(
          {
            SelectedMovie(callback) {
              Movie.findById(req.params.id)
                .populate("actors")
                .populate("genres")
                .exec(callback);
            },
            GenreList(callback) {
              Genre.find({}).exec(callback);
            },
            ActorList(callback) {
              Actor.find({}).exec(callback);
            },
            DirectorList(callback) {
              Director.find({}).exec(callback);
            },
          },
          (err, result) => {
            if (err) return next(err);
            res.render("movie_form", {
              title: `Update details about ${result.SelectedMovie.title}`,
              movie: result.SelectedMovie,
              genre_list: result.GenreList,
              actor_list: result.ActorList,
              director_list: result.DirectorList,
              MPAA_ratings: MPAA,
              logoURL: "/images/FilmDashLogo.png",
              burgerMenu: "../../../icon/hamburger_menu_white.png",
              errors: errors.array(),
            });
          }
        );
        return;
      }

      const obj = {
        title: ParseText(decodeURIComponent(req.body.title)),
        year: req.body.year,
        director: req.body.director,
        actors: req.body.actor,
        genres: req.body.genre,
        tagline: ParseText(decodeURIComponent(req.body.tagline)),
        imdb_rating: req.body.imdb_rating,
        parental_guide: req.body.parental_guide,
        production_company: ParseText(
          decodeURIComponent(req.body.production_company)
        ),
        release_date: req.body.release_date,
        budget: ParseText(decodeURIComponent(req.body.budget)),
        runtime: req.body.runtime,
        poster: ParseText(decodeURIComponent(req.body.poster)),
        _id: req.params.id,
      };
      const updatedMovie = new Movie(obj);

        Movie.findByIdAndUpdate(
        req.params.id,
        updatedMovie,
        {},
        (err, result) => {
          if (err) {
            console.log("Error in saving movie to the database: ", err);
            return next(err);
          }
          res.redirect(result.url);
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },
];

exports.Delete_Get = (req, res, next) => {
  async.parallel(
    {
      SelectedMovie(callback) {
        Movie.findById(req.params.id)
          .populate("actors")
          .populate("genres")
          .populate("director")
          .exec(callback);
      },
      SelectedMovieInstances(callback) {
        MovieInstance.find({ movie: req.params.id }).exec(callback);
      },
      GenreList(callback) {
        Genre.find({}).exec(callback);
      },
    },
    (err, result) => {
      if (err) {
        return next(err);
      }
      const category = "movie";
        res.render("movie_delete", {
        title: 'Delete movie',
        movie: result.SelectedMovie,
        movieinstances: result.SelectedMovieInstances,
        director: result.SelectedMovie.director,
        genre_list: result.GenreList,
        updateURL: `/catalog/${category}/${req.params.id}/update`,
        deleteURL: `/catalog/${category}/${req.params.id}/update`,
        logoURL: "../../../images/FilmDashLogo.png",
        burgerMenu: "../../../icon/hamburger_menu_white.png",
      });
    }
  );
};

exports.Delete_Post = (req, res, next) => {
    Movie.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            return next(err);
        MovieInstance.deleteMany({ movie: req.params.id }, (err) => {
            if (err)
                return next(err);
            console.log("Movie Instances successfully deleted.")
        })
         res.redirect("/");
    });
};
