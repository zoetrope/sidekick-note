///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../home/ApiService.ts' />
///<reference path='../home/UserSetting.ts' />

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
    }

    export class ApplicationController {

        constructor(public $scope:AppScope, public $location:ng.ILocationService, public apiService:services.ApiService, public $timeout:ng.ITimeoutService) {

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
                'closeOniSelect': true,
                'createSearchChoice': null,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.updateTags = angular.bind(this, this.updateTags);
            this.updateTags();
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
    }
}

angular.module('sidekick-note.controller')
    .controller("ApplicationController", ["$scope", "$location", "apiService", "$timeout",
        ($scope:controllers.AppScope, $location:ng.ILocationService, apiService:services.ApiService, $timeout:ng.ITimeoutService):controllers.ApplicationController => {
            return new controllers.ApplicationController($scope, $location, apiService, $timeout)
        }]);