///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Task.ts' />
///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface TaskScope extends ng.IScope {
    }

    export class TaskController {

        constructor(public $scope:TaskScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {

        }

    }
}