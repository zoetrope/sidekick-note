///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/QuickNote.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module controllers {
    'use strict';

    export interface SearchConditionScope extends ng.IScope {

        searchSelectedTags: string[];
        searchSelectOptions : any;
        searchText : string;

        allTags : string[];
        searchTask : Function;
    }

    export class SearchConditionController {

        constructor(public $scope:SearchConditionScope, public $resource:ng.resource.IResourceService) {

            $scope.searchText = ""
            $scope.searchSelectedTags = []
            $scope.searchSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'allowClear': true,
                'closeOnSelect': false,
                'createSearchChoice': null,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            var tagsResource = $resource("/api/tags")
            tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            $scope.searchTask = angular.bind(this, this.searchTask)
        }

        searchTask() {
            this.$scope.$emit("search", this.$scope.searchText, this.$scope.searchSelectedTags.join(" "));
        }
    }
}
