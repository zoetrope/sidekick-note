///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='./ApiService.ts' />
///<reference path='./UserSetting.ts' />

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

        setting: models.UserSetting;
        addItem: Function;

        updateItem: Function;
        types: string[];
        statuses: {key?: string[]};
    }

    export class ItemController {
        constructor(private $scope:ItemScope, $routeParams:ItemParam, private $location:ng.ILocationService, private apiService:services.ApiService) {

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
                $scope.setting.showMode = "edit";
                console.log("new item");
            }

            $scope.types = ["Task", "Article", "QuickNote"];

            $scope.statuses = {
                "Task": ["New", "Accepted", "Completed"],
                "Article": ["Writing", "Viewing", "Archived"],
                "QuickNote": ["Flowing", "Archived"]
            };

            $scope.addItem = angular.bind(this, this.addItem);
            $scope.updateItem = angular.bind(this, this.updateItem);

        }

        addItem(item){
            this.apiService.Items.save(null, item, data=>{
                console.log(data);
                this.$location.path("/items/" + data._id);
            });

        }

        updateItem(item) {
            //TODO: エラー処理
            this.apiService.Item.update({id: item._id}, item, data=>{
                this.$scope.item = data;
                this.$scope.setting.showMode = "view";
            });
        }

        deleteItem() {

        }

    }
}

angular.module('sidekick-note.controller')
    .controller("ItemController", ["$scope", '$routeParams', "$location", "apiService",
        ($scope:controllers.ItemScope, $routeParams:controllers.ItemParam, $location:ng.ILocationService, apiService:services.ApiService):controllers.ItemController => {
            return new controllers.ItemController($scope, $routeParams, $location, apiService)
        }]);