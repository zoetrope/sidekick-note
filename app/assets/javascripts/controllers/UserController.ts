///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../services/UserService.ts' />
///<reference path='../models/Item.ts' />

module controllers {
    'use strict';

    export interface UserScope extends ng.IScope {
        name: string;
        password: string;

        result: string

        signup(): void
        login(): void
    }

    export class UserController {

        constructor(public $scope:UserScope, public userService: services.UserService) {
            $scope.signup = () => {

                var input = {name: $scope.name, password: $scope.password}
                this.userService.post(input).success(function(data) {
                    $scope.result = data
                }).error(function() {
                    alert("error:newItem");
                });
            };

            $scope.login = () => {
                var input = {name: $scope.name, password: $scope.password}
                this.userService.login(input).success(function(data) {
                    $scope.result = data
                    alert(data)
                }).error(function() {
                    alert("error:newItem");
                });
            };
        }

    }
}