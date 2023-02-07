const { body, validationRequest } = require("express-validator");
const async = require("async");

const Genre = require("../model/Genres");
const Actor = require("../model/Actors")
const Movie = require("../model/Movies");

const ParseText = require('../util/parseText.js'); 
const Join = require('../util/join.js'); 

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
            Actor.findById(req.params.id)
                .populate("movies")
                .exec(callback)
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

//dummy data for testing 
const actorObj = {
    name: "Teddy Dunski",
    birthdate: "1980-01-08",
    birthplace: "Philadelphia, Pennsylvania",
    height: "5\' 10\"",
    spouse: "Martha Hunt",
    occupation: ["Actor", "Producer", "Writer"],
    awards: ["Best Actor", "Best Supporting Actor"],
    quotes: ["There is no black and white.", "Never start a land war in Asia."],
    imdb_page: "",
    portrait: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-732x549.jpg",
    biography: "Teddy Dunski was born on March 15th, 1995, in New York City. He grew up in a family of artists, with his mother being a dancer and his father a musician. This early exposure to the performing arts sparked Teddy\'s interest in acting, and he began performing in local theater productions at the age of ten. Teddy\'s talent and passion for acting led him to attend the prestigious Juilliard School in New York, where he honed his craft and graduated with honors. After graduation, he quickly landed several small roles in TV shows and movies, but it was his breakthrough performance in the indie film \"Broken Dreams\" that caught the attention of Hollywood studios.",
    movies: [
        {
            _id: "63e0a14ca08291594a165b08",
            title: "The Godfather"         
            },
        {
            _id: "63e0a14ca08291594a165b12",
            title: "The Matrix"
        }
    ]
}

exports.ActorCreate_Get = (req, res, next) => {
    async.parallel(
        {   
            GetMovies(callback) {
                Movie.find({}).exec(callback)
            },
            GetGenres(callback) {
                Genre.find({}).exec(callback)
            },
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            var movie_titles = []; 
            var movie_id = []

            if (typeof result.GetMovies != undefined && result.GetMovies.length > 0) {
                result.GetMovies.forEach(movie => {
                    movie_titles.push(movie.title);
                    movie_id.push(movie._id.toString()); 
                })
            }

            if (result != null) {
                res.render("actor_form", {
                    title: "Add a Actor to the database",
                    genre_list: result.GetGenres,
                    movie_list: result.GetMovies, 
                    movie_titles: Join(movie_titles), 
                    movie_id: Join(movie_id), 
                    logoURL: "../../images/FilmDashLogo.png",
                    burgerMenu: "../../icon/hamburger_menu_white.png",
                    error: [],
                    actor: actorObj,
                });
            }
        }
    )

}

exports.ActorCreate_Post = [
    body('name')
        .trim()
        .isLength({ minLength: 1 })
        .withMessage("The name of the Actor needs to be specified.")
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
        const error = validationResult(req)
        if (!error.isEmpty()) {
            Genre.find({}).exec((err, result) => {
                if (err) {
                    return next(err);
                }
                if (result != null) {
                    res.render("Actor_form", {
                        title: "Add a Actor to the database",
                        genre_list: result,
                        logoURL: "../../images/FilmDashLogo.png",
                        burgerMenu: "../../icon/hamburger_menu_white.png",
                        error: error,
                    });
                }
            })
            return;
        }
        var obj = {
            name: ParseText(decodeURIComponent(req.body.name)),
            birthdate: req.body.birthdate,
            birthplace: ParseText(decodeURIComponent(req.body.birthplace)),
            height: ParseText(decodeURIComponent(req.body.height)),
            spouse: ParseText(decodeURIComponent(req.body.spouse)),
            occupation: req.body.occupation.split(","),
            awards: req.body.awards.split(","),
            quotes: req.body.quotes.split(","),
            imdb_page: ParseText(decodeURIComponent(req.body.imdb)),
            portrait: ParseText(decodeURIComponent(req.body.portrait)),
            biography: ParseText(decodeURIComponent(req.body.biography))
        }

        const newActor = new Actor(obj)
        newActor.save((err) => {
            if (err) {
                return next(err)
            }
            res.redirect(`/${newActor.url}`)
        })
    }
]


exports.Update_Get = (req, res, next) => {
    async.parallel(
        {
            GetMovies(callback) {
                Movie.find({}).exec(callback)
            },
            GetGenres(callback) {
                Genre.find({}).exec(callback)
            },
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            if (result != null) {
                res.render("actor_form", {
                    title: "Add a Actor to the database",
                    genre_list: result.GetGenres,
                    movie_list: result.GetMovies,
                    logoURL: "../../images/FilmDashLogo.png",
                    burgerMenu: "../../icon/hamburger_menu_white.png",
                    error: [],
                    actor: actorObj,
                });
            }
        }
    )

}

exports.Update_Post = (req, res, next) => {

}