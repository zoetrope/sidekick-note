var koa = require('koa');
var mongojs = require('mongojs');
var Rx = require('rx');
var parse = require('co-body');

var app = koa();

var static = require('koa-static');
app.use(static("client"));

var router = require('koa-router')(app)
app.use(router);

var db = mongojs("sidekicknote", ["items"]);
var items = db.collection("items");

function toArrayAsObservable(cursor) {
    return Rx.Observable.create(function(observer){
        cursor.toArray(function(err,doc){
            if(err){
                observer.onError(err);
            } else {
                observer.onNext(doc);
            }
        });
    })
}

function observableToThunk(observable) {
    return function(fn){
        var d = observable.subscribe(function(res) {
                d.dispose();
                fn(null, res);
            },
            function(err) {
                d.dispose();
                fn(err);
            });
    }
}

function cursorToThunk(cursor) {
    return function(cb){
        cursor.toArray(cb);
    }
}

app.resource("api/tasks", {
    index: function *(next) {
        //var tasks = yield db.items.find({type: "Article"}).toArray; //なぜこれがダメなのか
        var tasks = yield cursorToThunk(db.items.find({type: "Article"}));
        //var tasks = yield observableToThunk(toArrayAsObservable(db.items.find({type: "Article"})));
        this.body = tasks;
    }
});

app.listen(3000);