var mongojs = require('mongojs');
// 環境変数からMongoDBへの接続文字列を取得。なければlocalhostに接続。
var mongo_uri = process.env.MONGO_URI || "localhost/sidekicknote";
console.log("connect to " + mongo_uri);
var db = mongojs.connect(mongo_uri);

var items = db.collection("items");
var criteria = db.collection("criteria");
var accounts = db.collection("accounts");

exports.items = items;
exports.criteria = criteria;
exports.accounts = accounts;
