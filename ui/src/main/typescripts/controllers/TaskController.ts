///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />

///<reference path='../models/Task.ts' />
///<reference path='../models/Tag.ts' />
///<reference path='../services/ItemRenderService.ts' />
///<reference path='../services/IUpdatableResourceClass.ts' />
///<reference path='../controllers/SearchParam.ts' />

module controllers {
    'use strict';

    export interface TaskScope extends ng.IScope {

        //TODO: 入力要素はまとめる
        // input
        inputTitle: string;
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
        searchTask(page: number, tags:string, status:string, dueDate:string) : void;

        // event
        keypress($event:ng.IAngularEvent) : void;

        getComfortableRowNumber(content:string) : number;

        allTabIsActive: Boolean;
    }


    export class TaskController {

        tasksResource:ng.resource.IResourceClass;
        tagsResource:ng.resource.IResourceClass;
        searchTasksResource:ng.resource.IResourceClass;
        countResource:ng.resource.IResourceClass;

        constructor(public $scope:TaskScope, public $resource:ng.resource.IResourceService, public $location: ng.ILocationService, public itemRenderService:services.ItemRenderService) {

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

            $scope.$on("search.tasks", (ev, query)=>{
                var param = angular.fromJson(query);

                this.searchTask(1, param.tags, param.status, param.dueDate)
            });

            //this.searchTask(1, $stateParams.words, $stateParams.tags)

            $scope.inputContent = ""

            //TODO: Directiveにできるんじゃないだろうか？
            $scope.getComfortableRowNumber = (content:string) => {
                var rows = 3;
                if (content) {
                    var match_str = content.match(/\n/g);
                    if (match_str) {
                        rows += match_str.length;
                    }
                    if (rows > 40) {
                        rows = 40;
                    }
                }
                return rows;
            };

            $scope.allTabIsActive = true;
        }

        addTask() {
            this.$scope.sending = true;
            this.$scope.hasFocus = false;

            this.tasksResource.save(null, {
                    content: this.$scope.inputContent,
                    tags: this.$scope.inputSelectedTags,
                    rate: this.$scope.rate,
                    status: "New",
                    dueDate: this.$scope.dueDate,
                    title: this.$scope.inputTitle
                },
                (data)=> {
                    data.renderedContent = this.$scope.toMarkdown(data.content)
                    this.$scope.tasks.unshift(data);
                    if (this.$scope.tasks.length > 5) {
                        //this.$scope.tasks.pop();
                    }
                    this.$scope.inputContent = "";
                    this.$scope.inputTitle = "";
                    this.$scope.sending = false;
                    this.$scope.hasFocus = true;
                },
                (reason)=> {
                    alert("error add QuickNote");
                    this.$scope.sending = false;
                    this.$scope.hasFocus = true;
                })
        }

        searchTask(page: number, tags: string, status: string, dueDate: string) {

            if (page == null) page = 1
            if (tags == null) tags = ""
            if (status == null) status = ""
            if (dueDate == null) dueDate = ""

            this.searchTasksResource.query({page: page, tags: tags, status: status, dueDate: dueDate},
                (data)=> {
                    this.$scope.tasks = data.map(x=>{x.renderedContent = this.$scope.toMarkdown(x.content); return x})
                    //TODO: URLの変更
                },
                (reason)=> {
                    alert("search ng")
                });
        }
   }

    export interface TaskItemScope extends TaskScope {

        update : Function;
        enableEditMode : Function;
        delete : Function;
        cancel : Function;
        canUpdate : Function;

        load : Function;
        isOpen : Boolean;

        original: models.Task;
        //
        item: models.Task;

        loadedTask: models.Task;
    }
    export class TaskItemController {
        constructor(public $scope:TaskItemScope, public $resource:ng.resource.IResourceService){

            $scope.update = angular.bind(this, this.update)
            $scope.enableEditMode = angular.bind(this, this.enableEditMode)
            $scope.delete = angular.bind(this, this.delete)
            $scope.cancel = angular.bind(this, this.cancel)
            $scope.canUpdate = angular.bind(this, this.canUpdate)

            $scope.load = angular.bind(this, this.load)

            $scope.isOpen = false;

            this.taskResource = <services.IUpdatableResourceClass>this.$resource("/api/tasks/:itemId", {}, {update: {method: 'PUT'}})
        }

        taskResource:services.IUpdatableResourceClass;

        update(task: models.Task) {
            //alert("content:" + content + ",tags:" + tags + ",rate:" + rate + ",status:" + status + ",dueDate:" + dueDate)

            var index = this.$scope.tasks.indexOf(this.$scope.item)
            this.$scope.tasks[index].editable = false;

            this.taskResource.update({itemId: this.$scope.tasks[index].itemId}, {
                content: this.$scope.tasks[index].content,
                tags: this.$scope.tasks[index].tags,
                rate: this.$scope.tasks[index].rate,
                status: this.$scope.tasks[index].status,
                title: this.$scope.tasks[index].title,
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

        enableEditMode(task: models.Task) {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
            this.$scope.tasks[index].editable = true;
            this.$scope.original = angular.copy(this.$scope.tasks[index]);
        }

        cancel(task: models.Task) {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
            this.$scope.tasks[index] = angular.copy(this.$scope.original);
            this.$scope.tasks[index].editable = false;
        }

        canUpdate(task: models.Task) {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
            return !angular.equals(this.$scope.tasks[index], this.$scope.original);
        }

        delete(task: models.Task) {
            var index = this.$scope.tasks.indexOf(this.$scope.item)
        }

        load(task: models.Task) {
            this.$scope.isOpen = !this.$scope.isOpen;

            if(this.$scope.item.content) {return}

            this.taskResource.get({itemId: task.itemId},
                data=>{
                    this.$scope.item.content = data.content;
                    this.$scope.item.renderedContent = this.$scope.toMarkdown(data.content);
                    this.$scope.item.tags = data.tags;
                },
                reason=>{

                });
        }
    }
}