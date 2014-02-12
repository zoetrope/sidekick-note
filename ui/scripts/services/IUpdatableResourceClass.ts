///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

module services {
    'use strict';

    export interface IUpdatableResourceClass extends ng.resource.IResourceClass  {
        update(params: any, data: any, success?: Function, error?: Function): ng.resource.IResource;
    }
}