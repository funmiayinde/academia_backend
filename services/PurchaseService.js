/**
 * Created by funmi on 3/21/17.
 */
var Purchase = require("../models/PurchasedModel").Purchase;
var logger = require('../auth/logger');
exports.savePurchaseBooks = function (purchase_details, next) {
    var newBooks = new Purchase({
        user_id: purchase_details.user_id,
        book_id: purchase_details.book_id,
        book_title: purchase_details.book_title,
        book_author: purchase_details.book_author,
        book_description: purchase_details.book_description,
        main_book: purchase_details.main_book,
        book_cover: purchase_details.book_cover,
        price: purchase_details.price,
        purchase_by: purchase_details.purchase_by,
        date_time: purchase_details.date_time,
        status: purchase_details.status,
        purchase_id: purchase_details.purchase_id
    });
    newBooks.save(function (err, purchased) {
        if (err) {
            return next(err);
        }
        next(null, purchased);
    });
};
exports.findAllPurchasedBooks = function (next) {
    Purchase.find({}, function (err, books) {
        if (err) {
            logger.log("error from books: ", err);
            next(err, null);
        } else {
            next(null, books);
        }
    })
};
exports.findPurchaseById = function (id, next) {
    Purchase.findOne({"_id": id}, function (err, book) {
        if (err) {
            next(err, null);
        } else {
            next(null, book);
        }
    });
};

exports.countPurchaseBooks = function (next) {
    Purchase.count({}, function (err, numberOfBooks) {
        if (err) {
            next(err, null);
        } else {
            next(numberOfBooks, null);
        }
    })
};