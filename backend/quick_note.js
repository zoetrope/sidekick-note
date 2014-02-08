var mongojs = require('mongojs');
var Rx = require('rx');
var parse = require('co-body');

var Resource = require('koa-resource-router');

var db = mongojs("sidekicknote", ["items"]);
var items = db.collection("items");
var monToThunk = require("./thunkify").monToThunk;

var quickNotes = new Resource('api/quick_notes', {
    // GET /api/quick_notes
    index: function *(next) {
        var find = monToThunk(items, items.find);
        var notes = yield find({type: "QuickNote"});

        this.body = notes;
    },
    // GET /api/quick_notes/new
    new: function *(next) {

    },
    // POST /api/quick_notes
    create: function *(next) {
        var param = yield parse(this);
        console.log(param);
        this.body = param;
    },
    // GET /api/quick_notes/:id
    show: function *(next) {
    },
    // GET /api/quick_notes/:id/edit
    edit: function *(next) {
    },
    // PUT /api/quick_notes/:id
    update: function *(next) {
    },
    // DELETE /api/quick_notes/:id
    destroy: function *(next) {
    }
});

module.exports = quickNotes;