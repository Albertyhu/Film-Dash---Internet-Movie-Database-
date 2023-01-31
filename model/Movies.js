const mongoose = require('mongoose');
const { DateTime } = require('luxon')
const Schema = mongoose.Schema; 

const MovieSchema = new Schema({
    title: { type: String, required: true, minLength: 1 },
    year: { type: Number },
    director: { type: Schema.Types.ObjectId, ref: "Director", required: true } | [{ type: Schema.Types.ObjectId, ref: "Director", required: true }],
    actors: [{ type: Schema.Types.ObjectId, ref: "Actor" }],
    genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    tagline: { type: String },
    imdb_rating: { type: Number },
    parental_guide: { type: String },
    release_date: { type: Date },
    production_company: { type: String },
    budget: { type: String },
    runtime: { type: Number },
    poster: {type: String},
})

MovieSchema.virtual("runtime_minutes").get(function () {
    return `${this.runtime} minutes`
})

MovieSchema.virtual("FormattedReleaseDate").get(function(){
    return this.release_date ?
        DateTime.fromJSDate(this.release_date).toFormat("yyyy-MM-dd")
        :
        null; 
})

MovieSchema.virtual("url").get(function () {
    return `/catalog/movie/${this._id}`
})

module.exports = mongoose.model('Movies', MovieSchema); 