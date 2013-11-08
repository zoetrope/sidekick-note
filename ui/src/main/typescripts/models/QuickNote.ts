///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class QuickNote {
        itemId:number;
        content:string;
        renderedContent:string;
        rate:number;
        createdAt: string;
        tags: string[];

        editable: Boolean;
    }
}