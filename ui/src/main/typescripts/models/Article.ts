///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';

    export class Title {
        id:number;
        title:string;
    }
    export class Article {
        content:string;
        title:string;
        createdAt: string;
    }
}