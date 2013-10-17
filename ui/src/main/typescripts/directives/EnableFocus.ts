///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />

module directives {
    'use strict';

    export class EnableFocus implements ng.IDirective {
        restrict:string = "A";
        link: Function = function(scope, element, attrs) {
            scope.$watch(attrs.kickFocus, autofocus => {
                if (autofocus) {
                    setTimeout(function () {
                        element[0].focus()
                    }, 0)
                }
            })
        };
    }
}