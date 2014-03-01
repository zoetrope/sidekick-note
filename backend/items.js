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
        //TODO: エラー処理
        var item = yield parse(this);
        item.createdAt = new Date().toISOString();
        item.modifiedAt = new Date().toISOString();
        var thunk = monToThunk(itemsRepo, itemsRepo.insert);
        var newItem = yield thunk(item);
        this.body = newItem[0];
    },
    // GET /api/items/:id
    show: function *(next) {
        var thunk = monToThunk(itemsRepo, itemsRepo.findOne);
        var item = yield thunk({_id: ObjectId(this.params.item)});
        this.body = item;
    },
    // PUT /api/items/:id
    update: function *(next) {
        //TODO: エラー処理
        var item = yield parse(this);
        //console.log(this.params.item);
        item.modifiedAt = new Date().toISOString();
        var thunk = monToThunk(itemsRepo, itemsRepo.update);
        var newItem = yield thunk({_id : ObjectId(this.params.item)}, {"$set": item});
        this.body = newItem[0];
    },
    // DELETE /api/items/:id
    destroy: function *(next) {
    }
});

module.exports = itemsResource;