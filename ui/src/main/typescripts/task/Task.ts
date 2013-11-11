///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module models {
    'use strict';

    export class Task {
        // content
        itemId:number;
        content:string;
        renderedContent:string;
        rate:number;
        createdAt: string;
        status: string;
        tags: string[];
        dueDate: Date;
        completedAt: Date;
        title: string[];

        //
        editable: Boolean;
    }
}