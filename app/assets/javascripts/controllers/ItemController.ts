///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface ItemScope extends ng.IScope {
        items: models.Item[];
        input_content: string;
        add_item() : void;
    }

    declare var jsRouter:any
    export class ItemController {

        constructor(public $scope:ItemScope, public $resource:ng.resource.IResourceService) {

            var Items = $resource(jsRouter.controllers.ItemController.items().url)

            $scope.add_item = () => {

                Items.save(null, {content: this.$scope.input_content},
                    (data)=> {
                        $scope.items.unshift(data)
                        if($scope.items.length > 5){
                            $scope.items.pop()
                        }
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