var parse = require('co-body');
var Resource = require('koa-resource-router');
var criteria = require("./repository").criteria;
var monToThunk = require("./thunkify").monToThunk;

var criteriaResource = new Resource('api/criteria', {
    // GET /api/criteria
    index: function *(next) {
        console.log(this.query);

        var thunk = monToThunk(criteria, criteria.find);
        this.body = yield thunk({});

    },
    // GET /api/criteria/new
    new: function *(next) {
    },
    // POST /api/criteria
    create: function *(next) {
        var param = yield parse(this);
        console.log(param);
        this.body = param;
    },
    // GET /api/criteria/:id
    show: function *(next) {
    },
    // GET /api/criteria/:id/edit
    edit: function *(next) {
    },
    // PUT /api/criteria/:id
    update: function *(next) {
    },
    // DELETE /api/criteria/:id
    destroy: function *(next) {
    }
});

module.exports = criteriaResource;