///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='SearchCriterion.ts' />
///<reference path='../common/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module controllers {
    'use strict';

    export interface SearchCriterionScope extends ng.IScope {

        searchSelectedTags: string[];
        searchSelectOptions : any;
        searchText : string;
        searchTitle : string;
        searchSortOrder : number;

        searchCriteria : models.SearchCriterion[];

        allTags : string[];
        search : Function;
        addSearchCriterion : Function;

        targetType: string;

    }

    export class SearchCriterionController {

        constructor(public $scope:controllers.SearchCriterionScope, public $resource:ng.resource.IResourceService) {

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

            this.searchCriteriaResource = <services.IUpdatableResourceClass>$resource("/api/search_criteria/:target")

            $scope.search = angular.bind(this, this.search)
            $scope.addSearchCriterion = angular.bind(this, this.addSearchCriterion)

        }

        searchCriteriaResource:services.IUpdatableResourceClass;

        updateCriteria() {
            this.searchCriteriaResource.query({target: this.$scope.targetType},
                data => {
                    this.$scope.searchCriteria = data
                }, reason => console.log(reason));
        }

        search(query: string) {
            this.$scope.$emit("search." + this.$scope.targetType, query);
        }

        addSearchCriterion() {
            this.searchCriteriaResource.save({target: this.$scope.targetType}, {
                    title: this.$scope.searchTitle,
                    query: this.assembleQuery(),
                    sortOrder: this.$scope.searchSortOrder
                },
                (data)=> {
                    this.$scope.searchCriteria.push(data)
                },
                (reason)=> {
                    console.log("error addSearchCriterion");
                })
        }

        // abstract
        assembleQuery() : string {
            return "";
        }

        // abstract
        parseQuery(query: string) : void {
        }

    }
}


angular.module('sidekick-note.controller')
