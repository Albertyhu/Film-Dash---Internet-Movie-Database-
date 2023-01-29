const { body, validationRequest } = require('express-validator');
const async = require('async')

const Genres = require('../model/Genres')
const Movies = require('../model/Movies')
const Directors = require('../model/Directors')

exports.GenreList = (req, res, next) => {
    Genres.find({}, (err, results) => {
        if (err) {
            return next(err)
        }
        res.render('genre_list', {
            title: "Genres",
            genre_list: results, 
        })
    })
}

exports.GenreDetail = (req, res, next) => {
    async.parallel(
        {
            TargetGenre(callback) {
                Genres.findById(req.params.id)
                    .exec(callback)
            },
            FullMovieList(callback) {
                Movie.findById({})
                    .populate('genres')
                .exec(callback)
            }
        },
        (err, results)=>{
            if (err) {
                 return next(err)
            }

            res.render('genre_detail', {
                title: results.TargetGenre.name, 
            })
        }
    )
}