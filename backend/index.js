var koa = require('koa');
var app = koa();
var router = require("koa-router");
var logger = require("koa-logger");
var mount = require("koa-mount");

//app.use(logger());

var static = require('koa-static');
app.use(static("client"));
app.use(mount("/assets", static("../public")));

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


app.use(function *(next){
    yield next;

    // サーバサイドが知らないURLでアクセスされたら、URLをパラメータで渡してクライアントサイドで解決させる
    // TODO: 何でもリダイレクトするのではなく、ある程度はフィルタリングが必要。
    console.log("redirect to " + encodeURIComponent(this.url));
    this.redirect('/index.html?url=' + encodeURIComponent(this.url));
});


app.listen(3000);