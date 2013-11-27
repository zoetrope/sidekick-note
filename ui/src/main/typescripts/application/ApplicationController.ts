///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

module controllers {
    'use strict';

    export interface AppScope extends ng.IScope {
        input_name: string;
        input_password: string;

        loggedin: string;

        login: Function;
        logout: Function;
        isActive: Function;
    }

    export class ApplicationController {

        constructor(public $scope:AppScope, public $location:ng.ILocationService, public $resource:ng.resource.IResourceService, public $timeout:ng.ITimeoutService) {

            this.Auth = $resource("/api/login")
            this.LoggedIn = $resource("/api/loggedin")
            this.Logout = $resource("/api/logout")

            this.LoggedIn.get(x=>$scope.loggedin = x.name, reason => console.log(reason))

            var tick = () => {
                this.LoggedIn.get(data=>{
                    this.$timeout(tick, 60000);
                },reason => console.log(reason));
            }
            tick();

            $scope.login = angular.bind(this, this.login)
            $scope.logout = angular.bind(this, this.logout)
            $scope.isActive = angular.bind(this, this.isActive)
        }

        Auth:ng.resource.IResourceClass;
        LoggedIn:ng.resource.IResourceClass;
        Logout:ng.resource.IResourceClass;

        isActive(path:string):boolean {
            return this.$location.path() == path
        }


        login() {
            var input = {name: this.$scope.input_name, password: this.$scope.input_password}
            this.Auth.save(null, input, (data)=> {
                console.log(data.url);
                //alert(data);
                //$scope.loggedin = $scope.input_name
                this.$scope.loggedin = data.url
                window.location.href = data.url;

            }, (reason)=> {
                console.log("failed login." + reason)
            });
        }

        logout() {
            this.Logout.get(_=> {
                this.$scope.loggedin = ""
                window.location.href = "/login";
            })
        }
    }
}