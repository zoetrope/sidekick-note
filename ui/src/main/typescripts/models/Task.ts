///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';

    export class Task {
        itemId:number;
        content:string;
        title:string
        created: string;
        status: string;
        completed:Boolean;
    }
}