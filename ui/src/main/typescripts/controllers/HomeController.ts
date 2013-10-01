///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export class Tab {
        constructor(public title: String, public active: Boolean){

        }
    }
    export interface HomeScope extends ng.IScope {
        tabs: Tab[];
        addTab(): void;
    }

    export class HomeController {

        constructor(public $scope:HomeScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {
            $scope.tabs = [new Tab("test1",true),new Tab("test2",false),new Tab("hoge",false)]

            $scope.addTab = () =>{
                $scope.tabs.push(new Tab("abc", false))
            }
        }

    }
}