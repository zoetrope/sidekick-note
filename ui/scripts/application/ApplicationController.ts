///<reference path='../../typings/tsd.d.ts' />
///<reference path='../services/ApiService.ts' />
///<reference path='UserSetting.ts' />
///<reference path='FilteringParameter.ts' />
///<reference path='../search/SearchController.ts' />

module controllers {
    'use strict';

    export interface AppScope extends ng.IScope {
        input_name: string;
        input_password: string;

        loggedin: string;

        login: Function;
        logout: Function;
        isActive: Function;

        tagsSelectOption : any;
        allTags : string[];

        updateTags : Function;
        setting: models.UserSetting;

        filteringParam: models.FilteringParameter;

        openSearchDialog: Function;
    }

    export class ApplicationController {

        constructor(public $scope:AppScope, public $location:ng.ILocationService, public apiService:services.ApiService, public $timeout:ng.ITimeoutService, private $modal: any) {

            this.apiService.LoggedIn.get(x=>$scope.loggedin = x.name, reason => console.log(reason))

            var tick = () => {
                this.apiService.LoggedIn.get(data=>{
                    this.$timeout(tick, 60000);
                },reason => console.log(reason));
            };
            tick();

            $scope.login = angular.bind(this, this.login);
            $scope.logout = angular.bind(this, this.logout);
            $scope.isActive = angular.bind(this, this.isActive)

            $scope.setting = new models.UserSetting();
            $scope.setting.showSidebar = true;
            $scope.setting.showMode = "view";

            $scope.tagsSelectOption = {
                'multiple': true,
                'simple_tags': true,
                'allowClear': true,
                'closeOnSelect': true,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.updateTags = angular.bind(this, this.updateTags);
            this.updateTags();

            $scope.filteringParam = new models.FilteringParameter();

            $scope.openSearchDialog = angular.bind(this, this.openSearchDialog);
        }

        updateTags(){
            this.apiService.Tags.query(data => {
                this.$scope.allTags = data.map(tag => tag.name)
            });
        }

        isActive(path:string):boolean {
            return this.$location.path() == path
        }


        login() {
            var input = {name: this.$scope.input_name, password: this.$scope.input_password};
            this.apiService.Auth.save(null, input, (data)=> {
                console.log(data.url);
                //alert(data);
                //$scope.loggedin = $scope.input_name
                this.$scope.loggedin = data.url;
                window.location.href = data.url;

            }, (reason)=> {
                console.log("failed login." + reason)
            });
        }

        logout() {
            this.apiService.Logout.get(_=> {
                this.$scope.loggedin = "";
                window.location.href = "/login";
            })
        }

        openSearchDialog(){
            this.$modal.open({
               templateUrl: '/views/search.tpl.html',
                controller: controllers.SearchController
            });
        }
    }
}

angular.module('sidekick-note.controller')
    .controller("ApplicationController", ["$scope", "$location", "apiService", "$timeout", "$modal",
        ($scope:controllers.AppScope, $location:ng.ILocationService, apiService:services.ApiService, $timeout:ng.ITimeoutService, $modal: any):controllers.ApplicationController => {
            return new controllers.ApplicationController($scope, $location, apiService, $timeout, $modal)
        }]);