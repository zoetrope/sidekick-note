///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';


    export class TagForm {
        id : number;
        text : string;
    }

    export class Tag {
        constructor(public tagId: number, public name: string, public refCount: number){

        }
    }
}