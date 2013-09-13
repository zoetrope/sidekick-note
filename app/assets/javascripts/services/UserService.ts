///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />

module services {
    'use strict';

    declare var jsRouter :any

    export class UserService {
        constructor(public $http: ng.IHttpService) {
        }

        post(data : any):ng.IHttpPromise<any> {
            return this.$http.post(jsRouter.controllers.UserController.signup().url, data);
        }
        login(data : any):ng.IHttpPromise<any> {
            return this.$http.post(jsRouter.controllers.UserController.authenticate().url, data);
        }
    }
}