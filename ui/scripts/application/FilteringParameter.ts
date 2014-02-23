///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class FilteringParameter {
        keyword: boolean;
        type: string;
        status: string;
        tags: string[];

        order: string;
    }
}