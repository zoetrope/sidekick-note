
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

exports.cursorToThunk = cursorToThunk;