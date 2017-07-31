/**
 * Created by funmi on 3/22/17.
 */
var express = require('express');
var router = express.Router();
var articleService = require('../services/ArticleService');
var logger = require('../auth/logger');
var restrict = require('../auth/restrict');


// get method of articles
router.get('/',restrict, function (req, res, next) {
    res.redirect("/articles/all_articles")
});

router.get('/all_articles', function (req, res, next) {
    var vm = {};
    articleService.findAllArticles(function (err, article) {
        if (err) {
            logger.log("err in find all article : ", err);
            vm = {
                title: "Article",
                activePage: "All Article",
                error: err
            };
            return res.render("articles/all_articles",vm);
        }else{
            logger.log('article in find all article :',article);
            vm = {
                title: "Article",
                activePage: "All Article",
                all_article: article
            };
            res.render("articles/all_articles",vm);
        }
    })
});

// get method to create articles
router.get('/create', function (req, res, next) {
    var vm = {
        title: 'Add new article',
        activePage: 'Add new article'
    };
    res.render('articles/create', vm);
});

// post method to create new article
router.post('/create',restrict, function (req, res, next) {
    console.log(JSON.stringify(req.body));
    var vm = {};
    articleService.createArticle(req.body, function (err) {
        if (err) {
            vm = {
                title: "Add new article",
                activePage: 'Add new article',
                error: err
            };
            res.render('articles/create', vm);
            return;
        }
        vm = {
            title: "Add new article",
            activePage: 'Add new article',
            success: 'article published'
        };
        return res.render('articles/create', vm);
    })
});

// router.get('/delete/:Id', function (req, res, next) {
//     var vm = {};
//     var id = req.param("Id");
//     articleService.deleteUser(id, function (book, err) {
//         if (err) {
//             logger.log("find books err: ", err);
//             vm = {
//                 error: err
//             };
//             res.redirect("/user/all_users", vm);
//         } else {
//             logger.log("delete books route: ", book.cover);
//             vm = {
//                 success: 'book successfully deleted'
//             };
//             res.redirect('/user/all_users');
//         }
//     });
//
// });

router.get('/edit_article',restrict, function (req, res, next) {
    var vm = {
        title: 'Edit Article',
        activePage: 'Edit Article'
    };
    res.render('articles/edit_article', vm);

});
router.get('/edit_article/:Id',restrict, function (req, res, next) {
    var id = req.param("Id");
    var vm = {};
    console.log("id:" + id);
    articleService.findArticleById(id, function (err, article) {
        if (err) {
            logger.log("find books err: ", err);
            vm = {
                title: 'Article',
                activePage: 'View all article',
                error: err
            };
            res.render("articles/edit_article", vm);
        } else {
            logger.log("view books route: ", article);
            vm = {
                title: 'Edit article',
                activePage: 'Edit article',
                article_id: article._id,
                article_title: article.title,
                article: article.article
            };
            res.render('articles/edit_article', vm);
        }
    });
});

router.post('/edit_article', restrict,function (req, res, next) {
    var id = req.param("Id");
    var vm = {};
    console.log("id:" + id);
    articleService.findArticleById(id, function (book, err) {
        if (err) {
            logger.log("find books err: ", err);
            vm = {
                title: 'View all books',
                activePage: 'All books uploaded',
                error: err
            };
            res.redirect("articles/edit_article", vm);
        } else {
            articleService.updateArticle(req.body, function (err,article) {
                if (err) {
                    var vm = {
                        title: "Edit new book",
                        activePage: "Edit new book",
                        error: err
                    };
                    res.render("books/edit_books", vm);
                }
                vm = {
                    title: "Article",
                    activePage: "Edit Article",
                    success: 'Successfully updated'
                };
                res.render("articles/edit_article", vm);
            });
        }
    });
});


// get method api to get all articles
router.get('/api/all_articles', function (req, res, next) {
    var vm = {};
    articleService.findAllArticles(function (err, article) {
        if (err) {
            logger.log("err in find all article : ", err);
            vm = {
                status: false,
                message: err,
                code: 101500
            };
            return res.json(vm);
        }else{
            logger.log('article in find all article :',article);
            vm = {
                status: true,
                data: article
            };
            return res.json(vm);
        }
    })
});
// get method api to get one article
router.get('/api/view_article/:Id', function (req, res, next) {
    var vm = {};
    articleService.findArticleById(req.param("Id"),function (err, article) {
        if (err) {
            logger.log("err in find by id article : ", err);
            vm = {
                status: false,
                message: err,
                code: 101500
            };
            return res.json(vm);
        }else{
            logger.log('article in find by id article :',article);
            vm = {
                status: true,
                data:article
            };
            return res.json(vm);
        }
    })
});

module.exports = router;