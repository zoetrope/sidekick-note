///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

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
                .when("/quick_note", {templateUrl: "/assets/views/quick_note.tpl.html"})
                .when("/task", {templateUrl: "/assets/views/task.tpl.html"})
                .when("/article", {templateUrl: "/assets/views/article.tpl.html"})
                .when("/search", {templateUrl: "/assets/views/search.tpl.html"})
                .when("/migration", {templateUrl: "/assets/views/migration.tpl.html"})
                .when("/login", {templateUrl: "/assets/views/login.tpl.html"})
                .when("/new_item", {
                    templateUrl: "/assets/views/item.base.tpl.html",
                    controller: "NewItemController"
                })
                .when("/items/:id", {
                    templateUrl: "/assets/views/item.base.tpl.html",
                    controller: "ItemController"
                })
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