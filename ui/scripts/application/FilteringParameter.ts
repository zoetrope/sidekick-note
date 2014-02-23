///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class FilteringParameter {
        keywords: boolean;
        type: string;
        status: string;
        tags: string[];
    }
}