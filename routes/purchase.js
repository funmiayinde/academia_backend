/**
 * Created by funmi on 3/22/17.
 */
var express = require('express');
var router = express.Router();
var purchaseService = require('../services/PurchaseService');
var logger = require('../auth/logger');
var restrict = require('../auth/restrict');
// get method of articles
router.get('/', function (req, res, next) {
    res.redirect("/purchase/all_purchase")
});

// get method to create articles
router.get('/all_purchase', restrict, function (req, res, next) {
    var vm = {
        title: 'All purchase',
        activePage: 'All purchase books'
    };
    res.render('purchase/all_purchase', vm);
});

// post method to save purchase books
router.post('/api/save', function (req, res, next) {
    console.log(JSON.stringify(req.body));
    var vm = {};
    purchaseService.savePurchaseBooks(req.body,function (err, purchased) {
        if (err) {
            logger.log("err in save purchase: ", err);
            vm = {
                status: false,
                message: err,
                code: 101500
            };
            return res.json(vm);
        }else{
            logger.log('in save purchase :',purchased);
            vm = {
                status: true,
                data:purchased,
                code : 101200
            };
            return res.json(vm);
        }
    })
});


module.exports = router;