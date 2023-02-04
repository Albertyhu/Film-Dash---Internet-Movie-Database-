const { body, validationRequest } = require("express-validator");
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
    body('name').trim().escape(),
    body('known_for')
        .escape(),
    (req, res, next) => {
        console.log("Related Work: ", req.body.known_for)
    }
    
]