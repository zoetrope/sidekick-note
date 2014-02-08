var parse = require('co-body');
var Resource = require('koa-resource-router');
var itemsRepo = require("./repository").items;
var monToThunk = require("./thunkify").monToThunk;
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var itemsResource = new Resource('items', {
    // GET /api/items
    index: function *(next) {
        var thunk = monToThunk(itemsRepo, itemsRepo.find);
        var items = yield thunk(this.query);
        this.body = items;
    },
    // POST /api/items
    create: function *(next) {
    },
    // GET /api/items/:id
    show: function *(next) {
        var thunk = monToThunk(itemsRepo, itemsRepo.findOne);
        var item = yield thunk({_id: ObjectId(this.params.item)});
        this.body = item;
    },
    // PUT /api/items/:id
    update: function *(next) {
    },
    // DELETE /api/items/:id
    destroy: function *(next) {
    }
});

module.exports = itemsResource;