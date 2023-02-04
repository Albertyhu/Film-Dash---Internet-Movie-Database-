const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
  name: { type: String, required: true },
  birthdate: { type: Date },
  birthplace: { type: String },
  height: { type: String, required: false },
  spouse: { type: String },
  occupation: [{ type: String }],
  known_for: [{ type: String }],
  education: {
    degree: { type: String },
    field: { type: String },
    school: { type: String },
  },
  awards: [{ type: String }],
  quotes: [{ type: String }],
  imdb_page: { type: String },
  portrait: { type:String }
});

DirectorSchema.virtual("FormattedBirthDate").get(function () {
  return this.birthdate
    ? DateTime.FromJSDate(this.birthdate).toFormat("yyyy-MM-dd")
    : null;
});

DirectorSchema.virtual("url").get(function () {
  return `catalog/director/${this._id}`;
});

module.exports = mongoose.model("Director", DirectorSchema);
