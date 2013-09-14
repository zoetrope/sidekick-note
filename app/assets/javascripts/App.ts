///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='models/Item.ts' />
///<reference path='services/ItemService.ts' />
///<reference path='services/UserService.ts' />
///<reference path='controllers/ItemController.ts' />
///<reference path='controllers/UserController.ts' />

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
                .when("/login", {templateUrl: "/views/login"})
                .otherwise({redirectTo: '/item'});
            $locationProvider.html5Mode(true);
        }
    ).run(($rootScope:ng.IRootScopeService, $routeParams:ng.IRouteParamsService)=> {});

    angular.module(
        appName + ".controller",
        ["ngResource"],
        ()=> {}
    ).controller("ItemController", ["$scope", "$resource",
            ($scope:controllers.Scope, $resource:ng.resource.IResourceService) : controllers.ItemController => {
                return new controllers.ItemController($scope, $resource)
            }])
     .controller("UserController", ["$scope", "$resource",
            ($scope:controllers.UserScope, $resource:ng.resource.IResourceService) : controllers.UserController => {
                return new controllers.UserController($scope, $resource)
            }])

}