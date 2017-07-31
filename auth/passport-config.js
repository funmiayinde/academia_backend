module.exports = function() {
	var passport = require('passport');
	var passportLocal = require('passport-local');
	var bcrypt = require('bcrypt-nodejs');
	var adminService = require('../services/AdminService');
	

	passport.use(new passportLocal.Strategy( function(username, password, next){
		adminService.findAdmin(username, function(err, admin){
			if (err) {
				return next(err);
			}
			if (!admin) {
				return next(null, null);
			}
            bcrypt.compare(password, admin.password, function (err, same) {
                if (err){
                    return next(err);
                }
                if(!same){
                    return(null, null);
                }
                next(null, admin);
            });
		});
	}));

	// bcrypt


	passport.serializeUser(function(admin, next){
		next(null, admin.username);
	});

	passport.deserializeUser(function(username, next){
		adminService.findAdmin(username, function(err, admin){
			next(err, admin);
		});
	});
};