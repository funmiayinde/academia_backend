/**
 * Created by funmi on 3/21/17.
 */
var express = require('express');
var router = express.Router();
var bookService = require("../services/BookService");
var multiparty = require('multiparty');
var fs = require('fs');
var restrict = require('../auth/restrict');
// var request = require('request');
var config = require('../config');
var logger = require('../auth/logger');
var dropBox = require("dropbox");
var dbox = require("dbox");
var prompt = require("prompt");
var ip = require('ip');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
var id;


// get method of all books
router.get('/', function (req, res, next) {

    res.redirect('/books/all_books');
});

function getIp(){
    ip = require('ip');
    console.log(ip.address());
    if (ip !== ""){
        return ip;
    }
    return "";
}
// get method to create books
router.get('/create', restrict, function (req, res, next) {
    uploadFile("", "", "");
    var vm = {
        title: 'Add new book',
        activePage: 'Add new book'
    };
    res.render('books/create', vm);
});

// post method to create books
router.post('/create', restrict, function (req, res, next) {
    // var ip = getIp();
    // console.log("this is the IP: " + ip);

    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var d = new Date(), Hours = d.getHours(), Minutes = d.getMinutes(), Seconds = d.getSeconds(),
            strug = Hours + '_' + Minutes + '_' + Seconds;

        var title = fields.title[0];
        var author = fields.author[0];
        var description = fields.description[0];
        var preview = files.preview[0];
        var main_book = files.main_book[0];
        var cover = files.cover[0];
        var price = fields.price[0];

        var paths = [
            preview,
            main_book,
            cover
        ];
        // var ipString = ""+ip+"";
        // console.log("ipString :" + ipString);
        // var path_append = "http://192.168.1.227:4000/";
        var path_append = "http://"+ip.address()+":4000/";
        fs.readFile(cover.path, function (err, data) {
            var path_cover = './public/covers/' + strug + '_' + cover.originalFilename;
            fs.writeFile(path_cover, data, function (cover_error) {
                // logger.log("Path: ", JSON.stringify(path));
                // uploadFile(path_cover, data, data.length);
                uploadFile2();
                if (cover_error) {
                    var vm = {
                        title: "Add new book",
                        activePage: "Add new book",
                        input: req.body,
                        error: cover_error
                    };
                    console.log(cover_error);
                    res.render('books/create', vm);
                } else {
                    fs.readFile(preview.path, function (err, data) {
                        var path_preview = './public/previews/' + strug + '_' + preview.originalFilename;
                        fs.writeFile(path_preview, data, function (preview_error) {
                            // logger.log("Path: ", JSON.stringify(path));
                            // uploadFile("preview", data, data.length);
                            if (preview_error) {
                                var vm = {
                                    title: "Add new book",
                                    activePage: "Add new book",
                                    input: req.body,
                                    error: preview_error
                                };
                                console.log(preview_error);
                                res.render('books/create', vm);
                            } else {
                                fs.readFile(main_book.path, function (err, data) {
                                    var path_main = './public/main/' + strug + '_' + main_book.originalFilename;
                                    fs.writeFile(path_main, data, function (main_error) {
                                        // logger.log("Path: ", JSON.stringify(path));
                                        // uploadFile("preview", data, data.length);
                                        if (main_error) {
                                            var vm = {
                                                title: "Add new book",
                                                activePage: "Add new book",
                                                input: req.body,
                                                error: main_error
                                            };
                                            console.log(main_error);
                                            res.render('books/create', vm);
                                        } else {
                                            var preview_path = path_preview.slice(9);
                                            var cover_path = path_cover.slice(9);
                                            var main_path = path_main.slice(9);
                                            var body_req = {
                                                title: title,
                                                author: author,
                                                description: description,
                                                preview: preview_path,
                                                preview_path: path_append + preview_path,
                                                main_book: main_path,
                                                main_book_path: path_append + main_path,
                                                cover: cover_path,
                                                cover_path: path_append + cover_path,
                                                is_deleted: false,
                                                price: price
                                            };
                                            console.log("books service : " + JSON.stringify(body_req));
                                            bookService.createBooks(body_req, function (service_err) {
                                                if (err) {
                                                    var vm = {
                                                        title: "Add new book",
                                                        activePage: "Add new book",
                                                        input: req.body,
                                                        error: service_err
                                                    };
                                                    res.render("books/create", vm);
                                                }
                                                vm = {
                                                    title: "Add new book",
                                                    activePage: "Add new book",
                                                    input: req.body,
                                                    success: 'Book successfully added'
                                                };
                                                res.render("books/create", vm);
                                            })
                                        }
                                    })
                                });
                            }
                        })
                    });
                }
            })
        });
        // }
    });
});

// get method to view all books
router.get('/all_books', restrict, function (req, res, next) {
    var vm = {
        title: 'View all books',
        activePage: 'All books uploaded'
    };

    bookService.findAllBooks(function (err, books) {
        logger.log("books from route :", books);
        vm = {
            title: 'View all books',
            activePage: 'All books uploaded',
            book_details: books
        };
        res.render('books/all_books', vm);
    });
});

router.get('/view_books', restrict, function (req, res, next) {
    var vm = {
        title: 'View all books',
        activePage: 'All books uploaded'
    };
    res.render('books/view_books', vm);

});
router.get('/view_books/:Id', function (req, res, next) {
    id = req.param("Id");
    var vm = {};
    console.log("id:" + id);
    bookService.findBookById(id, function (err, book) {
        if (err) {
            logger.log("find books err: ", err);
            vm = {
                title: 'View all books',
                activePage: 'All books uploaded',
                error: err
            };
            res.redirect("/books/all_books", vm);
        } else {
            logger.log("view books route: ", book.cover);
            vm = {
                title: 'View all books',
                activePage: 'All books uploaded',
                book_title: book.title,
                book_author: book.author,
                book_description: book.description,
                book_preview: book.preview,
                book_main_book: book.main_book,
                book_cover: book.cover,
                book_price: book.price
            };
            res.render('books/view_books', vm);
        }
    });
});

router.delete('/delete', restrict, function (req, res, next) {
    var vm = {
        title: 'View all books',
        activePage: 'All books uploaded'
    };
    res.render('books/view_books', vm);

});
router.get('/delete/:Id', function (req, res, next) {
    var vm = {};
    id = req.param("Id");
    bookService.deleteBook(id, function (book, err) {
        if (err) {
            logger.log("find books err: ", err);
            vm = {
                title: 'View all books',
                activePage: 'All books uploaded',
                error: err
            };
            res.redirect("/books/all_books", vm);
        } else {
            logger.log("delete books route: ", book.cover);
            vm = {
                title: 'View all books',
                activePage: 'All books uploaded',
                success: 'book successfully deleted'
            };
            res.redirect('/books/all_books');
        }
    });

});

router.get('/edit_books', restrict, function (req, res, next) {
    var vm = {
        title: 'Edit books',
        activePage: 'Edit books uploaded'
    };
    res.render('books/edit_books', vm);

});

router.get('/edit_books/:Id', restrict, function (req, res, next) {
    id = req.param("Id");
    var vm = {};
    console.log("edit id:" + id);
    bookService.findBookById(id, function (err, book) {
        if (err) {
            logger.log("find books err: ", err);
            vm = {
                title: 'View all books',
                activePage: 'All books uploaded',
                error: err
            };
            res.redirect("/books/edit_books", vm);
        } else {
            logger.log("view books route: ", book);
            vm = {
                title: 'Edit book',
                activePage: 'Edit book uploaded',
                book_id: book._id,
                book_title: book.title,
                book_author: book.author,
                book_description: book.description,
                book_preview: book.preview,
                book_main_book: book.main_book,
                book_cover: book.cover,
                book_price: book.price
            };
            res.render('books/edit_books', vm);
        }
    });
});

router.post('/edit_books', restrict, function (req, res, next) {
    var vm = {};
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var d = new Date(), Hours = d.getHours(), Minutes = d.getMinutes(), Seconds = d.getSeconds(),
            strug = Hours + '_' + Minutes + '_' + Seconds;

        // logger.log("fields :",fields);
        var id = fields.id[0];
        var title = fields.title[0];
        var author = fields.author[0];
        var description = fields.description[0];
        var preview = files.preview[0];
        var main_book = files.main_book[0];
        var cover = files.cover[0];
        var price = fields.price[0];

        var path_append = "http://"+ip.address()+":4000/";
        fs.readFile(cover.path, function (err, data) {
            var path_cover = './public/covers/' + strug + '_' + cover.originalFilename;
            fs.writeFile(path_cover, data, function (cover_error) {
                // logger.log("Path: ", JSON.stringify(path));
                // uploadFile(path_cover, data, data.length);
                if (cover_error) {
                    var vm = {
                        title: "Edit book",
                        activePage: "Edit book",
                        error: cover_error
                    };
                    console.log(cover_error);
                    res.render('books/edit_books', vm);
                } else {
                    fs.readFile(preview.path, function (err, data) {
                        var path_preview = './public/previews/' + strug + '_' + preview.originalFilename;
                        fs.writeFile(path_preview, data, function (preview_error) {
                            // logger.log("Path: ", JSON.stringify(path));
                            // uploadFile("preview", data, data.length);
                            if (preview_error) {
                                var vm = {
                                    title: "Edit  book",
                                    activePage: "Edit book",
                                    error: preview_error
                                };
                                console.log(preview_error);
                                res.render('books/edit_books', vm);
                            } else {
                                fs.readFile(main_book.path, function (err, data) {
                                    var path_main = './public/main/' + strug + '_' + main_book.originalFilename;
                                    fs.writeFile(path_main, data, function (main_error) {
                                        // uploadFile("preview", data, data.length);
                                        if (main_error) {
                                            var vm = {
                                                title: "Edit book",
                                                activePage: "Edit book",
                                                error: main_error
                                            };
                                            console.log(main_error);
                                            res.render('books/edit_books', vm);
                                        } else {
                                            var preview_path = path_preview.slice(9);
                                            var cover_path = path_cover.slice(9);
                                            var main_path = path_main.slice(9);
                                            var body_req = {
                                                id: id,
                                                title: title,
                                                author: author,
                                                description: description,
                                                preview: preview_path,
                                                preview_path: path_append + preview_path,
                                                main_book: main_path,
                                                main_book_path: path_append + main_path,
                                                cover: cover_path,
                                                cover_path: path_append + cover_path,
                                                is_deleted: false,
                                                price: price
                                            };
                                            console.log("books service : " + JSON.stringify(body_req));
                                            bookService.updateBook(body_req, function (service_err) {
                                                if (err) {
                                                    var vm = {
                                                        title: "Edit  book",
                                                        activePage: "Edit book",
                                                        error: service_err
                                                    };
                                                    res.render("books/edit_books", vm);
                                                }
                                                vm = {
                                                    title: "Edit  book",
                                                    activePage: "Edit book",
                                                    success: 'Book successfully updated'
                                                };
                                                res.render("books/all_books", vm);
                                            })
                                        }
                                    })
                                });
                            }
                        })
                    });
                }
            })
        });
    });
});

router.get('/api/all_books', function (req, res, next) {
    var vm = {};
    bookService.findAllBooks(function (err, books) {
        if (err) {
            logger.log("err in api findAllBooks: ", err);
            vm = {
                status: false,
                message: err,
                code: 101500
            };
            return res.json(vm);
        } else {
            logger.log('article in api findAllBooks :', books);

            vm = {
                status: true,
                data: books,
                code: 101200
            };
            return res.json(vm);
        }
    });
});
router.get('/api/view_book/:Id', function (req, res, next) {
    var vm = {};
    bookService.findBookById(req.param("Id"), function (err, book) {
        if (err) {
            logger.log("err in find by id book : ", err);
            vm = {
                status: false,
                message: err,
                code: 101500
            };
            return res.json(vm);
        } else {
            logger.log('article in find by id book :', book);
            vm = {
                status: true,
                data: book,
                code: 101200
            };
            return res.json(vm);
        }
    })
});


// function to upload file to drop box
function uploadFile(serverpath, content, content_length) {

    var app = dbox.app({"app_key": config.DROPBOX_KEY, "app_secret": config.DROPBOX_APP_SERCRET});
    app.requesttoken(function (status, request_token) {
        // localStorage.setItem("oauth_token",request_token.oauth_token);
        console.log("request token :" + JSON.stringify(request_token));
        console.log(request_token.oauth_token);

        var client = app.accesstoken(request_token, function (status, access_token) {
            console.log("access token : " + JSON.stringify(access_token));
        })

    })
}

function uploadFile2() {
    prompt.start();
    prompt.get({
            properties: {
                accessToken: {
                    description: config.dropbox_token
                }
            }
        }, function (err, result) {
            console.log("res: " + JSON.stringify(result));
            if (err) {
                console.log("err: " + JSON.stringify(err));
            }
        }
    )
}
function getCallerIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}
module.exports = router;