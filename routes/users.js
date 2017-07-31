/**
 * Created by funmi on 4/7/17.
 */
/**
 * Created by funmi on 3/22/17.
 */
var express = require('express');
var router = express.Router();
var userService = require('../services/UserService');
var logger = require('../auth/logger');
var restrict = require('../auth/restrict');


// get method of articles
router.get('/', restrict, function (req, res, next) {
    res.redirect("/users/create")
});

router.get('/create', restrict, function (req, res, next) {
    var vm = {
        title: "Users",
        activePage: "Users page"
    };
    res.render("users/create", vm);
});

router.get('/all_users', restrict, function (req, res, next) {
    var vm = {
        title: 'View all books',
        activePage: 'All books uploaded'
    };

    userService.findUser(function (err, users) {
        logger.log("user from route :", users);
        vm = {
            title: 'User',
            activePage: 'All users',
            users: users
        };
        res.render('users/all_users', vm);
    });
});

router.get('/create', restrict, function (req, res, next) {
    var vm = {
        title: "Users",
        activePage: "Users page"
    };
    res.render("users/create", vm);
});

router.post('/create', restrict, function (req, res, next) {
    // logger.log("admin data :",req.body);
    var vm = {
        title: "Users",
        activePage: "Users page"
    };
    req.body.is_deleted = false;
    userService.createUser(req.body, function (error) {

        if (error) {
            vm = {
                error: error
            };
            return res.render("users/create", vm);
        } else {
            vm = {
                success: "user successfully added"
            };
            res.render("users/create", vm);
        }
    });

});
router.delete('/delete', restrict, function (req, res, next) {
    var vm = {
        title: 'Users',
        activePage: 'All Users'
    };
    res.render('user/all_users', vm);

});

module.exports = router;