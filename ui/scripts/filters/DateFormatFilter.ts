///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/moment/moment.d.ts' />

module filters {
    'use strict';

    export function MomentFilterFactory(): Function{
        moment.lang("ja");
        return (input:string, param: string)=> {
            return moment(input).format(param);
        };
    }
}

angular.module("sidekick-note.filter")
    .filter("moment", [():Function=> {
        return filters.MomentFilterFactory();
    }]);
