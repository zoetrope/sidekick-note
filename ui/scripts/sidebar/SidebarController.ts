///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='SearchCondition.ts' />
///<reference path='../common/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='../services/ApiService.ts' />

module controllers {
    'use strict';

    export interface SidebarScope extends ng.IScope {
        current : models.Criterion;
        criteria : models.Criterion[];

        search : Function;
        addCriterion : Function;

        activeAccordion: any;

        items: any[];
        types: string[];
        statuses: {key?: string[]};

        tagsSelectOption : any;
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

            $scope.criteria = [];

            $scope.search = angular.bind(this, this.search);

            $scope.addCriterion = angular.bind(this, this.addCriterion);

            $scope.activeAccordion = {
                menu: true,
                list: false,
                criterion: false
            };

            this.updateCriteria();

            // 存在しないタグを追加できないように。
            $scope.tagsSelectOption.createSearchChoice = null;

            $scope.types = ["All", "Task", "Article", "QuickNote"];

            $scope.statuses = {
                "All": ["All", "New", "Accepted", "Completed", "Writing", "Viewing", "Archived", "Flowing"],
                "Task": ["All", "New", "Accepted", "Completed"],
                "Article": ["All", "Writing", "Viewing", "Archived"],
                "QuickNote": ["All", "Flowing", "Archived"]
            };
        }

        updateCriteria() {
            this.apiService.Criterion.query(null,
                data => {
                    console.log("updateCriteria = " + angular.toJson(data));
                    this.$scope.criteria = data;
                }, reason => console.log(reason));

        }

        search(criterion: models.Criterion) {

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
                    this.$scope.activeAccordion.list = true;
                },
                (err)=>{

                });

        }

        addCriterion(criterion) {
            console.log("add criterion");
            this.apiService.Criteria.save(null, criterion,
                (data)=> {
                    this.updateCriteria();
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
