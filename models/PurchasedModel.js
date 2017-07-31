/**
 * Created by funmi on 3/21/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var purchaseSchema = new Schema({
    user_id: {type: String, require: "Please enter user id"},
    book_id: {type: String, require: "Please enter book id"},
    book_title: {type: String, require: "Please enter book title"},
    book_author: {type: String, require: "Please enter book author"},
    book_description: {type: String, require: "Please enter book description"},
    main_book: {type: String, require: "Please select main book"},
    book_cover: {type: String, require: "Please select book cover"},
    price: {type: Number, require: "Please enter book price"},
    purchase_by: {type: String, require: "Please username "},
    date_time: {type: String, require: "Please date and time purchased "},
    status: {type: String, require: "Please status"},
    purchase_id: {type: String, require: "Please status", unique:true},
    created: {type: Date, default: Date.now}
}, {collection: "purchase"});

var Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = {Purchase: Purchase};