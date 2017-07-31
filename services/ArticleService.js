/**
 * Created by funmi on 3/21/17.
 */
var Article = require("../models/ArticleModel").Articles;
var logger = require("../auth/logger");
exports.createArticle = function (article_info,next) {
    // console.log("createArticle  : ",JSON.stringify(article_info));
    console.log(article_info);
    var newArticle = new Article({
        title: article_info.title,
        article: article_info.article
    });
    newArticle.save(function (err) {
        if (err){
            return next(err);
        }
        next(null);
    });
};
exports.findAllArticles = function (next) {
    Article.find({},function (err,articles) {
        if(err){
            return next(err,null);
        } else{
            next(null,articles);
        }
    })
};
exports.findArticleById = function (Id,next) {
    Article.findOne({"_id":Id},function (err,articles) {
        if(err){
            return next(err,null);
        } else{
            console.log("findArticleById res : ",JSON.stringify(articles));
            next(null,articles);
        }
    })
};
exports.updateArticle = function (article_info, next) {
    logger.log("article id:" + article_info.id);
    Article.findOneAndUpdate({"_id": article_info.id}, {
        title: article_info.title,
        article: article_info.article
    }, {upsert: true, 'new': true}, function (err, article) {
        if (err) {
            next(err, null);
        } else {
            next(null, article);
        }
    });
};
exports.countAllArticles = function (next) {
    Article.count({},function (err,count) {
       if (err){
           return next(err,null);
       }else{
           next(null,count);
       }
    });
};