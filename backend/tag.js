
var mongojs = require('mongojs');
var db = mongojs("sidekicknote", ["items"]);
var items = db.collection("items");
var monToThunk = require("./thunkify").monToThunk;

module.exports = function *(next) {
    console.log("api/tags");
    var map = function () {
        if (!this.tags) {
            return;
        }
        for (var index in this.tags) {
            emit(this.tags[index], 1);
        }
    };
    var reduce = function (previous, current) {
        var count = 0;
        for (var index in current) {
            count += current[index];
        }
        return count;
    };

    var thunk = monToThunk(items, items.mapReduce);
    var a = yield thunk(map, reduce, { out: { inline: 1 }});
    this.body = a[0];

    //var thunk = thunkify(db.items, db.items.distinct);
    //this.body = yield thunk("tags");
};