///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path="../../../d.ts/DefinitelyTyped/marked/marked.d.ts" />

module services {
    'use strict';

    declare var hljs:any

    export class ItemRenderService {

        constructor() {
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
                return marked(input)
            } else {
                return ""
            }
        }
    }
}