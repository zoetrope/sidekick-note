///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='controllers/ApplicationController.ts' />
///<reference path='controllers/QuickNoteController.ts' />
///<reference path='controllers/TaskController.ts' />
///<reference path='controllers/ArticleController.ts' />
///<reference path='controllers/SearchController.ts' />
///<reference path='controllers/UserController.ts' />
///<reference path='models/QuickNote.ts' />
///<reference path='services/ItemRenderService.ts' />

console.log("ignite!");

module App {
    'use strict';

    export var appName = "sidekick-note";

    angular.module(
        appName,
        [appName + ".controller", appName + ".service", appName + ".directive", "ui.keypress"],
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
        }
    ).config($httpProvider => {
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
        .run(($rootScope:ng.IRootScopeService, $routeParams:ng.IRouteParamsService)=> {});

    angular.module(
        appName + ".directive",
        [],
        ()=> {
        }
    ).directive('kickFocus', [ () => {
            return (scope, element, attrs) => {
                scope.$watch(attrs.kickFocus, autofocus => {
                    if (autofocus) {
                        setTimeout(function () {
                            element[0].focus()
                        }, 0)
                    }
                })
            }
        }]);

    angular.module(
        appName + ".service",
        [],
        ()=> {
        }
    ).factory("itemRenderService", ($http:ng.IHttpService):services.ItemRenderService=> {
            return new services.ItemRenderService($http);
        })
    ;

    angular.module(
        appName + ".controller",
        [appName + ".service", "ngResource"],
        ()=> {}
    ).controller("ApplicationController", ["$scope", "$location", "$resource",
            ($scope:controllers.AppScope, $location:ng.ILocationService, $resource:ng.resource.IResourceService) : controllers.ApplicationController => {
                return new controllers.ApplicationController($scope, $location, $resource)
            }])
     .controller("QuickNoteController", ["$scope", "$resource",
            ($scope:controllers.QuickNoteScope, $resource:ng.resource.IResourceService) : controllers.QuickNoteController => {
                return new controllers.QuickNoteController($scope, $resource)
            }])
     .controller("TaskController", ["$scope", "$resource",
            ($scope:controllers.TaskScope, $resource:ng.resource.IResourceService) : controllers.TaskController => {
                return new controllers.TaskController($scope, $resource)
            }])
     .controller("ArticleController", ["$scope", "$resource",
            ($scope:controllers.ArticleScope, $resource:ng.resource.IResourceService) : controllers.ArticleController => {
                return new controllers.ArticleController($scope, $resource)
            }])
     .controller("SearchController", ["$scope", "$resource",
            ($scope:controllers.SearchScope, $resource:ng.resource.IResourceService) : controllers.SearchController => {
                return new controllers.SearchController($scope, $resource)
            }])
     .controller("UserController", ["$scope", "$resource",
            ($scope:controllers.UserScope, $resource:ng.resource.IResourceService) : controllers.UserController => {
                return new controllers.UserController($scope, $resource)
            }])

}