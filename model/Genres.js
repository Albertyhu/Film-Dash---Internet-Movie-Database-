const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String },
});

GenreSchema.virtual("url").get(function () {
  return `/catalog/genres/:id`;
});

module.exports = mongoose.model("Genre", GenreSchema);
