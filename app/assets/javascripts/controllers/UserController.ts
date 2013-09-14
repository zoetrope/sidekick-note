///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface UserScope extends ng.IScope {
        name: string;
        password: string;

        result: string

        login(): void
    }

    declare var jsRouter:any
    export class UserController {

        constructor(public $scope:UserScope, public $resource:ng.resource.IResourceService) {

            var User = $resource(jsRouter.controllers.UserController.authenticate().url)

            $scope.login = () => {
                var input = {name: $scope.name, password: $scope.password}
                User.save(null, input, (data)=> {
                    console.log(data);
                    $scope.result = data
                }, (reason)=> {
                    alert("failed login." + reason)
                });
            };
        }

    }
}