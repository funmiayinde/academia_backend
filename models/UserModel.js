/**
 * Created by funmi on 3/21/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    first_name: {type: String, require: "Please enter the first name"},
    last_name: {type: String, require: "Please enter last name"},
    email: {type: String, require: "Please enter email "},
    username: {type: String, require: "Please enter your name "},
    gender: {type: String, require: "Please select gender "},
    address: {type: String, require: "Please enter address"},
    phone_number: {type: Number, require: "Please enter your phone number"},
    is_deleted: {type: Boolean, require: "Please set is selected to be true or false"},
    role: {type: String, require: "Please enter your role"},
    created: {type: Date, default: Date.now}
}, {collection: "users"});

var Users = mongoose.model('Users', userSchema);
module.exports = {Users: Users};