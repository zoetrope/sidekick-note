///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class Tag {
        constructor(public tagId: number, public name: string, public refCount: number){

        }
    }
}