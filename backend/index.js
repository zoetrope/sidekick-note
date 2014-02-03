var koa = require('koa');
var app = koa();

var static = require('koa-static');
app.use(static("client"));

app.use(require('./task').middleware());

app.listen(3000);