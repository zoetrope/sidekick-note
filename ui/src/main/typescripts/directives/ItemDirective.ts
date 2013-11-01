///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module directives {
    'use strict';

    export class ItemDirective implements ng.IDirective {
        restrict: string = "E";

        templateUrl: string = "/assets/views/item.html";

        transclude: any = false;

        replace: boolean = false;

        scope: any = false;

        link: Function = function(scope, element, attr, ngModel) {};
    }
}