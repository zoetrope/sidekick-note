var koa = require('koa');
var app = koa();
var router = require("koa-router");
var logger = require("koa-logger");
var mount = require("koa-mount");

app.use(logger());

var static = require('koa-static');
app.use(static("client"));
app.use(mount("/assets", static("../public")));

app.use(require('./task').middleware());

app.use(router(app));

app.get("/api/login", function *(next){

});

app.get("/api/logout", function *(next){

});

app.get("/api/loggedin", function *(next){
    this.body = {status: "OK"};
});


app.listen(3000);