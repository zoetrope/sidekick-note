///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class SearchCriterion {
        constructor(
            public title: string,
            public targetType: string,
            public query: string,
            public sortOrder: number
            )
        {
        }
    }
}