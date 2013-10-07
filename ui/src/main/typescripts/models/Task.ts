///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';

    export class Task {
        // content
        itemId:number;
        content:string;
        title:string;
        createdAt: string;
        status: string;
        tags: string[];
        dueDate: Date;
        completedAt: Date;

        //
        editable: Boolean;
    }
}