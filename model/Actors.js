const mongoose = require("mongoose");
const { DateTime, setLocale } = require("luxon");
const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    birthdate: { type: Date },
    birthplace: { type: String, required: false, maxLength: 100 },
    height: { type: String, required: false, maxLength: 100 },
    occupation: [{type: String, required: false, maxLength: 100}] ,
    biography: { type: String, required: false },
}); 

ActorSchema.virtual('birthdate_formatted').get(function () {
    return this.birthplace ?
        DateTime.fromJSDate(this.birthplace).toFormat('yyyy-MM--dd')
        :
        null; 
})

ActorSchema.virtual("url").get(function () {
    return `/actors/:id`
})

module.exports = mongoose.model("Actor", ActorSchema)