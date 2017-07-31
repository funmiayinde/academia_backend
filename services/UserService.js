/**
 * Created by funmi on 3/21/17.
 */
var Users = require("../models/UserModel").Users;

exports.createUser = function (user,next) {
    var newUsers = new Users({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        gender: user.gender,
        address: user.address,
        is_deleted: user.is_deleted,
        role: user.role,
        phone_number: user.phone_number
    });
    newUsers.save(function (err) {
        if (err){
            return next(err);
        }
        next(null);
    });
};
exports.findUser = function (next) {
    Users.find({is_deleted : false}, function (err, users) {
        if (err) {
            logger.log("error from user: ", err);
            next(err, null);
        } else {
            next(null,users);
        }
    })
};
exports.findUserById = function (id, next) {
    Users.findOne({"_id": id}, function (err, user) {
        if (err) {
            next(err, null);
        } else {
            next(null,user);
        }
    });
};
exports.updateUser = function (user, next) {
    logger.log("user id:" + user.id);
    Users.findOneAndUpdate({"_id": user.id}, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        gender: user.gender,
        address: user.address,
        is_deleted: user.is_deleted,
        role: user.role,
        phone_number: user.phone_number
    }, {upsert: true, 'new': true}, function (err, users) {
        if (err) {
            next(err, null);
        } else {
            next(null, users);
        }
    });
};
exports.deleteUser = function (id, next) {
    Users.findOneAndUpdate({"_id": id},{
        is_deleted : true
    },{upsert: true, 'new': true}, function (err, users) {
        if (err) {
            next(err, null);
        } else {
            next(users, null);
        }
    })
};
exports.countUsers = function (next) {
    Users.count({is_deleted : false}, function (err, numberOfUsers) {
        if (err) {
            next(err, null);
        } else {
            next(null,numberOfUsers);
        }
    })
};