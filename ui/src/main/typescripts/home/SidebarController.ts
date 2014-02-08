///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='SearchCondition.ts' />
///<reference path='../common/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface SidebarScope extends ng.IScope {


        current : models.Criterion;

        searchSelectOptions : any;
        allTags : string[];
        types: string[];
        statuses: {key?: string[]
        };


        criteria : models.Criterion[];

        search : Function;
        addCriterion : Function;

        activeTab: any;

        items: any[];
    }

    export class SidebarController {

        constructor(private $scope:controllers.SidebarScope, private apiService:services.ApiService) {

            $scope.current = new models.Criterion();
            $scope.current.name = "";
            $scope.current.param = new models.CriterionParam();
            $scope.current.param.keywords = "";
            $scope.current.param.tags = [];
            $scope.current.param.type = "All";
            $scope.current.param.status = "All";
            $scope.current.sortOrder = 0;

            $scope.types = ["All", "Task", "Article", "QuickNote"];

            $scope.statuses = {
                "All": ["All", "New", "Accepted", "Completed", "Writing", "Viewing", "Archived", "Flowing"],
                "Task": ["All", "New", "Accepted", "Completed"],
                "Article": ["All", "Writing", "Viewing", "Archived"],
                "QuickNote": ["All", "Flowing", "Archived"]
            };

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

            apiService.Tags.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            $scope.search = angular.bind(this, this.search);

            $scope.addCriterion = angular.bind(this, this.addCriterion);

            $scope.activeTab = {
                one: true,
                two: false
            };
        }


        updateCriteria() {
            /*
             this.searchCriteriaResource.query({target: this.$scope.targetType},
             data => {
             this.$scope.searchCriteria = data
             }, reason => console.log(reason));
             */
        }

        search(criterion: models.Criterion) {

            this.$scope.activeTab.two = true;
            //this.$scope.$emit("search." + this.$scope.current.type, query);

            var param = criterion.param;
            if(param.status === "All" || param.status === "") {
                delete param.status;
            }
            if(param.type === "All" || param.type === "") {
                delete param.type;
            }
            if(param.keywords === "") {
                delete param.keywords;
            }
            if(param.tags === []) {
                delete param.tags;
            }

            this.apiService.Items.query(param,
                (data)=>{
                    this.$scope.items = data;
                },
                (err)=>{

                });

        }

        addCriterion(criterion) {
            this.apiService.Criterion.save(null, criterion,
                (data)=> {
                    this.$scope.criteria.push(data)
                },
                (reason)=> {
                    console.log("error addSearchCriterion");
                });

        }

    }
}


angular.module('sidekick-note.controller')
    .controller("SidebarController", ["$scope", "apiService",
        ($scope:controllers.SidebarScope, apiService:services.ApiService):controllers.SidebarController => {
            return new controllers.SidebarController($scope, apiService);
        }]);
