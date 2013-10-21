///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';

    export class SearchCondition {
        constructor(
            public title: string,
            public targetType: string,
            public keywords: string,
            public tags: string
            )
        {
        }
    }
}