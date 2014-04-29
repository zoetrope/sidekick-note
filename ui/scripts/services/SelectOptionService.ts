///<reference path='../../typings/tsd.d.ts' />

module services {
    'use strict';

    export class SelectOptionService {
        allTags: String[];

        constructor(private apiService:services.ApiService){

            this.updateTags();
        }

        getOption(){
            return {
                'multiple': true,
                'simple_tags': true,
                'allowClear': true,
                'closeOnSelect': true,
                'createSearchChoice': null,
                'tags': () => {
                    return this.allTags;
                }
            };
        }

        updateTags(){
            this.apiService.Tags.query(data => {
                this.allTags = data.map(tag => tag.name)
            });
        }
    }
}
angular.module("sidekick-note.service")
    .factory("selectOptionService", ["apiService", (apiService:services.ApiService):services.SelectOptionService=> {
        return new services.SelectOptionService(apiService);
    }]);
