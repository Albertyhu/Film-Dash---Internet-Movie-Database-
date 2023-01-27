const { body, validationRequest } = require('express-validator');
const async = require('async')

const Movie = require('../model/Movies'); 
const Actor = require('../model/Actors');
const Director = require('../model/Directors'); 
const Genre = require('../model/Genres')
const MovieInstance = require('../model/MovieInstance')

const MovieData = require('../data/movie.json')

exports.MovieList = (req, res, next) => {
    Movie.find({})
        .sort({ title: 1 })
        .populate("director")
        .populate("actor")
        .populate("genre")
        .populate("movieinstance")
        .exec(function (err, result){
            if (err) {
                return next(err)
            }
            if (result != null) { 
                res.render('index', {
                    title: "Movies",
                    movie_list: result,
                })
            }
        })
}

exports.MovieDetail = (req, res, next) => { }

exports.MovieCreate_Get = (req, res, next) => { }

exports.MovieCreate_Post = []

