///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface ItemParam extends ng.route.IRouteParamsService {
        id: number;
    }

    export class MyItem {
        _id: string;
        title: string;
        content: string;
        type: string;
        status: string;
        rate: number;
        tags: string[];
        createdAt: Date;
        modifiedAt: Date;
        dueDate: Date;
    }

    export interface ItemScope extends ng.IScope {
        item: MyItem;

        updateItem: Function;
        types: string[];
        statuses: {key?: string[]};
    }

    export class ItemController {
        constructor(private $scope:ItemScope, $routeParams:ItemParam, private apiService:services.ApiService) {

            $scope.item = new controllers.MyItem();
            if ($routeParams.id) {
                apiService.Item.get({id: $routeParams.id}, item=>{
                    angular.copy(item, this.$scope.item);
                    console.log(this.$scope.item);
                    if(this.$scope.item.dueDate){
                        this.$scope.item.dueDate = new Date(item.dueDate);
                    }
                });
            } else {
                console.log("new item");
            }

            $scope.updateItem = angular.bind(this, this.updateItem);


            $scope.types = ["Task", "Article", "QuickNote"];

            $scope.statuses = {
                "Task": ["New", "Accepted", "Completed"],
                "Article": ["Writing", "Viewing", "Archived"],
                "QuickNote": ["Flowing", "Archived"]
            };
        }

        updateItem(item) {
            //TODO: エラー処理
            this.apiService.Item.update({id: item._id}, item, data=>{
                this.$scope.item = data;
            });
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