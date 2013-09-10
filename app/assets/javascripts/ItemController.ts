///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='ItemService.ts' />
///<reference path='Item.ts' />

module SidekickNote {
    'use strict';

    declare var jsRouter :any

    export interface ItemControllerScope extends ng.IScope {
        items: Model.Item[];
        //items: IPromise<Model.Item[]>;
        content: string;
        newItem() : void;
    }

    export class ItemController {

        constructor(public $scope:ItemControllerScope, public $http: ng.IHttpService) {

            $scope.newItem = () => {
                $http.post(
                    jsRouter.controllers.Application.items().url,
                    {content: this.$scope.content}
                ).success(function(data) {
                    $scope.items.push(data)
                }).error(function() {
                    alert("error:newItem");
                });
            };

            $http.get(
                jsRouter.controllers.Application.items().url
            ).success(function(data) {
                $scope.items = data
            }).error(function() {
                alert("error:getItems");
            });


        }

    }
}