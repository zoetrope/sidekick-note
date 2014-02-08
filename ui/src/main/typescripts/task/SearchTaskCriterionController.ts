///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../base/SearchCriterion.ts' />
///<reference path='../common/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='../base/SearchCriterionController.ts' />

module controllers {
    'use strict';

    export interface SearchTaskCriterionScope extends controllers.SearchCriterionScope {
        status: String;
        dueDate: String;

        listTabIsActive: Boolean;
    }

    export class SearchTaskCriterionController extends controllers.SearchCriterionController {

        constructor(public $scope:controllers.SearchTaskCriterionScope, public $resource:ng.resource.IResourceService) {
            super(<controllers.SearchCriterionScope>$scope, $resource)
            $scope.targetType = "tasks";
            this.updateCriteria();

            $scope.listTabIsActive = true;
        }

        // overload
        assembleQuery() : string {
            return angular.toJson({tags: this.$scope.searchSelectedTags.join(" "), status: this.$scope.status, dueDate: this.$scope.dueDate});
        }

        // overload
        parseQuery(query: string) : void {

        }
    }
}


angular.module('sidekick-note.controller')
    .controller("SearchTaskCriterionController", ["$scope", "$resource",
        ($scope:controllers.SearchTaskCriterionScope, $resource:ng.resource.IResourceService) : controllers.SearchTaskCriterionController => {
            return new controllers.SearchTaskCriterionController($scope, $resource)
        }]);
