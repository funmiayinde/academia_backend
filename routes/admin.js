/**
 * Created by funmi on 4/7/17.
 */
/**
 * Created by funmi on 3/22/17.
 */
var express = require('express');
var router = express.Router();
var adminService = require('../services/AdminService');
var logger = require('../auth/logger');
var restrict = require('../auth/restrict');


// get method of articles
router.get('/',restrict, function (req, res, next) {
    res.redirect("/admin/create")
});

router.get('/create',restrict, function (req, res, next) {
    var vm = {
        title : "Admin",
        activePage : "Admin page"
    };
    res.render("admin/create",vm);
});

router.post('/create',restrict, function (req, res, next) {
    // logger.log("admin data :",req.body);
    var vm = {
        title : "Admin",
        activePage : "Admin page"
    };
    adminService.addAdmin(req.body,function (error) {

        if(error){
            vm = {
                error : error
            };
            return res.render("admin/create",vm);
        }else{
            vm = {
                success : "admin successfully added"
            };
            res.render("admin/create",vm);
        }
    });

});

module.exports = router;