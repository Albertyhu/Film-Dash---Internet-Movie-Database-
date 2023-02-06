const { body, validationRequest } = require("express-validator");
const async = require("async");

const Genre = require("../model/Genres");
const Actor = require("../model/Actors")
const Movie = require("../model/Movies");

exports.ActorList = (req, res, next) => {
    async.parallel(
        {
            GetActorList(callback) {
                Actor.find({}).exec(callback)
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
                res.render("actor_list", {
                    title: "Actors",
                    actor_list: result.GetActorList,
                    genre_list: result.GetGenreList,
                    logo: "../images/FilmDashLogo.png",
                    burgerMenu: "../../icon/hamburger_menu_white.png",
                    avatarPic: "../images/avatar-silhouette.jpg"
                });
            }
        }
    )
}


exports.ActorDetail = (req, res, next) => {
    async.parallel({
        GetActor(callback) {
            Actor.findById(req.params.id).exec(callback)
        },
        GetGenreList(callback) {
            Genre.find({}).exec(callback)
        },
        MovieList(callback) {
            Movie.find({ actors: { $in: req.params.id } })
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
            const category = 'actor'
            if (result != null) {
                res.render("actor_detail", {
                    title: result.GetActor.name,
                    actor: result.GetActor,
                    movie_list: result.MovieList,
                    genre_list: result.GetGenreList,
                    logoURL: "../../images/FilmDashLogo.png",
                    burgerMenu: "../../icon/hamburger_menu_white.png",
                    imdbLogo: "../../images/IMDB_logo.png",
                    updateURL: `/catalog/${category}/${req.params.id}/update`,
                    deleteURL: `/catalog/${category}/${req.params.id}/delete`,
                    avatarPic: "../../images/avatar-silhouette.jpg"
                });
            }
        }
    )
}
