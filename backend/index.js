var koa = require('koa');
var mongojs = require('mongojs');
var app = koa();
var router = require('koa-router')(app)
var Rx = require('rx');

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

app.resource("api/tasks", {
    index: function *(next) {
        var tasks = yield observableToThunk(toArrayAsObservable(db.items.find({type: "Article"})));
        this.body = tasks;
    }
});

app.use(function *() {
    this.body = 'Hello World';
});

app.listen(3000);