var mongojs = require('mongojs');
var Rx = require('rx');
var parse = require('co-body');

var Resource = require('koa-resource-router');

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

var tasks = new Resource('api/tasks', {
    // GET /api/tasks
    index: function *(next) {
        //var tasks = yield db.items.find({type: "Article"}).toArray; //なぜこれがダメなのか
        var tasks = yield cursorToThunk(db.items.find({type: "Article"}));
        //var tasks = yield observableToThunk(toArrayAsObservable(db.items.find({type: "Article"})));
        this.body = tasks;
    },
    // GET /api/tasks/new
    new: function *(next) {
    },
    // POST /api/tasks
    create: function *(next) {
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