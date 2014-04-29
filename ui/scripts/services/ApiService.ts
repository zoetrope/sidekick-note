///<reference path='../../typings/tsd.d.ts' />
///<reference path='IUpdatableResourceClass.ts' />

module services {
    'use strict';

    export class ApiService {

        Items:ng.resource.IResourceClass<models.Item>;
        Item:services.IUpdatableResourceClass<models.Item>;

        Tags:ng.resource.IResourceClass<models.Tag>;

        Criteria:ng.resource.IResourceClass<models.Criterion>;
        Criterion:services.IUpdatableResourceClass<models.Criterion>;

        Auth:ng.resource.IResourceClass<any>;
        LoggedIn:ng.resource.IResourceClass<any>;
        Logout:ng.resource.IResourceClass<any>;

        constructor($resource:ng.resource.IResourceService) {
            this.Items = $resource<models.Item>("/api/items");

            this.Item = <services.IUpdatableResourceClass<models.Item>>
                $resource<models.Item>("/api/items/:id", {}, {update: {method: 'PUT'}});

            this.Tags = $resource<models.Tag>("/api/tags");

            this.Criteria = $resource<models.Criterion>("/api/criteria");

            this.Criterion = <services.IUpdatableResourceClass<models.Criterion>>
                $resource<models.Criterion>("/api/criteria/:id", {}, {update: {method: 'PUT'}});

            this.Auth = $resource<any>("/api/login");
            this.LoggedIn = $resource<any>("/api/loggedin")
            this.Logout = $resource<any>("/api/logout")
        }
    }
}

angular.module("sidekick-note.service")
    .factory("apiService", ["$resource", ($resource:ng.resource.IResourceService):services.ApiService=> {
        return new services.ApiService($resource);
    }]);
