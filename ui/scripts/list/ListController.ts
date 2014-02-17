///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='../services/ApiService.ts' />
///<reference path='../application/UserSetting.ts' />
///<reference path='../common/Item.ts' />


module controllers {
    'use strict';

    export interface ListParam extends ng.route.IRouteParamsService {
        id: number;
    }

    export interface ListScope extends ng.IScope {
        item: models.Item;

        setting: models.UserSetting;
        addItem: Function;

        updateItem: Function;
        types: string[];
        statuses: {key?: string[]};
    }

    export class ListController {
        constructor(private $scope:ListScope, $routeParams:ListParam, private $location:ng.ILocationService, private apiService:services.ApiService) {


        }


    }
}

angular.module('sidekick-note.controller')
    .controller("ListController", ["$scope", '$routeParams', "$location", "apiService",
        ($scope:controllers.ListScope, $routeParams:controllers.ListParam, $location:ng.ILocationService, apiService:services.ApiService):controllers.ListController => {
            return new controllers.ListController($scope, $routeParams, $location, apiService)
        }]);