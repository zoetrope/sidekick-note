///<reference path='../../typings/tsd.d.ts' />

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