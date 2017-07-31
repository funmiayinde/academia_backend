var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

var adminService = require("../services/AdminService");
var bookService = require("../services/BookService");
var userService = require("../services/UserService");
/* GET home page. */
router.get('/', restrict,function(req, res, next) {
    var vm = {
        title : "Dashboard",
        activePage: "Dashboard"
    };

    adminService.countAdmin(function (err, admin_count) {
       if (err){
           vm = {
               error :err
           };
           return res.render('dashboard', vm);
       }else{
           bookService.countForBooks(function (book_err, book_count) {
              if (book_err){
                  vm = {
                      error :book_err
                  };
              }else{
                  userService.countUsers(function (user_err,count_users) {
                      vm = {
                          admin_count : admin_count,
                          book_count : book_count,
                          count_users : count_users
                      };
                      res.render('dashboard', vm);
                  });
              }
           });
       }
    });


});

module.exports = router;