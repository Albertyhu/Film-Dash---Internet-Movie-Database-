const { body, validationRequest } = require('express-validator');
const async = require('async')

const Movie = require('../model/Movies'); 
const Actor = require('../model/Actors');
const Director = require('../model/Directors'); 
const Genre = require('../model/Genres')
const MovieInstance = require('../model/MovieInstance')

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
            }
        },
        (err, result) => {
            if (err) {
                return next(err)
            }
            console.log("Director: ", result.DirectorList[0]._id)
            if (result != null) {
                res.render('index', {
                    title: "Movies",
                    movie_list: result.MovieList,
                    director_list: result.DirectorList, 
                })
            }
        }
    )
    //Movie.find({})
    //    .sort({ title: 1 })
    //    .populate("director")
    //    .populate("actors")
    //    .populate("genres")
    //    .exec(function (err, result){
    //        if (err) {
    //            return next(err)
    //        }
    //        console.log("film: ", result[0].title)
    //        console.log("director: ", result[0].director)
    //        if (result != null) { 
    //            res.render('index', {
    //                title: "Movies",
    //                movie_list: result,
    //            })
    //        }
    //    })
}

exports.MovieDetail = (req, res, next) => { }

exports.MovieCreate_Get = (req, res, next) => { }

exports.MovieCreate_Post = []

