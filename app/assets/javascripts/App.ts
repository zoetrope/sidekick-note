///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='models/Item.ts' />
///<reference path='services/ItemService.ts' />
///<reference path='controllers/ItemController.ts' />

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
                    templateUrl: "/assets/views/item.html",
                    controller: controllers.ItemController
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
    });

    angular.module(
        appName + ".controller",
        [appName + ".service"],
        ()=> {}
    ).controller("ItemController",controllers.ItemController);

}