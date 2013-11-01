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
        inputSelectedTags: string[];
        rate: number;

        // output
        quickNotes: models.QuickNote[];

        // state
        sending : Boolean;
        hasFocus : Boolean;
        enablePreview : Boolean;

        inputSelectOptions : any;
        allTags : string[];

        // action
        addQuickNote : Function;
        toMarkdown(input: string) : string;

        // event
        keypress($event : ng.IAngularEvent) : void;

        getComfortableRowNumber(content:string) : number;
    }

    export class QuickNoteController {

        quickNotesResource:ng.resource.IResourceClass;
        tagsResource:ng.resource.IResourceClass;

        constructor(public $scope:QuickNoteScope, public $resource:ng.resource.IResourceService, itemRenderService:services.ItemRenderService) {
            $scope.hasFocus = true
            $scope.sending = false
            $scope.enablePreview = false
            $scope.rate = 1

            $scope.inputSelectedTags = []
            $scope.inputSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            this.quickNotesResource = this.$resource("/api/quick_notes")
            this.tagsResource = $resource("/api/tags")

            this.tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            $scope.toMarkdown = input => itemRenderService.render(input)
            $scope.addQuickNote = angular.bind(this, this.addQuickNote)


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
                    tags: this.$scope.inputSelectedTags,
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

    }


    export interface QuickNoteItemScope extends QuickNoteScope {

        update : Function;
        enableEditMode : Function;
        delete : Function;
        cancel : Function;
        canUpdate : Function;

        original: models.QuickNote;
        //
        item: models.QuickNote;
    }
    export class QuickNoteItemController {
        constructor(public $scope:QuickNoteItemScope, public $resource:ng.resource.IResourceService){

            $scope.update = angular.bind(this, this.update)
            $scope.enableEditMode = angular.bind(this, this.enableEditMode)
            $scope.delete = angular.bind(this, this.delete)
            $scope.cancel = angular.bind(this, this.cancel)
            $scope.canUpdate = angular.bind(this, this.canUpdate)

            this.quickNoteResource = <services.IUpdatableResourceClass>this.$resource("/api/quick_notes/:itemId", {}, {update: {method: 'PUT'}})
        }

        quickNoteResource:services.IUpdatableResourceClass;

        update(note: models.QuickNote) {
            //alert("content:" + content + ",tags:" + tags + ",rate:" + rate + ",status:" + status + ",dueDate:" + dueDate)

            var index = this.$scope.quickNotes.indexOf(this.$scope.item)
            this.$scope.quickNotes[index].editable = false;

            this.quickNoteResource.update({itemId: this.$scope.quickNotes[index].itemId}, {
                content: this.$scope.quickNotes[index].content,
                tags: this.$scope.quickNotes[index].tags,
                rate: this.$scope.quickNotes[index].rate
            }, data=>{
                var index = this.$scope.quickNotes.indexOf(this.$scope.item)
                this.$scope.quickNotes[index].renderedContent = this.$scope.toMarkdown(data.content)
            }, reason=>{
                alert("update ng");
                var index = this.$scope.quickNotes.indexOf(this.$scope.item) // 更新処理が返ってくるまでの間にindexが変わってしまう可能性を考慮
                this.$scope.quickNotes[index].editable = true;
            })
        }

        enableEditMode(note: models.QuickNote) {
            var index = this.$scope.quickNotes.indexOf(this.$scope.item)
            this.$scope.quickNotes[index].editable = true;
            this.$scope.original = angular.copy(this.$scope.quickNotes[index]);
        }

        cancel(note: models.QuickNote) {
            var index = this.$scope.quickNotes.indexOf(this.$scope.item)
            this.$scope.quickNotes[index] = angular.copy(this.$scope.original);
            this.$scope.quickNotes[index].editable = false;
        }

        canUpdate(note: models.QuickNote) {
            var index = this.$scope.quickNotes.indexOf(this.$scope.item)
            return !angular.equals(this.$scope.quickNotes[index], this.$scope.original);
        }

        delete(note: models.QuickNote) {
            var index = this.$scope.quickNotes.indexOf(this.$scope.item)
        }
    }
}