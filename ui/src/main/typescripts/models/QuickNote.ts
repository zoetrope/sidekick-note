///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';

    export class QuickNote {
        content:string;
        created: string;

        constructor(data) {
            if (angular.isString(data)) {
                data = angular.fromJson(data);
            }
            this.content = "marked: " + marked(data.content);
            this.created = data.created;
        }
    }
}