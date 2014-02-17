///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-resource.d.ts' />
///<reference path='../../d.ts/DefinitelyTyped/angularjs/angular-route.d.ts' />

///<reference path='../services/ApiService.ts' />
///<reference path='../application/UserSetting.ts' />

module models {
    export class Item {
        _id:string;
        title:string;
        content:string;
        type:string;
        status:string;
        rate:number;
        tags:string[];
        createdAt:Date;
        modifiedAt:Date;
        dueDate:Date;
    }
}