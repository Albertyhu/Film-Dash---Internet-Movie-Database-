const { body, validationResult } = require("express-validator");
const async = require("async");

const Genres = require("../model/Genres");
const Movies = require("../model/Movies");
const Directors = require("../model/Directors");
const ParseText = require("../util/parseText");

exports.GenreList = (req, res, next) => {
  Genres.find({}, (err, results) => {
    if (err) {
      return next(err);
    }
    res.render("genre_list", {
        title: "Genres",
        genre_list: results,
        logoURL: "/images/FilmDashLogo.png",
        burgerMenu: "../../../icon/hamburger_menu_white.png",
    });
  });
};

exports.GenreDetail = (req, res, next) => {
    async.parallel(
        {
            GenreList(callback) {
                Genres.find({}).exec(callback)
            },
            SelectedGenre(callback) {
                Genres.findById(req.params.id).exec(callback);
            },
            SelectedMovie(callback) {
                Movies.find({ genres: { $in: req.params.id } })
                    .populate("director")
                    .populate("actors")
                    .populate("genres")
                    .exec(callback)
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }
            const category = "genre";
            res.render("genre_detail", {
                title: result.SelectedGenre.name,
                SelectedGenre: result.SelectedGenre,
                movie_list: result.SelectedMovie,
                genre_list: result.GenreList,
                updateURL: `/catalog/${category}/${req.params.id}/update`,
                deleteURL: `/catalog/${category}/${req.params.id}/delete`,
                logoURL: "/images/FilmDashLogo.png",
                burgerMenu: "../../../icon/hamburger_menu_white.png",
            });
        }
    );
};

const sampleGenre = {
    name: "Horror Comedy",
    image: "https://m.media-amazon.com/images/M/MV5BMTg5Mjk2NDMtZTk0Ny00YTQ0LWIzYWEtMWI5MGQ0Mjg1OTNkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
}

exports.GenreCreate_Get = (req, res, next) => {
    Genres.find({}).exec((err, result) => {
        if (err) {
            return next(err)
        }
        res.render("genre_form", {
            title: `Add a new genre`,
            genre_list: result,
            logoURL: "/images/FilmDashLogo.png",
            burgerMenu: "../../../icon/hamburger_menu_white.png",
            error: [],
        })
    })
};

exports.GenreCreate_Post = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage("The name of the genre cannot be empty")
        .escape(),
    body('image')
        .trim()
        .isLength({ min: 1 })
        .withMessage("You have to have an image for this genre")
        .escape(),
    (req, res, next) => {
        const error = validationResult(req); 
        if (!error.isEmpty()) {
            async.parallel(
                {
                    GenreList(callback) {
                        Genres.find({}).exec(callback)
                    },
                },
                (err, result) => {
                    if (err) {
                        return next(err)
                    }
                    res.render("genre_form", {
                        title: `Add a new genre`,
                        genre_list: result.GenreList,
                        logoURL: "/images/FilmDashLogo.png",
                        burgerMenu: "../../../icon/hamburger_menu_white.png",
                        error: error
                    })
                }
            )
            return; 
        }
        var obj = {
            name: ParseText(decodeURIComponent(req.body.name)), 
            image: ParseText(decodeURIComponent(req.body.image))
        }
        var newGenre = new Genres(obj)
        newGenre.save((err) => {
            if (err) {
                return next(err)
            }
            res.redirect(`/${newGenre.url}`)
        })
    }
];


exports.Update_Get = (req, res, next) => {
    async.parallel(
        {
            GenreList(callback) {
                Genres.find({}).exec(callback)
            },
            SelectedGenre(callback) {
                Genres.findById(req.params.id).exec(callback);
            },
        },
        (err, result) => {
            if (err) {
                return next(err)
            }
            res.render("genre_form", {
                title: `Update information about ${result.SelectedGenre.name}`,
                genre: result.SelectedGenre, 
                genre_list: result.GenreList,
                logoURL: "/images/FilmDashLogo.png",
                burgerMenu: "../../../icon/hamburger_menu_white.png",
            })
        }
    )
};

exports.Update_Post = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage("The name of the genre cannot be empty")
        .escape(),
    body('image')
        .trim()
        .isLength({ min: 1 })
        .withMessage("You have to have an image for this genre")
        .escape(),
    (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            async.parallel(
                {
                    GenreList(callback) {
                        Genres.find({}).exec(callback)
                    },
                },
                (err, result) => {
                    if (err) {
                        return next(err)
                    }
                    res.render("genre_form", {
                        title: `Add a new genre`,
                        genre_list: result.GenreList,
                        logoURL: "/images/FilmDashLogo.png",
                        burgerMenu: "../../../icon/hamburger_menu_white.png",
                        error: error
                    })
                }
            )
            return;
        }
        var obj = {
            name: ParseText(decodeURIComponent(req.body.name)),
            image: ParseText(decodeURIComponent(req.body.image)),
            _id: req.params.id, 
        }
        var updateGenre = new Genres(obj)
        Genres.findByIdAndUpdate(req.params.id, updateGenre, {}, (err, result) => {
            if (err) {
                return next(err)
            }
            res.redirect(`../../../${result.url}`)
        })
    }
];

exports.Delete_Get = (req, res, next) => {
    async.parallel(
        {
            GenreList(callback) {
                Genres.find({}).exec(callback)
            },
            SelectedGenre(callback) {
                Genres.findById(req.params.id).exec(callback);
            },
        }, 
        (err, result) => {
            if (err) {
                return next(err);
            }
            const category = "genre";
            res.render("genre_delete", {
                title: result.SelectedGenre.name,
                genre: result.SelectedGenre,
                genre_list: result.GenreList,
                logoURL: "/images/FilmDashLogo.png",
                burgerMenu: "../../../icon/hamburger_menu_white.png",
            });
        }
    )
}

exports.Delete_Post = (req, res, next) => {
    Genres.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            return next(err)
        res.redirect('../../../catalog/genres')
    })
}