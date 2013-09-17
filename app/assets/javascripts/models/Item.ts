///<reference path='../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../ts-definitions/DefinitelyTyped/marked/marked.d.ts" />

module models {
    'use strict';

    export class Item {
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