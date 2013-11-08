///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='controllers/ApplicationController.ts' />
///<reference path='controllers/HomeController.ts' />
///<reference path='controllers/QuickNoteController.ts' />
///<reference path='controllers/TaskController.ts' />
///<reference path='controllers/ArticleController.ts' />
///<reference path='controllers/SearchController.ts' />
///<reference path='controllers/UserController.ts' />
///<reference path='controllers/SearchCriterionController.ts' />
///<reference path='controllers/SearchTaskCriterionController.ts' />
///<reference path='controllers/SearchQuickNoteCriterionController.ts' />
///<reference path='controllers/SearchParam.ts' />
///<reference path='models/Article.ts' />
///<reference path='models/Item.ts' />
///<reference path='models/QuickNote.ts' />
///<reference path='models/Tag.ts' />
///<reference path='models/Task.ts' />
///<reference path='models/SearchCriterion.ts' />
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
                .when("/home", {templateUrl: "/assets/views/home.html"})
                .when("/quick_note", {templateUrl: "/assets/views/quick_note.html"})
                .when("/task", {templateUrl: "/assets/views/task.html"})
                .when("/article", {templateUrl: "/assets/views/article.html"})
                .when("/search", {templateUrl: "/assets/views/search.html"})
                .when("/login", {templateUrl: "/assets/views/login.html"})
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
            $sceProvider.enabled(true); //TODO: falseにしなくてすむ方法を調べる
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