///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/QuickNote.ts' />
///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface QuickNoteScope extends ng.IScope {
        items: models.QuickNote[];
        input_content: string;
        add_item() : void;
        sending : Boolean;
        keypress($event : ng.IAngularEvent) : void;
        hasFocus : Boolean;
        toMarkdown(input: string) : string;
    }

    declare var jsRouter:any

    export class QuickNoteController {

        constructor(public $scope:QuickNoteScope, public $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) {
            $scope.hasFocus = true;

            var Items = $resource(jsRouter.controllers.ItemController.items().url)
            $scope.sending = false

            $scope.toMarkdown = input => {
                return itemRenderService.render(input)
            }

            $scope.add_item = () => {
                $scope.sending = true
                $scope.hasFocus = false

                Items.save(null, {content: this.$scope.input_content},
                    (data)=> {
                        data.content = itemRenderService.render(data.content)
                        alert(typeof($scope.items))
                        $scope.items.unshift(data)
                        if($scope.items.length > 5){
                            $scope.items.pop()
                        }
                        $scope.input_content = ""
                        $scope.sending = false
                        $scope.hasFocus = true;
                    },
                    (reason)=> {
                        alert("error new item")
                        $scope.sending = false
                        $scope.hasFocus = true;
                    })
            };

            Items.query(
                (data)=> {
                    $scope.items = data.map(x=>{x.content = itemRenderService.render(x.content); return x})
                },
                (reason)=> {
                    alert("error get items")
                });

            $scope.keypress = ($event : ng.IAngularEvent) => {
                $scope.add_item()
                $event.preventDefault();
            };

        }

    }
}