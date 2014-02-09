///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module filters {
    'use strict';

    declare var hljs:any

    export function MarkdownFilterFactory($sce: ng.ISCEService): Function{
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            highlight: function (code, lang) {
                try{
                    return hljs.highlight(lang, code).value;
                } catch(err) {
                    return hljs.highlightAuto(code).value;
                }
            }
        });

        return (input:string, param: string)=> {
            if (input) {
                return $sce.trustAsHtml(marked(input))
            } else {
                return ""
            }
        };
    }
}

angular.module("sidekick-note.filter")
    .filter("markdown", ["$sce", ($sce: ng.ISCEService):Function=> {
        return filters.MarkdownFilterFactory($sce);
    }]);
