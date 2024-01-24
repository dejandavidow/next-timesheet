export class Project
{
    constructor(public id:number,public name:string,public description:string,public archive:boolean,public status:boolean,public clientName:string){}
}
export class ProjectEntity
{
    constructor(public id:number,public name:string,public description:string,public archive:boolean,public status:boolean,public clientId:number,public userId:string){}
}