///<reference path='../libs/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../libs/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface UserScope extends ng.IScope {
        name: string;
        password: string;

    }

    declare var jsRouter:any
    export class UserController {

        constructor(public $scope:UserScope, public $resource:ng.resource.IResourceService) {

        }

    }
}