const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const GenreSchema = new Schema({
    name: {type: String}
}); 

GenreSchema.virtual('url').get(function () {
    return `/genres/:id`
})

module.exports = mongoose.model("Genre", GenreSchema); 