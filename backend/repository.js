var mongojs = require('mongojs');
var db = mongojs("sidekicknote", ["items", "criteria"]);

var items = db.collection("items");
var criteria = db.collection("criteria");

exports.items = items;
exports.criteria = criteria;
