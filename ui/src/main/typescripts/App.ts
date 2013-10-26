///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='controllers/ApplicationController.ts' />
///<reference path='controllers/HomeController.ts' />
///<reference path='controllers/QuickNoteController.ts' />
///<reference path='controllers/TaskController.ts' />
///<reference path='controllers/ArticleController.ts' />
///<reference path='controllers/SearchController.ts' />
///<reference path='controllers/UserController.ts' />
///<reference path='controllers/SearchConditionController.ts' />
///<reference path='controllers/SearchParam.ts' />
///<reference path='models/Article.ts' />
///<reference path='models/Item.ts' />
///<reference path='models/QuickNote.ts' />
///<reference path='models/Tag.ts' />
///<reference path='models/Task.ts' />
///<reference path='models/SearchCondition.ts' />
///<reference path='services/ItemRenderService.ts' />
///<reference path='directives/ItemDirective.ts' />
///<reference path='directives/EnableFocus.ts' />

console.log("initialize sidekick-note");

module App {
    'use strict';

    export var appName = "sidekick-note";

    angular.module(
        appName,
        [appName + ".controller", appName + ".service", appName + ".directive", "ui.keypress", 'ui.select2', 'ui.bootstrap', 'ui.date', 'ui.router'],
        ($routeProvider:ng.IRouteProvider, $locationProvider:ng.ILocationProvider)=> {
            console.log("rootProvider!");
            $locationProvider.html5Mode(true);
        })
        .config(($stateProvider, $urlRouterProvider) =>{
            $urlRouterProvider.otherwise("/home")
            $stateProvider.state('home', {
                url: "/home",
                templateUrl: "/assets/views/home.html"
            })
                .state('quick_note', {
                    url: "/quick_note",
                    templateUrl: "/assets/views/quick_note.html"
                })
                .state('task', {
                    url: "/task?page&words&tags",
                    abstract: true,
                    templateUrl: "/assets/views/task.html"
                })
                .state('task.list', {
                    url: "",
                    templateUrl: "/assets/views/task.list.html"
                })
                .state('article', {
                    url: "/article",
                    templateUrl: "/assets/views/article.html"
                })
                .state('search', {
                    url: "/search?page&words&tags",
                    templateUrl: "/assets/views/search.html"
                })
                .state('login', {
                    url: "/login",
                    templateUrl: "/assets/views/login.html"
                })
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
        .run(['$rootScope', '$state', '$stateParams',($rootScope, $state, $stateParams)=> {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);

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
    ).factory("itemRenderService", ():services.ItemRenderService=> {
            return new services.ItemRenderService();
        });

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
     .controller("QuickNoteController", ["$scope", "$resource", "itemRenderService",
            ($scope:controllers.QuickNoteScope, $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) : controllers.QuickNoteController => {
                return new controllers.QuickNoteController($scope, $resource, itemRenderService)
            }])
     .controller("TaskController", ["$scope", "$resource", "$location", "$stateParams", "itemRenderService",
            ($scope:controllers.TaskScope, $resource:ng.resource.IResourceService, $location:ng.ILocationService, $stateParams:controllers.SearchParam, itemRenderService:services.ItemRenderService) : controllers.TaskController => {
                return new controllers.TaskController($scope, $resource, $location, $stateParams, itemRenderService)
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
     .controller("SearchConditionController", ["$scope", "$resource",
            ($scope:controllers.SearchConditionScope, $resource:ng.resource.IResourceService) : controllers.SearchConditionController => {
                return new controllers.SearchConditionController($scope, $resource)
            }])

}