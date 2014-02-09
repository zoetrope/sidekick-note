///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='../services/ItemRenderService.ts' />
///<reference path='./ApiService.ts' />

module controllers {
    'use strict';

    export interface ItemParam extends ng.route.IRouteParamsService {
        id: number;
    }

    export interface ItemScope extends ng.IScope {
        item: any;

        showMode: string;
    }

    export class ItemController {
        constructor(private $scope:ItemScope, $routeParams:ItemParam, private $location:ng.ILocationService, private apiService:services.ApiService) {

            if ($routeParams.id) {
                apiService.Item.get({id: $routeParams.id},
                    (data)=> {
                        $scope.item = data;
                    },
                    (err)=> {

                    });
            }

            $scope.showMode = "edit";
        }

        addItem(item){
            this.apiService.Items.save(null, item, data=>{
                this.$location.path()
            });

        }

        updateItem(item){
            this.apiService.Item.update({id: item.id}, item, data=>{

            });
        }

    }
}

angular.module('sidekick-note.controller')
    .controller("ItemController", ["$scope", '$routeParams', "$location", "apiService",
        ($scope:controllers.ItemScope, $routeParams:controllers.ItemParam, $location:ng.ILocationService, apiService:services.ApiService):controllers.ItemController => {
            return new controllers.ItemController($scope, $routeParams, $location, apiService)
        }]);