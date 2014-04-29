///<reference path='../../typings/tsd.d.ts' />

module directives {
    'use strict';

    export interface ResizeScope extends ng.IScope {
        windowHeight: number;
        windowWidth: number;

        getWindowSize();
    }
    export class Resize implements ng.IDirective {
        restrict:string = "A";
        link:(scope:ResizeScope, element:any, attrs:ng.IAttributes) => any;

        constructor(private $window:ng.IWindowService) {

            this.link = (scope:ResizeScope, element:any, attrs:ng.IAttributes)=> {
                var window = angular.element(this.$window);

                scope.getWindowSize = ()=> {
                    return {height: window.height(), width: window.width()};
                };

                scope.$watch(scope.getWindowSize, (newValue, oldValue)=> {
                    scope.windowHeight = newValue.height;
                    scope.windowWidth = newValue.width;
                }, true);

                window.bind("resize", ()=> {
                    if(!scope.$$phase){
                        scope.$apply();
                    }
                })
            }
        }
    }
}
angular.module('sidekick-note.directive')
    .directive('kickResize', ["$window", ($window) => new directives.Resize($window)]);
