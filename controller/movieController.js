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
                   // openMenu: MobileFunctions.openMenu, 
                    genre_list: result.GenreList, 
                    video: "video/red_glitter.mp4"
                })
            }
        }
    )
}

exports.MovieDetail = (req, res, next) => { }

exports.MovieCreate_Get = (req, res, next) => { }

exports.MovieCreate_Post = []

