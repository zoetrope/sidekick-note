///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='../services/ItemRenderService.ts' />
///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface ItemParam extends ng.route.IRouteParamsService {
        id: number;
    }

    export interface ItemScope extends ng.IScope {
        item: any;
    }

    export class ItemController {
        constructor(private $scope:ItemScope, $routeParams:ItemParam, private apiService:services.ApiService) {

            console.log("id = " + $routeParams.id);

            apiService.Item.get({id: $routeParams.id},
                (data)=> {

                    $scope.item = data;
                },
                (err)=> {

                })
        }

    }
}

angular.module('sidekick-note.controller')
    .controller("ItemController", ["$scope", '$routeParams', "apiService",
        ($scope:controllers.ItemScope, $routeParams:controllers.ItemParam, apiService:services.ApiService):controllers.ItemController => {
            return new controllers.ItemController($scope, $routeParams, apiService)
        }]);