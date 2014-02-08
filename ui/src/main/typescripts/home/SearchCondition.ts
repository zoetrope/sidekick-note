///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class SearchCondition {
        name:string;
        type:string;
        keywords:string;
        status:string;
        tags:string[];
        sortOrder:number;
    }
}