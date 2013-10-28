///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../models/QuickNote.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module controllers {
    'use strict';

    export interface QuickNoteScope extends ng.IScope {
        // input
        inputContent: string;
        selectedTags: string[];
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
        addQuickNote : Function;
        updateQuickNote : Function;
        toMarkdown(input: string) : string;

        // event
        keypress($event : ng.IAngularEvent) : void;

        getComfortableRowNumber(content:string) : number;
    }

    export class QuickNoteController {

        quickNoteResource:services.IUpdatableResourceClass;
        quickNotesResource:ng.resource.IResourceClass;
        tagsResource:ng.resource.IResourceClass;

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

            this.quickNotesResource = this.$resource("/api/quick_notes")
            this.quickNoteResource = <services.IUpdatableResourceClass>this.$resource("/api/quick_notes/:itemId", {}, {update: {method: 'PUT'}})
            this.tagsResource = $resource("/api/tags")

            this.tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            $scope.toMarkdown = input => itemRenderService.render(input)
            $scope.addQuickNote = angular.bind(this, this.addQuickNote)
            $scope.updateQuickNote = angular.bind(this, this.updateQuickNote)


            this.quickNotesResource.query(
                (data)=> {
                    $scope.quickNotes = data.map(x=>{x.renderedContent = $scope.toMarkdown(x.content); return x})
                },
                (reason)=> {
                    alert("error get QuickNotes")
                });

            $scope.keypress = ($event : ng.IAngularEvent) => {
                $scope.addQuickNote()
                $event.preventDefault()
            };

            //TODO: Taskと共通化すべき
            $scope.getComfortableRowNumber = (content:string) => {
                var rows = 3;
                var match_str = content.match(/\n/g);
                if (match_str) {
                    rows += match_str.length;
                }
                if (rows > 40) {
                    rows = 40;
                }
                return rows;
            };
        }


        addQuickNote() {
            this.$scope.sending = true
            this.$scope.hasFocus = false

            this.quickNotesResource.save(null, {
                    content: this.$scope.inputContent,
                    tags: this.$scope.selectedTags,
                    rate: this.$scope.rate
                },
                (data)=> {
                    data.renderedContent = this.$scope.toMarkdown(data.content)
                    this.$scope.quickNotes.unshift(data)
                    if(this.$scope.quickNotes.length > 5){
                        this.$scope.quickNotes.pop()
                    }
                    this.$scope.inputContent = ""
                    this.$scope.sending = false
                    this.$scope.hasFocus = true
                },
                (reason)=> {
                    alert("error add QuickNote")
                    this.$scope.sending = false
                    this.$scope.hasFocus = true
                })
        }

        updateQuickNote(note: models.QuickNote) {
            var index = this.$scope.quickNotes.indexOf(note)
            this.$scope.quickNotes[index].editable = false;

            this.quickNoteResource.update({itemId: this.$scope.quickNotes[index].itemId}, {
                content: this.$scope.quickNotes[index].content,
                tags: this.$scope.quickNotes[index].tags,
                rate: this.$scope.quickNotes[index].rate
            }, data=>{
                var index = this.$scope.quickNotes.indexOf(note)
                this.$scope.quickNotes[index].renderedContent = this.$scope.toMarkdown(data.content)
            }, reason=>{
                alert("update ng");
                var index = this.$scope.quickNotes.indexOf(note) // 更新処理が返ってくるまでの間にindexが変わってしまう可能性を考慮
                this.$scope.quickNotes[index].editable = true;
            })
        }

    }
}