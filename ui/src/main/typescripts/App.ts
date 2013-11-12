///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='application/ApplicationController.ts' />
///<reference path='home/HomeController.ts' />
///<reference path='quick_note/QuickNoteController.ts' />
///<reference path='task/TaskController.ts' />
///<reference path='article/ArticleController.ts' />
///<reference path='search/SearchController.ts' />
///<reference path='user/UserController.ts' />
///<reference path='base/SearchCriterionController.ts' />
///<reference path='task/SearchTaskCriterionController.ts' />
///<reference path='quick_note/SearchQuickNoteCriterionController.ts' />
///<reference path='common/SearchParam.ts' />
///<reference path='article/Article.ts' />
///<reference path='search/Item.ts' />
///<reference path='quick_note/QuickNote.ts' />
///<reference path='common/Tag.ts' />
///<reference path='task/Task.ts' />
///<reference path='base/SearchCriterion.ts' />
///<reference path='services/ItemRenderService.ts' />
///<reference path='directives/ItemDirective.ts' />
///<reference path='directives/EnableFocus.ts' />

console.log("initialize sidekick-note");

module App {
    'use strict';

    export var appName = "sidekick-note";

    angular.module(
        appName,
        [appName + ".controller", appName + ".service", appName + ".directive", "ui.keypress", 'ui.select2', 'ui.bootstrap', 'ui.date', 'ngRoute'],
        ($routeProvider:ng.IRouteProvider, $locationProvider:ng.ILocationProvider)=> {
            console.log("rootProvider!");
            $routeProvider
                .when("/home", {templateUrl: "/assets/views/home.tpl.html"})
                .when("/quick_note", {templateUrl: "/assets/views/quick_note.tpl.html"})
                .when("/task", {templateUrl: "/assets/views/task.tpl.html"})
                .when("/article", {templateUrl: "/assets/views/article.tpl.html"})
                .when("/search", {templateUrl: "/assets/views/search.tpl.html"})
                .when("/login", {templateUrl: "/assets/views/login.tpl.html"})
                .otherwise({redirectTo: '/home'});
            $locationProvider.html5Mode(true);
        })
        .config($httpProvider => {
            var interceptor = ["$q", "$location", ($q, $location) => {
                return promise => {
                    return promise.then(response => response,
                        response => {
                            if (response.status == 401) {
                                $location.url('/login');
                            }
                            return $q.reject(response);
                        });
                }
            }];
            $httpProvider.responseInterceptors.push(interceptor)
        })
        .config(function($sceProvider) {
            $sceProvider.enabled(true);
        })
        .run(($rootScope:ng.IRootScopeService, $routeParams:ng.IRouteParamsService)=> {});

    angular.module(
        appName + ".directive",
        [],
        ()=> {
        }
    ).directive('kickFocus', () => new directives.EnableFocus())
        .directive('kickItem', () => new directives.ItemDirective());

    angular.module(
        appName + ".service",
        [],
        ()=> {
        }
    ).factory("itemRenderService", ["$sce", ($sce):services.ItemRenderService=> {
            return new services.ItemRenderService($sce);
        }]);

    angular.module(
        appName + ".controller",
        [appName + ".service", "ngResource"],
        ()=> {}
    ).controller("ApplicationController", ["$scope", "$location", "$resource", "$timeout",
            ($scope:controllers.AppScope, $location:ng.ILocationService, $resource:ng.resource.IResourceService, $timeout:ng.ITimeoutService) : controllers.ApplicationController => {
                return new controllers.ApplicationController($scope, $location, $resource, $timeout)
            }])
     .controller("HomeController", ["$scope", "$resource", "itemRenderService",
            ($scope:controllers.HomeScope, $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) : controllers.HomeController => {
                return new controllers.HomeController($scope, $resource, itemRenderService)
            }])
     .controller("QuickNoteController", ["$scope", "$resource", "$location", "itemRenderService",
            ($scope:controllers.QuickNoteScope, $resource:ng.resource.IResourceService, $location:ng.ILocationService, itemRenderService:services.ItemRenderService) : controllers.QuickNoteController => {
                return new controllers.QuickNoteController($scope, $resource, $location, itemRenderService)
            }])
     .controller("QuickNoteItemController", ["$scope", "$resource",
            ($scope:controllers.QuickNoteItemScope, $resource:ng.resource.IResourceService) : controllers.QuickNoteItemController => {
                return new controllers.QuickNoteItemController($scope, $resource)
            }])
     .controller("TaskController", ["$scope", "$resource", "$location", "itemRenderService",
            ($scope:controllers.TaskScope, $resource:ng.resource.IResourceService, $location:ng.ILocationService, itemRenderService:services.ItemRenderService) : controllers.TaskController => {
                return new controllers.TaskController($scope, $resource, $location, itemRenderService)
            }])
     .controller("TaskItemController", ["$scope", "$resource",
            ($scope:controllers.TaskItemScope, $resource:ng.resource.IResourceService) : controllers.TaskItemController => {
                return new controllers.TaskItemController($scope, $resource)
            }])
     .controller("ArticleController", ["$scope", "$resource", "itemRenderService",
            ($scope:controllers.ArticleScope, $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) : controllers.ArticleController => {
                return new controllers.ArticleController($scope, $resource, itemRenderService)
            }])
     .controller("SearchController", ["$scope", "$resource", "$location", "itemRenderService",
            ($scope:controllers.SearchScope, $resource:ng.resource.IResourceService, $location:ng.ILocationService, itemRenderService:services.ItemRenderService) : controllers.SearchController => {
                return new controllers.SearchController($scope, $resource, $location, itemRenderService)
            }])
     .controller("UserController", ["$scope", "$resource",
            ($scope:controllers.UserScope, $resource:ng.resource.IResourceService) : controllers.UserController => {
                return new controllers.UserController($scope, $resource)
            }])
     .controller("SearchTaskCriterionController", ["$scope", "$resource",
            ($scope:controllers.SearchTaskCriterionScope, $resource:ng.resource.IResourceService) : controllers.SearchTaskCriterionController => {
                return new controllers.SearchTaskCriterionController($scope, $resource)
            }])
     .controller("SearchQuickNoteCriterionController", ["$scope", "$resource",
            ($scope:controllers.SearchQuickNoteCriterionScope, $resource:ng.resource.IResourceService) : controllers.SearchQuickNoteCriterionController => {
                return new controllers.SearchQuickNoteCriterionController($scope, $resource)
            }])

}