///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Task.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />

module controllers {
    'use strict';

    export interface TaskScope extends ng.IScope {

        searchSelectedTags: string[];
        searchSelectOptions : any;

        // input
        inputContent: string;
        inputSelectedTags: string[];
        rate: number;
        dueDate: Date;

        // output
        tasks: models.Task[];

        // state
        sending : Boolean;
        hasFocus : Boolean;
        enablePreview : Boolean;

        inputSelectOptions : any;
        allTags : string[];

        // action
        toMarkdown(input:string) : string;
        addTask : Function;
        updateTask : Function;
        searchTask : Function;

        // event
        keypress($event:ng.IAngularEvent) : void;

        totalItems : number;
        currentPage : number;
        numPages : number;
        maxSize : number;

        changePage(page: number) : void;
    }

    export class TaskController {

        constructor(public $scope:TaskScope, public $resource:ng.resource.IResourceService, public $location: ng.ILocationService, public itemRenderService:services.ItemRenderService) {

            $scope.totalItems = 100;
            $scope.currentPage = 1;
            $scope.numPages = 10;
            $scope.maxSize = 5;
            $scope.changePage = (page:number)=>{
                $location.search({page: page})
            }

            $scope.rate = 1
            $scope.dueDate = null

            $scope.searchSelectedTags = []
            $scope.searchSelectOptions = {
                'multiple': true,
                'simple_tags': true,
                'allowClear': true,
                'closeOnSelect': false,
                'createSearchChoice': null,
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
            this.taskResource = <services.IUpdatableResourceClass>this.$resource("/api/tasks/:itemId", {}, {update: {method: 'PUT'}})
            this.tagsResource = $resource("/api/tags")
            this.searchTasksResource = $resource("/api/tasks/search")

            this.tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            this.tasksResource.query(
                (data)=> {
                    $scope.tasks = data.map(x=>{x.renderedContent = $scope.toMarkdown(x.content); return x})
                },
                (reason)=> {
                    alert("error get tasks")
                });
        }

        taskResource:services.IUpdatableResourceClass;
        tasksResource:ng.resource.IResourceClass;
        tagsResource:ng.resource.IResourceClass;
        searchTasksResource:ng.resource.IResourceClass;

        addTask() {
            this.$scope.sending = true;
            this.$scope.hasFocus = false;

            this.tasksResource.save(null, {
                    content: this.$scope.inputContent,
                    tags: this.$scope.inputSelectedTags,
                    rate: this.$scope.rate,
                    status: "New",
                    dueDate: this.$scope.dueDate
                },
                (data)=> {
                    data.renderedContent = this.$scope.toMarkdown(data.content)
                    this.$scope.tasks.unshift(data);
                    if (this.$scope.tasks.length > 5) {
                        //this.$scope.tasks.pop();
                    }
                    this.$scope.inputContent = "";
                    this.$scope.sending = false;
                    this.$scope.hasFocus = true;
                },
                (reason)=> {
                    alert("error add QuickNote");
                    this.$scope.sending = false;
                    this.$scope.hasFocus = true;
                })
        }

        updateTask(task: models.Task) {
            //alert("content:" + content + ",tags:" + tags + ",rate:" + rate + ",status:" + status + ",dueDate:" + dueDate)

            var index = this.$scope.tasks.indexOf(task)
            this.$scope.tasks[index].editable = false;

            this.taskResource.update({itemId: this.$scope.tasks[index].itemId}, {
                content: this.$scope.tasks[index].content,
                tags: this.$scope.tasks[index].tags,
                rate: this.$scope.tasks[index].rate,
                status: this.$scope.tasks[index].status,
                dueDate: null
                //dueDate: this.$scope.tasks[index].dueDate
            }, data=>{
                var index = this.$scope.tasks.indexOf(task)
                this.$scope.tasks[index].renderedContent = this.$scope.toMarkdown(data.content)
            }, reason=>{
                alert("update ng");
                var index = this.$scope.tasks.indexOf(task) // 更新処理が返ってくるまでの間にindexが変わってしまう可能性を考慮
                this.$scope.tasks[index].editable = true;
            })
        }

        searchTask() {
            var tags = this.$scope.searchSelectedTags.join(" ")
            if (tags) {
                this.searchTasksResource.query({tags: tags},
                    (data)=> {
                        this.$scope.tasks = data.map(x=>{x.renderedContent = this.$scope.toMarkdown(x.content); return x})
                    },
                    (reason)=> {
                        alert("search ng")
                    });
            }
        }
    }
}