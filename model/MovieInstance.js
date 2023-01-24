const { cache } = require('ejs');
const express = require('express');
const { body, validationRequest } = require('express-validator'); 
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const MovieInstanceSchema = new Schema({
    movie: {type: Schema.Types.ObjectId, ref: "Movie", required: true}, 
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    }, 
    due_back: {type: Date, default: Date.now}, 
})

MovieInstanceSchema.virtual('FormattedDueBack').get(function () {
    return this.due_back ?
        DateTime.formJSDate(This.due_back).toFormatted('yyyy-MM-dd')
        :
        null; 
})

MovieInstanceSchema.virtual('url').get(function () {
    return `/MovieInstances/:id`
})

module.exports = mongoose.model("MovieInstance", MovieInstanceSchema); 