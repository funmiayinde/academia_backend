/**
 * Created by funmi on 3/21/17.
 */
var Books = require("../models/BookModel").Books;
var logger = require('../auth/logger');
exports.createBooks = function (books_details, next) {
    console.log("Book Model : " + JSON.stringify(books_details));
    console.log("Book model path : " + JSON.stringify(books_details.main_book_path));
    var newBooks = new Books({
        title: books_details.title,
        author: books_details.author,
        description: books_details.description,
        preview: books_details.preview,
        preview_path: books_details.preview_path,
        main_book: books_details.main_book,
        main_book_path: books_details.main_book_path,
        cover: books_details.cover,
        cover_path: books_details.cover_path,
        is_deleted: books_details.is_deleted,
        price: books_details.price
    });
    newBooks.save(function (err) {
        if (err) {
            return next(err);
        }
        next(null);
    });
};
exports.findAllBooks = function (next) {
    Books.find({"is_deleted" : false}, function (err, books) {
        if (err) {
            logger.log("error from books: ", err);
            next(err, null);
        } else {
            next(null,books);
        }
    })
};
exports.findBookById = function (id, next) {
    Books.findOne({"_id": id}, function (err, book) {
        if (err) {
            next(err, null);
        } else {
            next(null,book);
        }
    });
};
exports.updateBook = function (books_details, next) {
    logger.log("books id:" + books_details.id);
    Books.findOneAndUpdate({"_id": books_details.id}, {
        title: books_details.title,
        author: books_details.author,
        description: books_details.description,
        preview: books_details.preview,
        main_book: books_details.main_book,
        cover: books_details.cover,
        price: books_details.price
    }, {upsert: true, 'new': true}, function (err, books) {
        if (err) {
            next(err, null);
        } else {
            next(null, books);
        }
    });
};
exports.deleteBook = function (id, next) {
    Books.findOneAndUpdate({"_id": id},{
        is_deleted : true
    },{upsert: true, 'new': true}, function (err, books) {
        if (err) {
            next(err, null);
        } else {
            next(books, null);
        }
    })
};
exports.countForBooks = function (next) {
    Books.count({is_deleted : false}, function (err, numberOfBooks) {
        if (err) {
            next(err, null);
        } else {
            next(null,numberOfBooks);
        }
    })
};