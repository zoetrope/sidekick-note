///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../services/ItemRenderService.ts' />
///<reference path='../models/Item.ts' />
///<reference path='../controllers/SearchParam.ts' />

module controllers {
    'use strict';

    export interface SearchScope extends ng.IScope {

        searchWords: string;
        searchSelectedTags: string[];
        searchSelectOptions : any;
        allTags : string[];

        items: models.Item[];

        search : Function;
        searching : Boolean;
        keypress($event : ng.IAngularEvent) : void;
        hasFocus : Boolean;

        totalItems : number;
        currentPage : number;
        numPages : number;
        maxSize : number;

        changePage(page: number) : void;
    }

    export class SearchController {

        constructor(public $scope:SearchScope, public $resource:ng.resource.IResourceService, public $location:ng.ILocationService, public itemRenderService:services.ItemRenderService) {


            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.numPages = 10;
            $scope.maxSize = 10;
            $scope.changePage = (page:number)=>{
                this.search(page)
            }

            this.countResource = $resource("/api/items/count")

            $scope.searchWords = ""

            $scope.searchSelectedTags = []
            $scope.searchSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'allowClear': true,
                'closeOnSelect': true,
                'createSearchChoice': null,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.hasFocus = true;
            $scope.searching = false

            $scope.search = angular.bind(this, this.search)

            $scope.keypress = ($event : ng.IAngularEvent) => {
                this.search(1)
                $event.preventDefault();
            };

            var tagsResource = $resource("/api/tags")

            tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            this.itemsResource = this.$resource("/api/items/search")
        }

        itemsResource:ng.resource.IResourceClass;
        countResource:ng.resource.IResourceClass;

        search(page: number) {

            this.$scope.searching = true
            this.$scope.hasFocus = false

            var tags = this.$scope.searchSelectedTags.join(" ")
            var words = this.$scope.searchWords;
            this.$scope.currentPage = page

            this.countResource.get({words: words, tags: tags},
                (data)=>{
                    this.$scope.totalItems = data.count;
                    this.$scope.numPages = Math.ceil(this.$scope.totalItems / 20)
                },
                (reason)=>{

                });

            //this.$location.search({page: page, words: words, tags:tags})

            this.itemsResource.query({page: page, words: words, tags: tags},
                (data)=> {
                    this.$scope.items = data.map(x=>{x.content = this.itemRenderService.render(x.content); return x})
                    this.$scope.searching = false
                    this.$scope.hasFocus = true;
                    //TODO: URLの変更

                },
                (reason)=> {
                    alert("error get items : " + reason)
                    this.$scope.searching = false
                    this.$scope.hasFocus = true;
                });
        }

    }
}