///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path="../../ts-definitions/DefinitelyTyped/marked/marked.d.ts" />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface ItemScope extends ng.IScope {
        items: models.Item[];
        input_content: string;
        add_item() : void;
        sending : Boolean;
    }

    declare var jsRouter:any
    declare var hljs:any
    export class ItemController {

        constructor(public $scope:ItemScope, public $resource:ng.resource.IResourceService) {

            marked.setOptions({
                gfm: true,
                tables: true,
                breaks: true,
                pedantic: false,
                sanitize: true,
                highlight: function (code, lang) {
                    var hoge = hljs.highlight(lang, code).value;
                    console.log(hoge);
                   return hoge;
                }
            });

            var Items = $resource(jsRouter.controllers.ItemController.items().url)
            $scope.sending = false

            $scope.add_item = () => {
                $scope.sending = true

                Items.save(null, {content: this.$scope.input_content},
                    (data)=> {
                        data.content = marked(data.content)
                        $scope.items.unshift(data)
                        if($scope.items.length > 5){
                            $scope.items.pop()
                        }
                        $scope.input_content = ""
                        $scope.sending = false
                    },
                    (reason)=> {
                        alert("error new item")
                        $scope.sending = false
                    })
            };

            Items.query(
                (data)=> {
                    $scope.items = data.map(x=>{x.content = marked(x.content); return x})
                },
                (reason)=> {
                    alert("error get items")
                });

        }

    }
}