const mongoose = require("mongoose");
const { DateTime, setLocale } = require("luxon");
const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    birthdate: { type: Date },
    birthplace: { type: String, required: false, maxLength: 100 },
    height: { type: String, required: false, maxLength: 100 },
    spouse: { type: String, required: false, maxLength: 100 },
    occupation: [{ type: String, required: false, maxLength: 100 }],
    biography: { type: String, required: false, maxlength: 1000 },
    portrait: { type: String },
    awards: [{ type: String }],
    quotes: [{ type: String }],
    imdb: { type: String },
    movies: [{ type: Schema.Types.ObjectId, ref: "Movies" }], 
});

ActorSchema.virtual("birthdate_formatted").get(function () {
  return this.birthdate
    ? DateTime.fromJSDate(this.birthdate).toFormat("yyyy-MM-dd")
    : null;
});

ActorSchema.virtual("url").get(function () {
  return `catalog/actor/${this._id}`;
});

ActorSchema.virtual("BirthDateToLocaleString").get(function () {
    return this.birthdate
        ? DateTime.fromJSDate(this.birthdate).toLocaleString()
        : null;
});

module.exports = mongoose.model("Actor", ActorSchema);
