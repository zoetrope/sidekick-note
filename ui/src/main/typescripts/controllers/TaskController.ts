///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Task.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='../controllers/SearchParam.ts' />

module controllers {
    'use strict';

    export class PaginationSetting {
        constructor(){
            this.totalItems = 0;
            this.currentPage = 1;
            this.numPages = 10;
            this.maxSize = 10;
        }
        totalItems : number;
        currentPage : number;
        numPages : number;
        maxSize : number;
    }

    export interface TaskScope extends ng.IScope {

        //TODO: 入力要素はまとめる
        // input
        inputContent: string;
        inputSelectedTags: string[];
        rate: number;
        dueDate: Date;

        // state
        sending : Boolean;
        hasFocus : Boolean;
        enablePreview : Boolean;
        inputSelectOptions : any;
        allTags : string[];

        // output
        tasks: models.Task[];

        // action
        toMarkdown(input:string) : string;
        addTask : Function;
        searchTask(page: number, words:string, tags:string) : void;

        // event
        keypress($event:ng.IAngularEvent) : void;

        pagination: PaginationSetting

        changePage(page: number) : void;

        //TODO: これはなくす
        currentKeywords : string;
        currentTags : string;

        getComfortableRowNumber(content:string) : number;
    }


    export class TaskController {

        constructor(public $scope:TaskScope, public $resource:ng.resource.IResourceService, public $location: ng.ILocationService, public itemRenderService:services.ItemRenderService) {

            $scope.pagination = new PaginationSetting()
            $scope.changePage = (page:number)=>{
                this.searchTask(page, $scope.currentKeywords, $scope.currentTags)
            }

            $scope.rate = 1
            $scope.dueDate = null


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

            this.tasksResource = this.$resource("/api/tasks")
            this.tagsResource = $resource("/api/tags")
            this.searchTasksResource = $resource("/api/tasks/search")
            this.countResource = $resource("/api/tasks/count")

            this.tagsResource.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });

            $scope.$on("search", (ev, words, tags)=>{
                this.searchTask(1, words, tags)
            });

            //this.searchTask(1, $stateParams.words, $stateParams.tags)

            $scope.inputContent = ""

            //TODO: Directiveにできるんじゃないだろうか？
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

        tasksResource:ng.resource.IResourceClass;
        tagsResource:ng.resource.IResourceClass;
        searchTasksResource:ng.resource.IResourceClass;
        countResource:ng.resource.IResourceClass;

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

        searchTask(page: number, words: string, tags: string) {

            if (page == null) page = 1
            if (words == null) words = ""
            if (tags == null) tags = ""

            this.countResource.get({words: words, tags: tags},
                (data)=>{
                    this.$scope.pagination.totalItems = data.count;
                    this.$scope.pagination.numPages = Math.ceil(this.$scope.pagination.totalItems / 20)
                },
                (reason)=>{

                });

            this.searchTasksResource.query({page: page, words: words, tags: tags},
                (data)=> {
                    this.$scope.tasks = data.map(x=>{x.renderedContent = this.$scope.toMarkdown(x.content); return x})
                    //TODO: URLの変更
                    this.$scope.currentKeywords = words
                    this.$scope.currentTags = tags
                },
                (reason)=> {
                    alert("search ng")
                });
        }
   }

    export interface TaskItemScope extends TaskScope {

        update : Function;
        startEdit : Function;
        delete : Function;
        cancel : Function;
        canUpdate : Function;

        original: models.Task;
        //
        item: models.Task;
    }
    export class TaskItemController {
        constructor(public $scope:TaskItemScope, public $resource:ng.resource.IResourceService){

            $scope.update = angular.bind(this, this.update)
            $scope.startEdit = angular.bind(this, this.startEdit)
            $scope.delete = angular.bind(this, this.delete)
            $scope.cancel = angular.bind(this, this.cancel)
            $scope.canUpdate = angular.bind(this, this.canUpdate)

            this.taskResource = <services.IUpdatableResourceClass>this.$resource("/api/tasks/:itemId", {}, {update: {method: 'PUT'}})
        }

        taskResource:services.IUpdatableResourceClass;

        update() {
            //alert("content:" + content + ",tags:" + tags + ",rate:" + rate + ",status:" + status + ",dueDate:" + dueDate)

            var index = this.$scope.tasks.indexOf(this.$scope.item)
            this.$scope.tasks[index].editable = false;

            this.taskResource.update({itemId: this.$scope.tasks[index].itemId}, {
                content: this.$scope.tasks[index].content,
                tags: this.$scope.tasks[index].tags,
                rate: this.$scope.tasks[index].rate,
                status: this.$scope.tasks[index].status,
                dueDate: null
                //dueDate: this.$scope.tasks[index].dueDate
            }, data=>{
                var index = this.$scope.tasks.indexOf(this.$scope.item)
                this.$scope.tasks[index].renderedContent = this.$scope.toMarkdown(data.content)
            }, reason=>{
                alert("update ng");
                var index = this.$scope.tasks.indexOf(this.$scope.item) // 更新処理が返ってくるまでの間にindexが変わってしまう可能性を考慮
                this.$scope.tasks[index].editable = true;
            })
        }

        startEdit() {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
            this.$scope.tasks[index].editable = true;
            this.$scope.original = angular.copy(this.$scope.tasks[index]);
        }

        cancel() {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
            this.$scope.tasks[index] = angular.copy(this.$scope.original);
            this.$scope.tasks[index].editable = false;
        }

        canUpdate() {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
            return !angular.equals(this.$scope.tasks[index], this.$scope.original);
        }

        delete() {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
        }
    }
}