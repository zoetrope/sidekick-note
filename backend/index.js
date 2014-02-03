var koa = require('koa');
var app = koa();
var router = require("koa-router");
var logger = require("koa-logger");
var mount = require("koa-mount");

//app.use(logger());

var static = require('koa-static');
app.use(static("client"));
app.use(mount("/assets", static("../public")));

app.use(require('./task').middleware());

app.use(router(app));


var mongojs = require('mongojs');
var db = mongojs("sidekicknote", ["items"]);
var items = db.collection("items");
//var cursorToThunk = require("./thunkify").cursorToThunk;
//var thunkify = require("thunkify");

function thunkify(self, fn){
    return function(){
        var args = [].slice.call(arguments);
        var results;
        var called;
        var cb;

        args.push(function(){
            results = arguments;

            if (cb && !called) {
                called = true;
                cb.apply(self, results);
            }
        });

        fn.apply(self, args);

        return function(fn){
            cb = fn;

            if (results && !called) {
                called = true;
                fn.apply(self, results);
            }
        }
    }
};

app.get("/api/login", function *(next){

});

app.get("/api/logout", function *(next){

});

app.get("/api/loggedin", function *(next){
    this.body = {status: "OK"};
});

app.get("/api/tags", function *(next){
    console.log("api/tags")
    //this.body = yield cursorToThunk(db.items.distinct("tags"));
    //this.body = yield cursorToThunk(db.$cmd.first({"distinct":"tags","key": "tags"}));

    var thunk = thunkify(db.items, db.items.distinct);

    this.body = yield thunk("tags");
    /*
    console.log(tags);
    this.body = tags;
     */
});


app.listen(3000);