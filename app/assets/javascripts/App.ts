///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
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
                .when("/item", {
                    templateUrl: "/views/item"
                })
                .when("/login", {
                    templateUrl: "/views/login"
                })
                .otherwise({redirectTo: '/item'});
            $locationProvider.html5Mode(true);
        }
    ).run(($rootScope:ng.IRootScopeService, $routeParams:ng.IRouteParamsService)=> {});

    angular.module(
        appName + ".service",
        [],
        ()=> {}
    ).factory("itemService", ($http:ng.IHttpService):services.ItemService=> {
        return new services.ItemService($http);
    }).factory("userService", ($http:ng.IHttpService):services.UserService=> {
        return new services.UserService($http);
    });

    angular.module(
        appName + ".controller",
        [appName + ".service"],
        ()=> {}
    ).controller("ItemController", ["$scope", "itemService",
            ($scope:controllers.Scope, itemService:services.ItemService) : controllers.ItemController => {
                return new controllers.ItemController($scope, itemService)
            }])
     .controller("UserController", ["$scope", "userService",
            ($scope:controllers.UserScope, userService:services.UserService) : controllers.UserController => {
                return new controllers.UserController($scope, userService)
            }])

}