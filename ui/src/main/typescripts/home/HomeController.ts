///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface HomeScope extends ng.IScope {

    }

    export class HomeController {

        constructor(public $scope:HomeScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {

        }

    }
}

angular.module('sidekick-note.controller')
    .controller("HomeController", ["$scope", "$resource", "itemRenderService",
        ($scope:controllers.HomeScope, $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) : controllers.HomeController => {
            return new controllers.HomeController($scope, $resource, itemRenderService)
        }]);