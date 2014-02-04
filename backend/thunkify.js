
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
}

exports.monToThunk = monToThunk;