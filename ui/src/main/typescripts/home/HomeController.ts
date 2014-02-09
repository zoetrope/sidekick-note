///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface HomeParam extends ng.route.IRouteParamsService {
        url: string;
    }

    export interface HomeScope extends ng.IScope {

    }

    export class HomeController {

        constructor($scope:HomeScope, $routeParams:controllers.HomeParam, $location:ng.ILocationService) {
            console.log($routeParams);
            // クライアントサイドでルーティングすべきURLがサーバーに渡ったら、ここにリダイレクトされてURLがパラメータで渡される。
            if($routeParams.url) {
                $location.url(decodeURIComponent($routeParams.url));
            }
        }

    }
}

angular.module('sidekick-note.controller')
    .controller("HomeController", ["$scope", "$routeParams", "$location",
        ($scope:controllers.HomeScope, $routeParams:controllers.HomeParam, $location:ng.ILocationService) : controllers.HomeController => {
            return new controllers.HomeController($scope, $routeParams, $location)
        }]);