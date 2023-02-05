const { body, validationResult } = require("express-validator");
const async = require("async");

const Director = require("../model/Directors");
const Movie = require("../model/Movies");
const Genre = require("../model/Genres");

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

const SampleArray = ["Sample1", "Sample2"];

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
                DirectorWork: SampleArray.toString(), 
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
        const error = validationResult = validationResult(req)
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
            name: req.body.name,
            birthdate: req.body.birthdate,
            birthplace: req.body.birthplace,
            height: req.body.height,
            spouse: req.body.spouse,
            occupation: req.body.occupation,
            known_for: req.body.known_for,
            education: {
                degree: req.body.degree,
                field: req.body.field,
                school: req.body.school,
            },
            awards: req.body.awards,
            quotes: req.body.quotes,
            imdb_page: req.body.imdb,
            portrait: req.body.portrait
        }

        const newDirector = new Director(obj)
        newDirector.save((err, result) => {
            if (err) {
                return next(err)
            }
            res.redirect(result.url)
        })
    }
]