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
        criteria : models.Criterion[];

        search : Function;
        addCriterion : Function;

        activeAccordion: any;

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

            $scope.search = angular.bind(this, this.search);

            $scope.addCriterion = angular.bind(this, this.addCriterion);

            $scope.activeAccordion = {
                one: false,
                two: false,
                three: true
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
                    this.$scope.activeAccordion.three = true;
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
