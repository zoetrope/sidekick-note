var mongojs = require('mongojs');
var Rx = require('rx');
var parse = require('co-body');

var Resource = require('koa-resource-router');

var db = mongojs("sidekicknote", ["items"]);
var items = db.collection("items");
var monToThunk = require("./thunkify").monToThunk;

var articles = new Resource('api/articles', {
    // GET /api/articles
    index: function *(next) {
        var find = monToThunk(items, items.find);
        var articles = yield find({type: "Article"});

        this.body = articles;
    },
    // GET /api/articles/new
    new: function *(next) {

    },
    // POST /api/articles
    create: function *(next) {
        var param = yield parse(this);
        console.log(param);
        this.body = param;
    },
    // GET /api/articles/:id
    show: function *(next) {
    },
    // GET /api/articles/:id/edit
    edit: function *(next) {
    },
    // PUT /api/articles/:id
    update: function *(next) {
    },
    // DELETE /api/articles/:id
    destroy: function *(next) {
    }
});

module.exports = articles;