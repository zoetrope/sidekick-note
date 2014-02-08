///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='Article.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module controllers {
    'use strict';

    export interface ArticleScope extends ng.IScope {

        searchSelectedTags: string[];
        searchSelectOptions : any;

        // input
        content: string;
        tags: string[];
        rate: number;
        title: string;

        itemId: number;

        // output
        titles: models.Title[];

        // state
        sending : Boolean;
        hasFocus : Boolean;

        inputSelectOptions : any;
        allTags : string[];

        // action
        toMarkdown(input:string) : string;
        addArticle : Function;
        loadArticle : Function;
        updateArticle : Function;
        searchArticle : Function;

        // event
        keypress($event:ng.IAngularEvent) : void;

        isCollapsed: Boolean;
    }

    export class ArticleController {

        constructor(public $scope:ArticleScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {

            $scope.isCollapsed = false

            $scope.rate = 1
            $scope.title = ""

            $scope.searchSelectedTags = []
            $scope.searchSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'allowClear': true,
                'closeOnSelect': false,
                'createSearchChoice': null,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.tags = []
            $scope.inputSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.toMarkdown = input => itemRenderService.render(input)
            $scope.addArticle = angular.bind(this, this.addArticle)
            $scope.loadArticle = angular.bind(this, this.loadArticle)
            $scope.updateArticle = angular.bind(this, this.updateArticle)
            $scope.searchArticle = angular.bind(this, this.searchArticle)

            this.articlesResource = this.$resource("/api/articles")
            this.titlesResource = this.$resource("/api/articles/titles")
            this.articleResource = <services.IUpdatableResourceClass>this.$resource("/api/articles/:itemId", {}, {update: {method: 'PUT'}})
            this.tagsResource = $resource("/api/tags")
            this.searchArticlesResource = $resource("/api/articles/search")

            this.tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            this.titlesResource.query(
                (data)=> {
                    $scope.titles = data
                },
                (reason)=> {
                    console.log("error get articles: " + reason)
                });
        }

        articleResource:services.IUpdatableResourceClass;
        articlesResource:ng.resource.IResourceClass;
        titlesResource:ng.resource.IResourceClass;
        tagsResource:ng.resource.IResourceClass;
        searchArticlesResource:ng.resource.IResourceClass;

        addArticle() {
            this.$scope.sending = true;
            this.$scope.hasFocus = false;

            this.articlesResource.save(null, {
                    content: "",
                    rate: 1,
                    tags: [],
                    title: "untitled"
                },
                (data)=> {
                    this.$scope.sending = false;
                    this.$scope.hasFocus = true;
                    this.$scope.itemId = data.itemId
                    this.$scope.title = data.title
                },
                (reason)=> {
                    console.log("error add Article: " + reason);
                    this.$scope.sending = false;
                    this.$scope.hasFocus = true;
                })
        }

        loadArticle(id: number) {
            this.articleResource.get({itemId: id}, {},
                (data)=> {
                    this.$scope.itemId = data.itemId
                    this.$scope.title = data.title
                    this.$scope.content = data.content
                    this.$scope.rate = data.rate
                    this.$scope.tags = data.tags
                },
                (reason)=> {
                    console.log("error load article: " + reason)
                });
        }

        updateArticle() {
            this.articleResource.update({itemId: this.$scope.itemId}, {
                content: this.$scope.content,
                tags: this.$scope.tags,
                rate: this.$scope.rate,
                title: this.$scope.title
            }, data=>{}, reason=>{
                console.log("update ng: " + reason);
            })
        }

        searchArticle() {
            var tags = this.$scope.searchSelectedTags.join(" ")
            if (tags) {
                this.searchArticlesResource.query({tags: tags},
                    (data)=> {
                        this.$scope.titles = data
                    },
                    (reason)=> {
                        console.log("search ng: " + reason)
                    });
            }
        }

    }
}

angular.module('sidekick-note.controller')
    .controller("ArticleController", ["$scope", "$resource", "itemRenderService",
        ($scope:controllers.ArticleScope, $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) : controllers.ArticleController => {
            return new controllers.ArticleController($scope, $resource, itemRenderService)
        }]);
