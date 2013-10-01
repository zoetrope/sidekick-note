///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Task.ts' />
///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface TaskScope extends ng.IScope {

        selectedTags: models.TagForm[];
        select2Options : any;
        allTags : string[];

    }

    export class TaskController {

        constructor(public $scope:TaskScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {


            $scope.selectedTags = []
            $scope.select2Options = {
                'multiple': true,
                'allowClear' : true,
                'closeOnSelect' : false,
                'createSearchChoice' : null,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            var Tags = $resource("/api/tags")
            Tags.query(data => {
                $scope.allTags = data.map(tag => {return {"id": tag.name, "text": tag.name}})
            });
        }

    }
}