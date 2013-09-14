///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface Scope extends ng.IScope {
        items: models.Item[];
        //items: ng.IPromise<Model.Item[]>;
        content: string;
        newItem() : void;
    }


    interface ItemResource extends ng.resource.IResource {
        content:string;
    }

    declare var jsRouter:any
    export class ItemController {

        constructor(public $scope:Scope, public $resource:ng.resource.IResourceService) {

            var Items = $resource(jsRouter.controllers.ItemController.items().url)

            $scope.newItem = () => {

                Items.save(null, {content: this.$scope.content},
                    (data)=> {
                        $scope.items.push(data)
                    },
                    (reason)=> {
                        alert("error new item")
                    })
            };

            Items.query(
                (data)=> {
                    $scope.items = data
                },
                (reason)=> {
                    alert("error get items")
                });

        }

    }
}