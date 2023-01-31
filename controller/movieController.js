const { body, validationResult } = require('express-validator');
const async = require('async');
const fs = require('fs');
const Movie = require('../model/Movies'); 
const Actor = require('../model/Actors');
const Director = require('../model/Directors'); 
const Genre = require('../model/Genres'); 
const MovieInstance = require('../model/MovieInstance'); 
const MobileFunctions = require('../util/mobileMenuFunctions');  
const MovieData = require('../data/movie.json');
const MPAA = require('../data/MPAA_ratings.js');

exports.MovieList = (req, res, next) => {
    async.parallel(
        {
            MovieList(callback) {
                Movie.find({})
                    .sort({ title: 1 })
                    .populate("actors")
                    .populate("genres")
                    .exec(callback)
            },
            DirectorList(callback) {
                Director.find({})
                .exec(callback)
            },
            GenreList(callback) {
                Genre.find({})
                .exec(callback)
            }
        },
        (err, result) => {
            if (err) {
                return next(err)
            }
            if (result != null) {
                res.render('index', {
                    title: "Movies",
                    movie_list: result.MovieList,
                    director_list: result.DirectorList,
                    genre_list: result.GenreList, 
                    video: "video/red_glitter.mp4"
                })
            }
        }
    )
}

exports.MovieDetail = (req, res, next) => {
    //The waterfall method must be written an array of functions as the first argument
    async.waterfall(
        [
            function(callback) {
                Movie.findById(req.params.id)
                    .populate('actors')
                    .populate('genres')
                    .exec(callback)
            }, 
            function (movie, callback) {
                Genre.find({}).exec((err, genres) => { callback(err, movie, genres)})
            },
            //The argument 'movie' carries the results of the previous function, which is the movie founded with req.params.id
            function(movie, genres, callback) {
                if (movie && Array.isArray(movie.director)) {
                    Director.find({ _id: { $in: movie.director } }, (err, directors) => {
                        //Once the task of finding the director of the movie is done, use the following line to pass the movie and director data to the next task
                        callback(err, movie, genres, directors)
                    })
                }
                else if (movie) {
                    Director.findById(movie.director, (err, director) => {
                        callback(err, movie, genres, director); 
                    }) 
                }
                else {
                    callback(null, null, null, null)
                }
            }
        ],
        //movie and director has to be in the following paramters for this to work
        (err, movie, genres, director) => {
            if (err) {
                return next(err)
            }

            res.render('movie_detail', {
                movie: movie,
                director: director,
                genre_list: genres, 
            })
        }
    )
}

exports.MovieCreate_Get = (req, res, next) => {
    async.parallel(
        {
            GenreList(callback) {
                Genre.find({}).exec(callback)
            },
            ActorList(callback) {
                Actor.find({}).exec(callback)
            },
            DirectorList(callback) {
                Director.find({}).exec(callback)
            }
        },
        (err, result) => {
            if (err)
                return next(err);
            res.render("movie_form", {
                title: "Add a movie to the database", 
                genre_list: result.GenreList, 
                actor_list: result.ActorList, 
                director_list: result.DirectorList,
                MPAA_ratings: MPAA, 
                errors: [], 
            })

        }
    )
}

exports.MovieCreate_Post = [
    body('title', 'Title must not be empty')
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title of the movie needs to be specified.")
        .escape(),
    body('year') 
        .trim()
        .escape(),
    body('director')
        .escape(),
    body('actor')
        .escape(),
    body('genre')
        .escape(),
    body('tagline')
        .escape(),
    body('imdb_rating')
        .escape(),
    body('parental_guide')
        .escape(),
    body('date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('budget')
        .escape(), 
    body('runtime')
        .escape(), 
    body('poster')
        .escape(),
    (req, res, next) => {
    try {
        const errors = validationResult(req); 
        if (!errors.isEmpty) {
            async.parallel(
                {
                    GenreList(callback) {
                        Genre.find({}).exec(callback)
                    },
                    ActorList(callback) {
                        Actor.find({}).exec(callback)
                    },
                    DirectorList(callback) {
                        Director.find({}).exec(callback)
                    }
                },
                (err, result) => {
                    if (err)
                        return next(err);
                    res.render("movie_form", {
                        title: "Add a movie to the database",
                        genre_list: result.GenreList,
                        actor_list: result.ActorList,
                        director_list: result.DirectorList,
                        MPAA_ratings: MPAA,
                        errors: errors.array()
                    })

                }
            ); 
            return; 
        }
        const obj = {
            title: req.body.title, 
            year: req.body.year, 
            director: req.body.director, 
            actor: req.body.actor, 
            genre: req.body.genre, 
            tagline: req.body.tagline, 
            imdb_rating: req.body.imdb_rating, 
            parental_guide: req.body.parental_guide, 
            release_date: req.body.release_date, 
            budget: req.body.budget, 
            runtime: req.body.runtime, 
            poster: req.body.poster
        }
        const newMovie = new Movie(obj)

            newMovie.save(err => {
                if (err) {
                    console.log("Error in saving movie to the database: ", err)
                    return next(err)
                }
                res.redirect(newMovie.url)
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error"); 
        }
    }
]

