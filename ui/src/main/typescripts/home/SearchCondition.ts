///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class CriterionParam {
        type:string;
        keywords:string;
        status:string;
        tags:string[];
    }

    export class Criterion {
        name:string;
        param: CriterionParam;
        sortOrder:number;
    }
}