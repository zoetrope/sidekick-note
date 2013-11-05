///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/SearchCriterion.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='../controllers/SearchCriterionController.ts' />

module controllers {
    'use strict';

    export interface SearchTaskCriterionScope extends controllers.SearchCriterionScope {
        status: String;
        dueDate: String;
    }

    export class SearchTaskCriterionController extends controllers.SearchCriterionController {

        constructor(public $scope:controllers.SearchTaskCriterionScope, public $resource:ng.resource.IResourceService) {
            super(<controllers.SearchCriterionScope>$scope, $resource)
            $scope.targetType = "tasks";
            this.updateCriteria();
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