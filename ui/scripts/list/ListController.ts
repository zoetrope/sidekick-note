///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='../services/ApiService.ts' />
///<reference path='../application/UserSetting.ts' />
///<reference path='../common/Item.ts' />
///<reference path='../sidebar/SearchCondition.ts' />


module controllers {
    'use strict';

    export interface ListParam extends ng.route.IRouteParamsService {
        id: number;
    }

    export interface ListScope extends ng.IScope {
        item: models.Item;
        items: models.Item[];

        setting: models.UserSetting;
        addItem: Function;

        updateItem: Function;
        types: string[];
        statuses: {key?: string[]};
    }

    export class ListController {
        constructor(private $scope:ListScope, $routeParams:ListParam, private $location:ng.ILocationService, private apiService:services.ApiService) {
            if ($routeParams.id) {
                console.log("list id = " + $routeParams.id);
                apiService.Criterion.get({id: $routeParams.id}, (criterion : models.Criterion)=>{

                    console.log("criteria = " + angular.toJson(criterion));
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
                            console.log("items = " + data.length);
                            this.$scope.items = data.map((item)=>{
                                if (!item.title) {
                                    item.title = item.content.substr(0, 80);
                                    if(item.content.length > 80){
                                        item.title += "...";
                                    }
                                }
                                return item;
                            });
                        },
                        (err)=>{

                        });
                });
            } else {
                $scope.setting.showMode = "edit";
                console.log("new item");
            }

        }


    }
}

angular.module('sidekick-note.controller')
    .controller("ListController", ["$scope", '$routeParams', "$location", "apiService",
        ($scope:controllers.ListScope, $routeParams:controllers.ListParam, $location:ng.ILocationService, apiService:services.ApiService):controllers.ListController => {
            return new controllers.ListController($scope, $routeParams, $location, apiService)
        }]);