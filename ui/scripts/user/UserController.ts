///<reference path='../../typings/tsd.d.ts' />

module controllers {
    'use strict';

    export interface UserScope extends ng.IScope {
        name: string;
        password: string;

    }

    export class UserController {

        constructor(public $scope:UserScope, public $resource:ng.resource.IResourceService) {

        }

    }
}


angular.module('sidekick-note.controller')
    .controller("UserController", ["$scope", "$resource",
        ($scope:controllers.UserScope, $resource:ng.resource.IResourceService) : controllers.UserController => {
            return new controllers.UserController($scope, $resource)
        }]);
