///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../services/ItemService.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface Scope extends ng.IScope {
        items: models.Item[];
        //items: ng.IPromise<Model.Item[]>;
        content: string;
        newItem() : void;
    }

    export class ItemController {

        constructor(public $scope:Scope, public itemService: services.ItemService) {

            $scope.newItem = () => {
                this.itemService.post({content: this.$scope.content}).success(function(data) {
                    $scope.items.push(data)
                }).error(function() {
                    alert("error:newItem");
                });
            };

            this.itemService.get().success(function(data) {
                $scope.items = data
            }).error(function() {
                alert("error:getItems");
            });


        }

    }
}