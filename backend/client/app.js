'use strict';

var app = angular.module('app', ['ngResource']);

app.controller("MainController", ["$scope","$resource",
    function ($scope, $resource) {
        $resource("/api/tasks").query(function(data){
            $scope.tasks = data;
        });

    }]);