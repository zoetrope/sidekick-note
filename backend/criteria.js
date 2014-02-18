var parse = require('co-body');
var Resource = require('koa-resource-router');
var criteriaRepo = require("./repository").criteria;
var monToThunk = require("./thunkify").monToThunk;
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

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
        var newCriterion = yield thunk(criterion);
        this.body = newCriterion[0];
    },
    // GET /api/criteria/:id
    show: function *(next) {
        console.log(this.params);
        var thunk = monToThunk(criteriaRepo, criteriaRepo.findOne);
        var criterion = yield thunk({_id: ObjectId(this.params.criterium)});
        this.body = criterion;
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