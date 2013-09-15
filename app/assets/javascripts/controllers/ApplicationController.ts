///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface AppScope extends ng.IScope {
        input_name: string;
        input_password: string;

        loggedin: string;

        login(): void
    }

    declare var jsRouter:any
    export class ApplicationController {

        constructor(public $scope:AppScope, public $location:ng.ILocationService, public $resource:ng.resource.IResourceService) {

            var Auth = $resource(jsRouter.controllers.Application.authenticate().url)
            var LoggedIn = $resource(jsRouter.controllers.Application.loggedin().url)

            LoggedIn.get(x=>$scope.loggedin = x.name, reason => alert(reason))

            $scope.login = () => {
                var input = {name: $scope.input_name, password: $scope.input_password}
                Auth.save(null, input, (data)=> {
                    console.log(data.url);
                    //alert(data);
                    //$scope.loggedin = $scope.input_name
                    $scope.loggedin = data.url
                    window.location.href = data.url;

                }, (reason)=> {
                    alert("failed login." + reason)
                });
            };
        }

    }
}