///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class Tag {
        tagId: number;
        name: string;
        refCount: number;
    }
}