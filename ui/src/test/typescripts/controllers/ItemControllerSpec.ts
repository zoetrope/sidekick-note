///<reference path='../../../d.ts/DefinitelyTyped/jasmine/jasmine.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-mocks.d.ts' />

///<reference path='../../../main/typescripts/App.ts' />

'use strict';

describe("Controllerの", ()=> {
    var $injector:ng.auto.IInjectorService;
    beforeEach(()=> {
        $injector = angular.injector(['ngMock', App.appName + '.service']);
    });

    describe("Sample.TestControllerの", ()=> {
        var $scope:controllers.ItemScope;
        var $controller:ng.IControllerService;
        var $resource:ng.resource.IResourceService

        beforeEach(()=> {
            $resource = $injector.get("$resource");
            $controller = $injector.get("$controller");

            $scope = <any> $injector.get("$rootScope").$new();
        });

        it("Controllerの作成", ()=> {
            var controller:controllers.ItemController = $controller(controllers.ItemController, {
                $scope: $scope,
                $routeParams: {
                    domain: "topgate.co.jp"
                }
            });
            expect($scope.hasFocus).toBe(true);
        });
    });
});