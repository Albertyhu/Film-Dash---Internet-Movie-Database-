const { body, validationResult } = require("express-validator");
const async = require("async");

const Genre = require("../model/Genres");
const Actor = require("../model/Actors")
const Movie = require("../model/Movies");

const ParseText = require('../util/parseText.js'); 
const encodeText = require('../util/encodeText.js');
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
                    genre_list: result.GetGenreList,
                    movie_list: result.GetActor.movies, 
                    logoURL: "/images/FilmDashLogo.png",
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

            //Join is a function I wrote that turns an array to a string. 
            //Each value is separated by the character "|"

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
                    formattedBirthday: actorObj.birthdate,
                    stringQuotes: Join(actorObj.quotes),
                    stringOccupation: Join(actorObj.occupation),
                    stringAwards: Join(actorObj.awards)
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
    body('movies')
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
    body('biography')
        .escape(), 
    (req, res, next) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
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
                        });
                    }
                }
            )
            return;
        }
        var obj = {
            name: ParseText(decodeURIComponent(req.body.name)),
            birthdate: req.body.birthdate,
            birthplace: ParseText(decodeURIComponent(req.body.birthplace)),
            height: ParseText(decodeURIComponent(req.body.height)),
            spouse: ParseText(decodeURIComponent(req.body.spouse)),
            occupation: req.body.occupation.split(","),
            movies: req.body.movies.split(","), 
            awards: req.body.awards.split(","),
            quotes: ParseText(decodeURIComponent(req.body.quotes)).split("|"),
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
            SelectedActor(callback) {
                Actor.findById(req.params.id)
                    .populate('movies')
                    .exec(callback)
            },
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
            console.log("incoming: ", Join(result.SelectedActor.quotes))
            if (result != null) {
                res.render("actor_form", {
                    title: `Update information about ${result.SelectedActor.name}`,
                    genre_list: result.GetGenres,
                    movie_list: result.GetMovies,
                    movie_titles: Join(movie_titles),
                    movie_id: Join(movie_id), 
                    logoURL: "../../../images/FilmDashLogo.png",
                    burgerMenu: "../../../icon/hamburger_menu_white.png",
                    error: [],
                    formattedBirthday: result.SelectedActor.birthdate_formatted, 
                    actor: result.SelectedActor,
                    stringQuotes: Join(result.SelectedActor.quotes),
                    stringOccupation: Join(result.SelectedActor.occupation),
                    stringAwards: Join(result.SelectedActor.awards),
                });
            }
        }
    )

}

exports.Update_Post = [
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
        body('movies')
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
        body('biography')
            .escape(),
        (req, res, next) => {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                async.parallel(
                    {
                        SelectedActor(callback) {
                            Actor.findById(req.params.id)
                                .populate('movies')
                                .exec(callback)
                        },
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
                        console.log("birth date: ", result.SelectedActor.birthdate_formatted)
                        if (result != null) {
                            res.render("actor_form", {
                                title: `Update information about ${result.SelectedActor.name}`,
                                genre_list: result.GetGenres,
                                movie_list: result.GetMovies,
                                movie_titles: Join(movie_titles),
                                movie_id: Join(movie_id),
                                logoURL: "../../../images/FilmDashLogo.png",
                                burgerMenu: "../../../icon/hamburger_menu_white.png",
                                error: error,
                                formattedBirthday: result.SelectedActor.birthdate_formatted,
                                actor: result.SelectedActor,
                                stringQuotes: Join(result.SelectedActor.quotes),
                                stringOccupation: Join(result.SelectedActor.occupation),
                                stringAwards: Join(result.SelectedActor.awards)
                            });
                        }
                    }
                )
                return;
            }

            console.log('quotes: ', req.body.quotes)
            var obj = {
                name: ParseText(decodeURIComponent(req.body.name)),
                birthdate: req.body.birthdate,
                birthplace: ParseText(decodeURIComponent(req.body.birthplace)),
                height: ParseText(decodeURIComponent(req.body.height)),
                spouse: ParseText(decodeURIComponent(req.body.spouse)),
                occupation: req.body.occupation.split(","),
                movies: req.body.movies.split(","),
                awards: req.body.awards.split(","),
                quotes: (ParseText(decodeURIComponent(req.body.quotes))).split("|"),
                imdb_page: ParseText(decodeURIComponent(req.body.imdb)),
                portrait: ParseText(decodeURIComponent(req.body.portrait)),
                biography: ParseText(decodeURIComponent(req.body.biography)),
                _id: req.params.id, 
            }
            console.log("decoded: ", obj.quotes)

            const updateActor = new Actor(obj)
            try {
                Actor.findByIdAndUpdate(req.params.id, updateActor, {}, (err, result) => {
                    if (err) {
                        return next(err)
                    }
                    //res.redirect(`../../../${result.url}`);
                    res.redirect(`/${result.url}`)
                })
            } catch (error) {
                console.log("There's an error with updating the actor: ", error)
                res.send(`There's an error with updating the actor:  ${error}`)
            }
        }

]

exports.Delete_Get = (req, res, next) => {
    async.parallel({
        GetActor(callback) {
            Actor.findById(req.params.id)
                .populate("movies")
                .exec(callback)
        },
        GetGenreList(callback) {
            Genre.find({}).exec(callback)
        },
    },
        (err, result) => {
            if (err) {
                return next(err);
            }
            const category = 'actor'
            if (result != null) {
                res.render("actor_delete", {
                    title: result.GetActor.name,
                    actor: result.GetActor,
                    genre_list: result.GetGenreList,
                    movie_list: result.GetActor.movies,
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

exports.Delete_Post = (req, res, next) => {
    Actor.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/catalog/actors')
    })

}