/**
 * Created by funmi on 3/21/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var booksSchema = new Schema({
    title: {type: String, require: "Please enter book title"},
    author: {type: String, require: "Please enter book author"},
    description: {type: String, require: "Please enter book description"},
    preview: {type: String, require: "Please select book preview"},
    preview_path: {type: String, require: "Please select book preview path"},
    main_book: {type: String, require: "Please select main book"},
    main_book_path: {type: String, require: "Please select main book"},
    cover: {type: String, require: "Please select book cover"},
    cover_path: {type: String, require: "Please  book cover path"},
    is_deleted: {type: Boolean, require: "Please  enter is deleted"},
    price: {type: Number, require: "Please enter book price"},
    created: {type: Date, default: Date.now}
}, {collection: "all_books"});

var Books = mongoose.model('Books', booksSchema);
module.exports = {Books: Books};