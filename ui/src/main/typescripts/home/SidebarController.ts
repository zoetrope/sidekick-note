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
        types: string[];
        statuses: {key?: string[]};


        searchCriteria : models.SearchCondition[];

        search : Function;
        addSearchCriterion : Function;

        active: any;

    }

    export class SidebarController {

        constructor(public $scope:controllers.SidebarScope, apiService:services.ApiService) {

            $scope.current = new models.SearchCondition();
            $scope.current.name = "";
            $scope.current.keywords = "";
            $scope.current.tags = [];
            $scope.current.type = "All";
            $scope.current.status = "All";
            $scope.current.sortOrder = 0;

            $scope.types = ["All", "Task", "Article", "QuickNote"];

            $scope.statuses = {
                "All": ["All", "New", "Accepted", "Completed", "Writing", "Viewing", "Archived", "Flowing"],
                "Task": ["All", "New", "Accepted", "Completed"],
                "Article": ["All", "Writing", "Viewing", "Archived"],
                "QuickNote": ["All", "Flowing", "Archived"]
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

            $scope.search = angular.bind(this, this.search);

            $scope.addSearchCriterion = angular.bind(this, this.addSearchCriterion);

            $scope.active = {
                one: true,
                two: false
            };
        }


        updateCriteria() {
            /*
             this.searchCriteriaResource.query({target: this.$scope.targetType},
             data => {
             this.$scope.searchCriteria = data
             }, reason => console.log(reason));
             */
        }

        search() {
            this.$scope.active.two = true;
            //this.$scope.$emit("search." + this.$scope.current.type, query);


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
    .controller("SidebarController", ["$scope", "apiService",
        ($scope:controllers.SidebarScope, apiService:services.ApiService):controllers.SidebarController => {
            return new controllers.SidebarController($scope, apiService);
        }]);
