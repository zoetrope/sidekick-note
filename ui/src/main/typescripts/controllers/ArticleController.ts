///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Article.ts' />
///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface ArticleScope extends ng.IScope {
    }

    export class ArticleController {

        constructor(public $scope:ArticleScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {

        }

    }
}