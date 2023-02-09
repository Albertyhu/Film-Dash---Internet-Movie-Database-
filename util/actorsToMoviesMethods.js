const Movie = require('../model/Movies')

/**
 * These methods are mainly use to completement actorController functions. 
 * */

//links actor to movie model 
exports.LinkActorToMovie = (actorID, movieID) => {
    Movie.findById(movieID)
        .exec((err, result) => {
            if (err) {
                console.log("Error in linking actor to movie: ", err)
                return;
            }
            if (!result.actors.some(actor => actor.toString() == actorID)) {
                const tempArray = result.actors;
                tempArray.push(actorID)
                const newActorArray = tempArray;
                const obj = {
                    title: result.title,
                    year: result.year,
                    director: result.director,
                    actors: newActorArray,
                    genres: result.genres,
                    tagline: result.tagline,
                    imdb_rating: result.imdb_rating,
                    parental_guide: result.parental_guide,
                    release_date: result.release_date,
                    production_company: result.producton_company,
                    budget: result.budget,
                    runtime: result.runtime,
                    poster: result.poster,
                    _id: result._id,
                }
                const updateMovie = new Movie(obj)
                Movie.findByIdAndUpdate(movieID, updateMovie, {}, (err) => {
                    if (err) {
                        console.log("Error in linking actor to movie: ", err)
                        return;
                    }
                })
            }
        })
}

//removes actors from selected movies
exports.RemoveActorFromMovie = (actorID, movieIDArray) => {
    Movie.find({ actors: { $in: actorID } }).exec((err, result) => {
        if (err) {
            console.log(err)
            return;
        }

        result.forEach(item => {
            //if the ID from movieIDArray is not found in the full movie list 
            if (!movieIDArray.some(ID => ID.toString() == item._id.toString())) {
                var newActorArray = [];

                item.actors.forEach(ID => {
                    if (ID.toString() != actorID.toString()) {
                        newActorArray.push(ID)
                    }
                })

                var obj = {
                    title: item.title,
                    year: item.year,
                    director: item.director,
                    actors: newActorArray,
                    genres: item.genres,
                    tagline: item.tagline,
                    imdb_rating: item.imdb_rating,
                    parental_guide: item.parental_guide,
                    release_date: item.release_date,
                    production_company: item.producton_company,
                    budget: item.budget,
                    runtime: item.runtime,
                    poster: item.poster,
                    _id: item._id,
                }
                const updateMovie = new Movie(obj)
                Movie.findByIdAndUpdate(item._id, updateMovie, {}, (err) => {
                    if (err) {
                        console.log("Error in linking actor to movie: ", err)
                        return;
                    }
                    else {
                        console.log("Actor is successfully deleted from " + obj.title)
                    }
                })
            }
        })
    })

}