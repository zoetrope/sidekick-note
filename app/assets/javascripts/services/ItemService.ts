///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />

module services {
    'use strict';

    /*
    interface ItemController{
        items();
    }
    interface UserController{

    }
    interface Controllers{
        ItemController : ItemController;
        UserController : UserController;
    }
    interface JavascriptRouter{
        controllers : Controllers
    }
    */
    declare var jsRouter :any

    export class ItemService {
        constructor(public $http: ng.IHttpService) {
        }

        get():ng.IHttpPromise<any> {
            return this.$http.get(jsRouter.controllers.ItemController.items().url);
        }

        post(data : any):ng.IHttpPromise<any> {
            return this.$http.post(jsRouter.controllers.ItemController.items().url, data);
        }
    }
}