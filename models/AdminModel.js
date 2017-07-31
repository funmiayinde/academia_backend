var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminService = require('../services/AdminService');

var adminSchema = new Schema({
    first_name: {type: String, required: 'Please Enter your first name'},
    last_name: {type: String, required: 'Please Enter your last name'},
    email: {type: String, required: 'Please Enter your email'},
    username: {type: String, required: 'Please Enter your username'},
    password: {type: String, required: 'Please Enter your Password'},
    address: {type: String, required: 'Please Enter your address'},
    gender: {type: String, required: 'Please select admin gender'},
    phone_number: {type: String, required: 'Please Enter your phone number'},
    role: {type: String, required: 'Please select your admin role'}
}, {collection: 'adminLogin'});

adminSchema.path('username').validate(function (value, next) {
    adminService.findAdmin(value, function (err, admin) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(!admin);
    });
}, 'wrong Credentials');


var Admin = mongoose.model('Admin', adminSchema);

module.exports = {
    Admin: Admin
};
