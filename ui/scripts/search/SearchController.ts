///<reference path='../../typings/tsd.d.ts' />

module controllers {
    'use strict';

    export interface SearchScope extends ng.IScope {
        current : models.Criterion;

        search : Function;
        addCriterion : Function;
        cancel:Function;

        types: string[];
        statuses: {key?: string[]};
        tagsSelectOption : any;
    }

    export class SearchController {

        constructor(private $scope:SearchScope,private $rootScope: ng.IRootScopeService, private $modalInstance:any, private apiService:services.ApiService, private selectOptionService:services.SelectOptionService) {

            $scope.current = new models.Criterion();
            $scope.current.name = "";
            $scope.current.param = new models.CriterionParam();
            $scope.current.param.keywords = "";
            $scope.current.param.tags = [];
            $scope.current.param.type = "All";
            $scope.current.param.status = "All";
            $scope.current.sortOrder = 0;

            $scope.tagsSelectOption = this.selectOptionService.getOption();
            $scope.types = ["All", "Task", "Article", "QuickNote"];

            $scope.statuses = {
                "All": ["All", "New", "Accepted", "Completed", "Writing", "Viewing", "Archived", "Flowing"],
                "Task": ["All", "New", "Accepted", "Completed"],
                "Article": ["All", "Writing", "Viewing", "Archived"],
                "QuickNote": ["All", "Flowing", "Archived"]
            };

            $scope.search = angular.bind(this, this.search);
            $scope.addCriterion = angular.bind(this, this.addCriterion);
            $scope.cancel = angular.bind(this, this.cancel);
        }

        cancel() {
            this.$modalInstance.dismiss('cancel');
        }

        search(criterion:models.Criterion) {
            console.log("broadcast!!");
            this.$rootScope.$broadcast("searchItems", criterion);
        }

        addCriterion(criterion:models.Criterion) {
            this.apiService.Criteria.save(null, criterion,
                (data)=> {
                    this.search(criterion);
                },
                (reason)=> {
                    console.log("error addSearchCriterion");
                });

        }

    }
}


angular.module('sidekick-note.controller')
    .controller("SearchController", ["$scope", "$rootScope", "$modalInstance", "apiService", "selectOptionService",
        ($scope:controllers.SearchScope, $rootScope:ng.IRootScopeService, $modalInstance:any, apiService:services.ApiService, selectOptionService:services.SelectOptionService):controllers.SearchController => {
            return new controllers.SearchController($scope, $rootScope, $modalInstance, apiService, selectOptionService)
        }]);