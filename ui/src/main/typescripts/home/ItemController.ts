///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface ItemParam extends ng.route.IRouteParamsService {
        id: number;
    }

    export interface ItemScope extends ng.IScope {
        item: any;

        showMode: string;
        updateItem: Function;
    }

    export class ItemController {
        constructor(private $scope:ItemScope, $routeParams:ItemParam, private apiService:services.ApiService) {

            if ($routeParams.id) {
                $scope.item = apiService.Item.get({id: $routeParams.id});
            } else {
                console.log("new item");
            }

            $scope.updateItem = angular.bind(this, this.updateItem);
        }

        updateItem(item) {
            //TODO: エラー処理
            this.apiService.Item.update({id: item._id}, item);
        }

        deleteItem() {

        }

    }
}

angular.module('sidekick-note.controller')
    .controller("ItemController", ["$scope", '$routeParams', "apiService",
        ($scope:controllers.ItemScope, $routeParams:controllers.ItemParam, apiService:services.ApiService):controllers.ItemController => {
            return new controllers.ItemController($scope, $routeParams, apiService)
        }]);