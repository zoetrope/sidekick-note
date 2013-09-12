///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />

module services {
    'use strict';

    declare var jsRouter :any

    export class ItemService {
        constructor(public $http: ng.IHttpService) {
        }

        get():ng.IHttpPromise<any> {
            return this.$http.get(jsRouter.controllers.Application.items().url);
        }

        post(data : any):ng.IHttpPromise<any> {
            return this.$http.post(jsRouter.controllers.Application.items().url, data);
        }
    }
}