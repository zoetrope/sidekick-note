var koa = require('koa');
var app = koa();
var router = require("koa-router");
var logger = require("koa-logger");
var mount = require("koa-mount");
//var spank = require('koa-spankular');
//app.use(logger());

var static = require('koa-static');
app.use(mount("/", static("../ui/public")));

app.use(mount("/api", require('./items').middleware()));
app.use(mount("/api", require('./criteria').middleware()));

app.use(router(app));

app.get("/api/login", function *(next){

});

app.get("/api/logout", function *(next){

});

app.get("/api/loggedin", function *(next){
    this.body = {status: "OK"};
});

app.get("/api/tags", require("./tag"));

function *index(next) {
    console.log("index: " + this.url);
    var html  = require('fs').readFileSync(("views/index.html"), 'utf8');
    this.body = html;
    yield next;
}

app.use(index);

app.listen(3000);