///<reference path='../../typings/tsd.d.ts' />

module directives {
    'use strict';

    export class ItemDirective implements ng.IDirective {
        restrict: string = "E";

        templateUrl: string = "/views/item.tpl.html";

        transclude: any = false;

        replace: boolean = false;

        scope: any = false;

    }
}
angular.module('sidekick-note.directive')
    .directive('kickItem', () => new directives.ItemDirective());
