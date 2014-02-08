///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface MigrationScope extends ng.IScope {
        tasks: string[];
        quick_notes: string[];
        articles: string[];
    }

    export class MigrationController {

        constructor(public $scope:MigrationScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {
            $resource("/api/migration/tasks").query(data => {
                $scope.tasks = data.map(d=>{
                    d.createdAt = {"$date": Date.parse(d.createdAt)};
                    d.modifiedAt = {"$date":Date.parse(d.modifiedAt)};
                    if(d.dueDate){
                        d.dueDate = {"$date":Date.parse(d.dueDate)};
                    }
                    if(d.completedAt){
                        d.completedAt = {"$date":Date.parse(d.completedAt)};
                    }
                    d.type = "Task";
                    delete d.itemId;
                    return JSON.stringify(d);
                })
            });
            $resource("/api/migration/quick_notes").query(data => {
                $scope.quick_notes = data.map(d=>{
                    d.createdAt = {"$date":Date.parse(d.createdAt)};
                    d.modifiedAt = {"$date":Date.parse(d.modifiedAt)};
                    d.type = "QuickNote";
                    d.status = "Flowing";
                    delete d.itemId;
                    return JSON.stringify(d);
                })
            });
            $resource("/api/migration/articles").query(data => {
                $scope.articles = data.map(d=>{
                    d.createdAt = {"$date":Date.parse(d.createdAt)};
                    d.modifiedAt = {"$date":Date.parse(d.modifiedAt)};
                    d.type = "Article";
                    d.status = "Viewing";
                    delete d.itemId;
                    return JSON.stringify(d);
                })
            });
        }

    }
}

angular.module('sidekick-note.controller')
    .controller("MigrationController", ["$scope", "$resource", "itemRenderService",
        ($scope:controllers.MigrationScope, $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) : controllers.MigrationController => {
            return new controllers.MigrationController($scope, $resource, itemRenderService)
        }]);