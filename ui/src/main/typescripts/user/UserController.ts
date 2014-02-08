///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

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
