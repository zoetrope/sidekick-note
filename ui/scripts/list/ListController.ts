///<reference path='../../typings/tsd.d.ts' />

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

        updateStatus: Function;
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

                    this.$scope.items = [];
                    this.apiService.Items.query(param,
                        (data)=>{
                            console.log("item.length = " + data.length);
                            this.$scope.items = data.map((item)=>{
                                if (!item.title) {
                                    item.title = item.content.substr(0, 80);
                                    if(item.content.length > 80){
                                        item.title += "...";
                                    }
                                }
                                return item;
                            });
                            console.log("items.length = " + this.$scope.items.length);
                        },
                        (err)=>{

                        });
                });
            } else {
                $scope.setting.showMode = "edit";
                console.log("new item");
            }

            $scope.statuses = {
                "Task": ["New", "Accepted", "Completed"],
                "Article": ["Writing", "Viewing", "Archived"],
                "QuickNote": ["Flowing", "Archived"]
            };


            $scope.updateStatus = angular.bind(this, this.updateStatus);
        }

        updateStatus(item, status) {
            console.log(status);
            //TODO: エラー処理
            this.apiService.Item.update({id: item._id}, {status: status}, data=>{
                //リロードしてリストを更新すべき？
            });
        }

    }
}

angular.module('sidekick-note.controller')
    .controller("ListController", ["$scope", '$routeParams', "$location", "apiService",
        ($scope:controllers.ListScope, $routeParams:controllers.ListParam, $location:ng.ILocationService, apiService:services.ApiService):controllers.ListController => {
            return new controllers.ListController($scope, $routeParams, $location, apiService)
        }]);