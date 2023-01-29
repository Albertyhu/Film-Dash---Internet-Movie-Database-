const { body, validationRequest } = require('express-validator');
const async = require('async');
const fs = require('fs');
const Movie = require('../model/Movies'); 
const Actor = require('../model/Actors');
const Director = require('../model/Directors'); 
const Genre = require('../model/Genres'); 
const MovieInstance = require('../model/MovieInstance'); 
const MobileFunctions = require('../util/mobileMenuFunctions');  
const MovieData = require('../data/movie.json')


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
            //The argument 'movie' carries the results of the previous function, which is the movie founded with req.params.id
            function(movie, callback) {
                if (movie && Array.isArray(movie.director)) {
                    Director.find({ _id: { $in: movie.director } }, (err, directors) => {
                        //Once the task of finding the director of the movie is done, use the following line to pass the movie and director data to the next task
                        callback(err, movie, directors)
                    })
                }
                else if (movie) {
                    Director.findById(movie.director, (err, director) => {
                        callback(err, movie, director); 
                    }) 
                }
                else {
                    callback(null, null, null)
                }
            }
        ],
        //movie and director has to be in the following paramters for this to work
        (err, movie, director) => {
            if (err) {
                return next(err)
            }

            res.render('movie_detail', {
                movie: movie,
                director: director, 
            })
        }
    )
}

exports.MovieCreate_Get = (req, res, next) => { }

exports.MovieCreate_Post = []

