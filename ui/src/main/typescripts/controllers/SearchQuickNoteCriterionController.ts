///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/SearchCriterion.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='../controllers/SearchCriterionController.ts' />

module controllers {
    'use strict';

    export interface SearchQuickNoteCriterionScope extends controllers.SearchCriterionScope {
    }

    export class SearchQuickNoteCriterionController extends controllers.SearchCriterionController {

        constructor(public $scope:controllers.SearchCriterionScope, public $resource:ng.resource.IResourceService) {
            super($scope, $resource)
            $scope.targetType = "quick_notes";
            this.updateCriteria();
        }

        // overload
        assembleQuery() : string {
            return "keywords=" + this.$scope.searchText + "&tags=" + this.$scope.searchSelectedTags.join(" ")
        }

        // overload
        parseQuery(query: string) : void {
        }
    }
}