///<reference path='../../typings/tsd.d.ts' />

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