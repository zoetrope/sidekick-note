
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

function monToThunk(self, fn){
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

exports.cursorToThunk = cursorToThunk;
exports.monToThunk = monToThunk;