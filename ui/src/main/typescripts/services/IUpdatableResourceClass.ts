
module services {
    'use strict';

    export interface IUpdatableResourceClass extends ng.resource.IResourceClass  {
        update: ng.resource.IActionCall;
    }
}