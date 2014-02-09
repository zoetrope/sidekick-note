///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface NewItemScope extends ng.IScope {
        item: any;

        showMode: string;
        addItem: Function;
    }

    export class NewItemController {
        constructor(private $scope:NewItemScope, private $location:ng.ILocationService, private apiService:services.ApiService) {

            $scope.showMode = "edit"; //TODO: AppControllerに変更が伝わらない。

            $scope.addItem = angular.bind(this, this.addItem);
        }

        addItem(item){
            this.apiService.Items.save(null, item, data=>{
                console.log(data);
                this.$location.path("/items/" + data._id);
            });

        }

    }
}

angular.module('sidekick-note.controller')
    .controller("NewItemController", ["$scope", "$location", "apiService",
        ($scope:controllers.NewItemScope, $location:ng.ILocationService, apiService:services.ApiService):controllers.NewItemController => {
            return new controllers.NewItemController($scope, $location, apiService)
        }]);