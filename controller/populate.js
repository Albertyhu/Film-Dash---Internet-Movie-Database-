const Movie = require('../model/Movies');
const Actor = require('../model/Actors');
const Director = require('../model/Directors');
const Genre = require('../model/Genres')
const MovieInstance = require('../model/MovieInstance')
const async = require('async');
const {validationResult } = require('express-validator')
const MovieData = require('../data/movie.json'); 

const MoviesArray = []

const PopulateMovie = (req, res, next) => {
    //console.log(MovieData.movies)
        MovieData.movies.forEach(item => {
        const obj = {
            title: item.title,
            year: item.year,
            director: item.director,
            actors: item.actors,
            genres: item.genres,
            tagline: item.tagline,
            imdb_rating: item.imdb_rating,
            parental_guide: item.parental_guide,
            release_date: item.release_date,
            production_company: item.production_company,
            budget: item.budget,
            runtime: item.runtime,
            poster: item.poster,
        }
        const newMovie = new Movie(obj); 
        newMovie.save(err => {
            if (err) {
                console.log("Error in uploading movie.", err); 
                return; 
            }
            else {
                MoviesArray.push(newMovie)
            }
        })
    })
}

exports.populateDatabase = (req, res) => {
    async.series(
        [
            PopulateMovie,
        ],
        function (err, results) {
            if (err) {
                console.log('FINAL ERR: ' + err);
            }
            else {
                console.log("Database is successfully populated");

            }
            // All done, disconnect from database
            mongoose.connection.close();
        }
    )
}

