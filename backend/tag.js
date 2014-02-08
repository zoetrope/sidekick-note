var items = require("./repository").items;

var monToThunk = require("./thunkify").monToThunk;
var Enumerable = require("./lib/linqjs/linq");

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
    this.body = Enumerable.from(a[0])
        .select(function(item){return {name: item._id, refCount: item.value}})
        .orderByDescending(function(item){return  item.refCount;})
        .toArray();

    //var thunk = thunkify(db.items, db.items.distinct);
    //this.body = yield thunk("tags");
};