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
        addTask() : void;
        toMarkdown(input: string) : string;

        updateTask(id:number, content:string, tags:string[], rate:number, status:string, dueDate:string):void;

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

            var Tags = $resource("/api/tags")
            Tags.query(data => {
                $scope.allTags = data.map(tag => tag.name)
            });


            var Tasks = $resource("/api/tasks")

            $scope.toMarkdown = input => {
                return itemRenderService.render(input)
            }

            $scope.addTask = () => {
                $scope.sending = true
                $scope.hasFocus = false

                Tasks.save(null, {
                        content: $scope.inputContent,
                        tags: $scope.inputSelectedTags,
                        rate: $scope.rate,
                        status: "New",
                        dueDate: $scope.dueDate
                    },
                    (data)=> {
                        $scope.tasks.unshift(data)
                        if($scope.tasks.length > 5){
                            $scope.tasks.pop()
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

            var Task = <IResourceWithUpdate>$resource("/api/tasks/:itemId", {}, {update: {method: 'PUT'}})
            $scope.updateTask = (id, content, tags, rate, status, dueDate) => {
                alert("content:"+ content +",tags:"+ tags + ",rate:" + rate + ",status:" + status + ",dueDate:" + dueDate)
                Task.update({itemId:id}, {
                    content: content,
                    tags: tags,
                    rate: rate,
                    status: status,
                    dueDate: dueDate
                },data=>alert("update ok"), reason=>alert("update ng"))
            }

            Tasks.query(
                (data)=> {
                    $scope.tasks = data
                },
                (reason)=> {
                    alert("error get tasks")
                });
        }

    }
}