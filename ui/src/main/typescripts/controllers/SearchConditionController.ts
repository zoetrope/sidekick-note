///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/SearchCondition.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module controllers {
    'use strict';

    export interface SearchConditionScope extends ng.IScope {

        searchSelectedTags: string[];
        searchSelectOptions : any;
        searchText : string;
        searchTitle : string;
        searchSortOrder : number;

        searchConditions : models.SearchCondition[];

        allTags : string[];
        searchTask : Function;
        addSearchCondition : Function;
    }

    export class SearchConditionController {

        constructor(public $scope:SearchConditionScope, public $resource:ng.resource.IResourceService) {

            $scope.searchSortOrder = 0;
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


            this.searchConditionResource = <services.IUpdatableResourceClass>$resource("/api/search_conditions")

            $scope.searchTask = angular.bind(this, this.searchTask)

            $scope.addSearchCondition = angular.bind(this, this.addSearchCondition)


            this.searchConditionResource.query(data => {
                $scope.searchConditions = data
            });
        }

        searchConditionResource:services.IUpdatableResourceClass;

        searchTask(keywords:string, tags:string) {
            this.$scope.$emit("search", keywords, tags);
        }

        addSearchCondition() {

            this.searchConditionResource.save(null, {
                    title: this.$scope.searchTitle,
                    targetType: "task",
                    keywords: this.$scope.searchText,
                    tags: this.$scope.searchSelectedTags.join(" "),
                    sortOrder: this.$scope.searchSortOrder
                },
                (data)=> {
                    this.$scope.searchConditions.push(data)
                    alert("ok addSearchCondition");
                },
                (reason)=> {
                    alert("error addSearchCondition");
                })
        }
    }
}
