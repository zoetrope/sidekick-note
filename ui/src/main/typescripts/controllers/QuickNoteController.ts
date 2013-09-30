///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/QuickNote.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export class TagForm {
        id : number;
        text : string;
    }
    export interface QuickNoteScope extends ng.IScope {
        // input
        inputContent: string;
        selectedTags: TagForm[];
        rate: number;

        // output
        quickNotes: models.QuickNote[];

        // state
        sending : Boolean;
        hasFocus : Boolean;
        enablePreview : Boolean;

        select2Options : any;
        allTags : string[];

        // action
        addQuickNote() : void;
        toMarkdown(input: string) : string;

        // event
        keypress($event : ng.IAngularEvent) : void;
    }

    export class QuickNoteController {

        constructor(public $scope:QuickNoteScope, public $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) {
            $scope.hasFocus = true
            $scope.sending = false
            $scope.enablePreview = false
            $scope.rate = 1

            $scope.selectedTags = []
            $scope.select2Options = {
                'multiple': true,
                'simple_tags': true,
                'tags': () => {
                    return $scope.allTags;
                }
            };
            var Tags = $resource("/api/tags")
            Tags.query(data => {
                $scope.allTags = data.map(tag => {return {"id": tag.name, "text": tag.name}})
            });

            var QuickNotes = $resource("/api/quick_notes")

            $scope.toMarkdown = input => {
                return itemRenderService.render(input)
            }

            $scope.addQuickNote = () => {
                $scope.sending = true
                $scope.hasFocus = false

                QuickNotes.save(null, {
                        content: $scope.inputContent,
                        tags: $scope.selectedTags.map(tag=> tag.text),
                        rate: $scope.rate
                    },
                    (data)=> {
                        $scope.quickNotes.unshift(data)
                        if($scope.quickNotes.length > 5){
                            $scope.quickNotes.pop()
                        }
                        $scope.inputContent = ""
                        $scope.sending = false
                        $scope.hasFocus = true
                    },
                    (reason)=> {
                        alert("error add QuickNote")
                        $scope.sending = false
                        $scope.hasFocus = true
                    })
            };

            QuickNotes.query(
                (data)=> {
                    $scope.quickNotes = data
                },
                (reason)=> {
                    alert("error get QuickNotes")
                });

            $scope.keypress = ($event : ng.IAngularEvent) => {
                $scope.addQuickNote()
                $event.preventDefault()
            };

        }

    }
}