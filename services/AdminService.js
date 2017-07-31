var Admin = require('../models/AdminModel').Admin;
var bcrypt = require('bcrypt-nodejs');


exports.findAdmin = function (admin, next) {
    console.log('Admin to find:' + admin);
    Admin.findOne({username: admin}, function (err, agent) {
        next(err, agent);
    });
};

exports.addAdmin = function (admin, next) {

    bcrypt.hash(admin.password, null, null, function (err, hash) {

        if (err) {
            return next(err);
        }
        var newAdmin = new Admin({
            first_name: admin.first_name,
            last_name: admin.last_name,
            email: admin.email,
            username: admin.username,
            password: hash,
            address: admin.address,
            gender: admin.gender,
            phone_number: admin.phone_number,
            role : admin.role

        });
        newAdmin.save(function (err) {
            if (err) {
                return next(err);
            }
            next(null);
        });
    });
};
exports.countAdmin = function (next) {
  Admin.count({},function (err, admin_count) {
      if (err){
          return next(err,null);
      }
      return next(null,admin_count);
  })
};


