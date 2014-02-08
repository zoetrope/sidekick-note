///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module services {
    'use strict';

    export class ApiService {

        Items:ng.resource.IResourceClass;
        Item:services.IUpdatableResourceClass;

        Tags:ng.resource.IResourceClass;

        Criteria:ng.resource.IResourceClass;
        Criterion:services.IUpdatableResourceClass;

        constructor($resource:ng.resource.IResourceService) {
            this.Items = $resource("/api/items");

            this.Item = <services.IUpdatableResourceClass>
                $resource("/api/items/:id", {}, {update: {method: 'PUT'}});

            this.Tags = $resource("/api/tags");

            this.Criteria = $resource("/api/criteria");

            this.Criterion = <services.IUpdatableResourceClass>
                $resource("/api/criteria/:id", {}, {update: {method: 'PUT'}});
        }

    }
}

angular.module("sidekick-note.service")
    .factory("apiService", ["$resource", ($resource:ng.resource.IResourceService):services.ApiService=> {
        return new services.ApiService($resource);
    }]);