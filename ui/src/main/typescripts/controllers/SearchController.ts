///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />
///<reference path='../models/QuickNote.ts' />

module controllers {
    'use strict';

    export interface SearchScope extends ng.IScope {
        items: models.QuickNote[];
        input_words: string;
        search() : void;
        searching : Boolean;
        keypress($event : ng.IAngularEvent) : void;
        hasFocus : Boolean;
    }

    declare var jsRouter:any
    declare var hljs:any

    export class SearchController {

        constructor(public $scope:SearchScope, public $resource:ng.resource.IResourceService) {

            $scope.hasFocus = true;

            marked.setOptions({
                gfm: true,
                tables: true,
                breaks: true,
                pedantic: false,
                sanitize: true,
                highlight: function (code, lang) {
                    return hljs.highlight(lang, code).value;
                }
            });

            $scope.searching = false

            $scope.search = () => {
                $scope.searching = true
                $scope.hasFocus = false

                var Search = $resource(jsRouter.controllers.ItemController.search($scope.input_words).url)
                Search.query(
                    (data)=> {
                        $scope.items = data.map(x=>{x.content = marked(x.content); return x})
                        $scope.input_words = ""
                        $scope.searching = false
                        $scope.hasFocus = true;
                    },
                    (reason)=> {
                        alert("error get items : " + reason)
                        $scope.searching = false
                        $scope.hasFocus = true;
                    });
            };


            $scope.keypress = ($event : ng.IAngularEvent) => {
                $scope.search()
                $event.preventDefault();
            };

        }

    }
}