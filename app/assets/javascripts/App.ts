///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='controllers/ApplicationController.ts' />
///<reference path='controllers/ItemController.ts' />
///<reference path='controllers/UserController.ts' />
///<reference path='models/Item.ts' />

console.log("ignite!");

module App {
    'use strict';

    export var appName = "sidekick-note";

    angular.module(
        appName,
        [appName + ".controller"],
        ($routeProvider:ng.IRouteProvider, $locationProvider:ng.ILocationProvider)=> {
            console.log("rootProvider!");
            $routeProvider
                .when("/item", {templateUrl: "/views/item"})
                .when("/login", {templateUrl: "/views/login"});
                //.otherwise({redirectTo: '/item'});
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
        appName + ".controller",
        ["ngResource"],
        ()=> {}
    ).controller("ApplicationController", ["$scope", "$location", "$resource",
            ($scope:controllers.AppScope, $location:ng.ILocationService, $resource:ng.resource.IResourceService) : controllers.ApplicationController => {
                return new controllers.ApplicationController($scope, $location, $resource)
            }])
     .controller("ItemController", ["$scope", "$resource",
            ($scope:controllers.ItemScope, $resource:ng.resource.IResourceService) : controllers.ItemController => {
                return new controllers.ItemController($scope, $resource)
            }])
     .controller("UserController", ["$scope", "$resource",
            ($scope:controllers.UserScope, $resource:ng.resource.IResourceService) : controllers.UserController => {
                return new controllers.UserController($scope, $resource)
            }])

}