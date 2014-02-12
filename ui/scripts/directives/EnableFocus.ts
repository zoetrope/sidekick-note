///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module directives {
    'use strict';

    export class EnableFocus implements ng.IDirective {
        restrict:string = "A";

        link(scope: ng.IScope, element: any, attrs: ng.IAttributes, controller: any) {
            scope.$watch(attrs["kickFocus"], autofocus => {
                if (autofocus) {
                    setTimeout(function () {
                        element[0].focus()
                    }, 0)
                }
            })
        }
    }
}

angular.module('sidekick-note.directive')
    .directive('kickFocus', () => new directives.EnableFocus());
