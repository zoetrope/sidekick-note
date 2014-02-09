var parse = require('co-body');
var Resource = require('koa-resource-router');
var criteriaRepo = require("./repository").criteria;
var monToThunk = require("./thunkify").monToThunk;

var criteriaResource = new Resource('criteria', {
    // GET /api/criteria
    index: function *(next) {
        var thunk = monToThunk(criteriaRepo, criteriaRepo.find);
        var criteria = yield thunk({});
        this.body = criteria;
    },
    // GET /api/criteria/new
    new: function *(next) {
    },
    // POST /api/criteria
    create: function *(next) {
        var criterion = yield parse(this);
        var thunk = monToThunk(criteriaRepo, criteriaRepo.insert);
        yield thunk(criterion);
        this.status = 200;
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