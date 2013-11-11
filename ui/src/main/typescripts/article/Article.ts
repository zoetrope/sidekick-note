///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

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