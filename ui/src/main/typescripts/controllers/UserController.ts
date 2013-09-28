///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/QuickNote.ts' />

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