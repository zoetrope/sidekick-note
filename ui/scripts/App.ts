///<reference path='../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

console.log("initialize sidekick-note");

module App {
    'use strict';

    export var appName = "sidekick-note";

    angular.module(appName + ".directive",[]);
    angular.module(appName + ".service",[]);
    angular.module(appName + ".filter",[]);
    angular.module(appName + ".controller",[appName + ".service", "ngResource", "ui.bootstrap.accordion"]);

    angular.module(
        appName,
        [appName + ".controller", appName + ".service", appName + ".directive", appName + ".filter", "ui.keypress", 'ui.select2', 'ui.bootstrap', 'ui.date', 'ngRoute'],
        ($routeProvider:ng.route.IRouteProvider, $locationProvider:ng.ILocationProvider)=> {
            console.log("rootProvider!");
            $routeProvider
                .when("/", {redirectTo: '/home'})
                .when("/index.html", {redirectTo: '/home'})
                .when("/home", {templateUrl: "/assets/views/home.tpl.html"})
                .when("/search", {templateUrl: "/assets/views/search.tpl.html"})
                .when("/login", {templateUrl: "/assets/views/login.tpl.html"})
                .when("/new_item", {templateUrl: "/assets/views/item.base.tpl.html"})
                .when("/list/:id", {templateUrl: "/assets/views/list.tpl.html"})
                .when("/items/:id", {templateUrl: "/assets/views/item.base.tpl.html"})
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
        .run(($rootScope:ng.IRootScopeService, $routeParams:ng.route.IRouteParamsService)=> {});
}