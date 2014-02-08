///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='SearchCondition.ts' />
///<reference path='../common/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface SidebarScope extends ng.IScope {


        current : models.SearchCondition;

        searchSelectOptions : any;
        allTags : string[];
        types: {name: string; value:string
        }[];
        statuses: {key?: {name: string; value:string
        }[]
        };


        searchCriteria : models.SearchCondition[];

        search : Function;
        addSearchCriterion : Function;


    }

    export class SidebarController {

        constructor(private $scope:controllers.SidebarScope, apiService:services.ApiService) {

            $scope.current = new models.SearchCondition();
            $scope.current.name = "";
            $scope.current.keywords = "";
            $scope.current.tags = [];
            $scope.current.status = "";
            $scope.current.type = "";
            $scope.current.sortOrder = 0;

            $scope.types = [
                {name: "Task", value: "Task"},
                {name: "Article", value: "Article"},
                {name: "QuickNote", value: "QuickNote"}
            ];

            $scope.statuses = {
                "Task": [
                    {name: "New", value: "New"},
                    {name: "Accepted", value: "Accepted"},
                    {name: "Completed", value: "Completed"}
                ],
                "Article": [
                    {name: "Writing", value: "Writing"},
                    {name: "Viewing", value: "Viewing"},
                    {name: "Archived", value: "Archived"}
                ],
                "QuickNote": [
                    {name: "Flowing", value: "Flowing"},
                    {name: "Archived", value: "Archived"}
                ]
            };

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

            apiService.Tags.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            $scope.search = angular.bind(this, this.search)
            $scope.addSearchCriterion = angular.bind(this, this.addSearchCriterion)

        }


        updateCriteria() {
            /*
             this.searchCriteriaResource.query({target: this.$scope.targetType},
             data => {
             this.$scope.searchCriteria = data
             }, reason => console.log(reason));
             */
        }

        search(query:string) {
            this.$scope.$emit("search." + this.$scope.current.type, query);
        }

        addSearchCriterion() {
            /*
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
             */
        }

    }
}


angular.module('sidekick-note.controller')
    .controller("SidebarController", ["$scope", "apiService", "$location", "itemRenderService",
        ($scope:controllers.SidebarScope, apiService:services.ApiService, $location:ng.ILocationService, itemRenderService:services.ItemRenderService):controllers.SidebarController => {
            return new controllers.SidebarController($scope, apiService);
        }]);
