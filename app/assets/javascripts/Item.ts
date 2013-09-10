///<reference path='../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts' />

module Model {
    'use strict';

    export class Item {
        content:string;

        /**
         * @constructor
         * @param data JSONObjectまたはJSON文字列
         */
        constructor(data) {
            if (angular.isString(data)) {
                data = angular.fromJson(data);
            }
            this.content = data.content;
        }
    }
}