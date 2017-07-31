var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var passport = require('passport');
var adminService = require('../services/AdminService');
var config = require('../config');
var restrict = require('../auth/restrict');

/* GET home page. */
router.get('/', function(req, res, next) {
console.log("user: " + JSON.stringify(req.user));
  if(req.user){
    return res.redirect('/dashboard');
  }

  // res.render('index', { title: 'Express' });
  console.log('%%%%%flash error:'+req.flash('error'));
  res.render('index', { title: 'Login', error: req.flash('error'), layout: 'other' });
});

/* GET home page. */
router.get('/logout', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

/* POST add admin user. */
router.post('/addAdmin', function(req, res, next) {
    adminService.addAdmin(req.body, function(err){
        console.log(req.body);
        if (err) {
            res.json({
                message:'admin not added'
            });
        }else{
            res.json({
                message:'admin added'
            })
        }
    });
});


router.post('/',
    function (req, res, next) {
        if (req.body.rememberMe){
            req.session.cookie.maxAge = config.cookieMaxAge
        }
        next();
    },
    passport.authenticate('local',{
      failureRedirect:'/',
      successRedirect:'/dashboard',
      failureFlash: 'invalid username or password'
    }));

module.exports = router;
