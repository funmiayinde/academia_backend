/**
 * Created by funmi on 3/21/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {type: String, require: "Please enter article title"},
    article: {type: String, require: "Please enter your article"},
    created: {type: Date, default: Date.now}
}, {collection: "articles"});

var Articles = mongoose.model('Articles', articleSchema);
module.exports = {Articles: Articles};