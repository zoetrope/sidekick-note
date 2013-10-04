///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Task.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />

module controllers {
    'use strict';

    export interface TaskScope extends ng.IScope {

        searchSelectedTags: string[];
        searchSelectOptions : any;

        // input
        inputContent: string;
        inputSelectedTags: string[];
        rate: number;
        dueDate: string;

        // output
        tasks: models.Task[];

        // state
        sending : Boolean;
        hasFocus : Boolean;
        enablePreview : Boolean;

        inputSelectOptions : any;
        allTags : string[];

        // action
        toMarkdown(input: string) : string;
        addTask : Function;
        updateTask : Function;
        searchTask : Function;

        // event
        keypress($event : ng.IAngularEvent) : void;
    }

    export interface IResourceWithUpdate extends ng.resource.IResourceClass  {
        update: ng.resource.IActionCall;
    }

    export class TaskController {

        constructor(public $scope:TaskScope, public $resource:ng.resource.IResourceService, public itemRenderService:services.ItemRenderService) {

            $scope.rate = 1
            $scope.dueDate = ""

            $scope.searchSelectedTags = []
            $scope.searchSelectOptions = {
                'multiple': true,
                'allowClear' : true,
                'closeOnSelect' : false,
                'createSearchChoice' : null,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.inputSelectedTags = []
            $scope.inputSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'tags': () => {
                    return $scope.allTags;
                }
            };

            $scope.toMarkdown = input => itemRenderService.render(input)
            $scope.addTask = angular.bind(this, this.addTask)
            $scope.updateTask = angular.bind(this, this.updateTask)
            $scope.searchTask = angular.bind(this, this.searchTask)

            this.tasksResource = this.$resource("/api/tasks")
            this.taskResource = <IResourceWithUpdate>this.$resource("/api/tasks/:itemId", {}, {update: {method: 'PUT'}})
            this.tagsResource = $resource("/api/tags")

            this.tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            this.tasksResource.query(
                (data)=> {
                    $scope.tasks = data
                },
                (reason)=> {
                    alert("error get tasks")
                });
        }

        taskResource :IResourceWithUpdate
        tasksResource : ng.resource.IResourceClass
        tagsResource : ng.resource.IResourceClass

        addTask(){
            this.$scope.sending = true
            this.$scope.hasFocus = false

            this.tasksResource.save(null, {
                    content: this.$scope.inputContent,
                    tags: this.$scope.inputSelectedTags,
                    rate: this.$scope.rate,
                    status: "New",
                    dueDate: this.$scope.dueDate
                },
                (data)=> {
                    this.$scope.tasks.unshift(data)
                    if(this.$scope.tasks.length > 5){
                        this.$scope.tasks.pop()
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

        updateTask(id:number, content:string, tags:string[], rate:number, status:string, dueDate:string) {
            alert("content:"+ content +",tags:"+ tags + ",rate:" + rate + ",status:" + status + ",dueDate:" + dueDate)

            this.taskResource.update({itemId:id}, {
                content: content,
                tags: tags,
                rate: rate,
                status: status,
                dueDate: dueDate
            },data=>alert("update ok"), reason=>alert("update ng"))
        }

        searchTask() {

        }
    }
}