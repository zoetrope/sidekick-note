///<reference path='../../typings/tsd.d.ts' />

module services {
    'use strict';

    declare var hljs:any

    export class ItemRenderService {

        constructor(public $sce : any) {
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
        }

        render(input:string):string {
            //console.log(input)
            if (input) {
                return this.$sce.trustAsHtml(marked(input))
            } else {
                return ""
            }
        }
    }
}

angular.module("sidekick-note.service")
    .factory("itemRenderService", ["$sce", ($sce):services.ItemRenderService=> {
        return new services.ItemRenderService($sce);
    }]);
