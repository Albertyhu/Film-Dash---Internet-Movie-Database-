const { body, validationResult } = require("express-validator");
const async = require("async");

const Director = require("../model/Directors");
const Movie = require("../model/Movies");
const Genre = require("../model/Genres");
const ParseText = require("../util/parseText");
const directorObj = require('../data/dummyDirectorData')

exports.DirectorList = (req, res, next) => {
    async.parallel(
        {
            GetDirectorList(callback) {
                Director.find({}).exec(callback)
            },
            GetGenreList(callback) {
                Genre.find({}).exec(callback)
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }
            if (result != null) {
                res.render("director_list", {
                    title: "Directors",
                    director_list: result.GetDirectorList, 
                    genre_list: result.GetGenreList, 
                    logo: "../images/FilmDashLogo.png",
                    burgerMenu: "../../icon/hamburger_menu_white.png",
                });
            }
        }
    )
}

exports.DirectorDetail = (req, res, next) => {
    async.parallel({
        GetDirector(callback) {
            Director.findById(req.params.id).exec(callback)
        },
        GetGenreList(callback) {
            Genre.find({}).exec(callback)
        },
        MovieList(callback) {
            Movie.find({ director: { $in: req.params.id } })
                .populate('director')
                .populate('actors')
                .populate('genres')
                .exec(callback)
        }
    },
        (err, result) => {
            if (err) {
                return next(err);
            }
            const category = 'director'
            if (result != null) {
                res.render("director_detail", {
                    title: result.GetDirector.name,
                    director: result.GetDirector,
                    movie_list: result.MovieList,
                    genre_list: result.GetGenreList,
                    logoURL: "../../images/FilmDashLogo.png",
                    burgerMenu: "../../icon/hamburger_menu_white.png",
                    imdbLogo: "../../images/IMDB_logo.png",
                    updateURL: `/catalog/${category}/${req.params.id}/update`,
                    deleteURL: `/catalog/${category}/${req.params.id}/delete`,
                });
            }
        }
    )
}

exports.DirectorCreate_Get = (req, res, next) => {

    Genre.find({}).exec((err, result) => {
        if (err) {
            return next(err);
        }

        if (result != null) {
            res.render("director_form", {
                title: "Add a director to the database",
                genre_list: result,
                logoURL: "../../images/FilmDashLogo.png",
                burgerMenu: "../../icon/hamburger_menu_white.png",
                error: [],
                director: directorObj, 
            });
        }
    })
}

exports.DirectorCreate_Post = [
    body('name')
        .trim()
        .isLength({ minLength: 1 })
        .withMessage("The name of the director needs to be specified.")
        .escape(),
    body('birthdate')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('birthplace')
        .trim()
        .escape(),
    body('height')
        .trim()
        .escape(),
    body('spouse')
        .trim()
        .escape(),
    body('occupation')
        .escape(), 
    body('known_for')
        .escape(),
    body('degree')
        .trim()
        .escape(),
    body('field')
        .trim()
        .escape(),
    body('school')
        .trim()
        .escape(),
    body('awards')
        .escape(),
    body('quotes')
        .escape(),
    body('imdb_page')
        .trim()
        .escape(),
    body('portrait')
        .trim()
        .escape(),
    (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            Genre.find({}).exec((err, result) => {
                if (err) {
                    return next(err);
                }
                if (result != null) {
                    res.render("director_form", {
                        title: "Add a director to the database",
                        genre_list: result,
                        logoURL: "../../images/FilmDashLogo.png",
                        burgerMenu: "../../icon/hamburger_menu_white.png",
                        error: error, 
                    });
                }
            })
        }
        var obj = {
            name: ParseText(decodeURIComponent(req.body.name)),
            birthdate: req.body.birthdate,
            birthplace: ParseText(decodeURIComponent(req.body.birthplace)),
            height: ParseText(decodeURIComponent(req.body.height)),
            spouse: ParseText(decodeURIComponent(req.body.spouse)),
            occupation: req.body.occupation.split(","),
            known_for: req.body.known_for.split(","),
            education: {
                degree: ParseText(decodeURIComponent(req.body.degree)),
                field: ParseText(decodeURIComponent(req.body.field)),
                school: ParseText(decodeURIComponent(req.body.school)),
            },
            awards: req.body.awards.split(","),
            quotes: req.body.quotes.split(","),
            imdb_page: ParseText(decodeURIComponent(req.body.imdb)),
            portrait: ParseText(decodeURIComponent(req.body.portrait))
        }

        const newDirector = new Director(obj)
        newDirector.save((err) => {
            if (err) {
                return next(err)
            }
            res.redirect(`/${newDirector.url}`)
        })
    }
]