///<reference path='../../typings/tsd.d.ts' />

module filters {
    'use strict';

    declare var hljs:any

    export function MarkdownFilterFactory($sce:ng.ISCEService):Function {
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            highlight: function (code, lang) {
                try {
                    return hljs.highlight(lang, code).value;
                } catch (err) {
                    return hljs.highlightAuto(code).value;
                }
            }
        });

        var renderer = new (<any>marked).Renderer();
        renderer.table = function(header, body) {
            return '<table class="table table-bordered table-striped">\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + '<tbody>\n'
                + body
                + '</tbody>\n'
                + '</table>\n';
        };

        return (input:string, param:string)=> {
            if (input) {
                return $sce.trustAsHtml(marked(input, {renderer: renderer}))
            } else {
                return ""
            }
        };
    }
}

angular.module("sidekick-note.filter")
    .filter("markdown", ["$sce", ($sce:ng.ISCEService):Function=> {
        return filters.MarkdownFilterFactory($sce);
    }]);
