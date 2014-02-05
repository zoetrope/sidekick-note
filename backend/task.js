var mongojs = require('mongojs');
var Rx = require('rx');
var parse = require('co-body');

var Resource = require('koa-resource-router');

var db = mongojs("sidekicknote", ["items"]);
var items = db.collection("items");
var monToThunk = require("./thunkify").monToThunk;

var tasks = new Resource('api/tasks', {
    // GET /api/tasks
    index: function *(next) {
        var find = monToThunk(items, items.find);
        var tasks = yield find({type: "Task"});

        this.body = tasks;
    },
    // GET /api/tasks/new
    new: function *(next) {

    },
    // POST /api/tasks
    create: function *(next) {
        var param = yield parse(this);
        console.log(param);
        this.body = param;
    },
    // GET /api/tasks/:id
    show: function *(next) {
    },
    // GET /api/tasks/:id/edit
    edit: function *(next) {
    },
    // PUT /api/tasks/:id
    update: function *(next) {
    },
    // DELETE /api/tasks/:id
    destroy: function *(next) {
    }
});

module.exports = tasks;