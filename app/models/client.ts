export class Client
{
    constructor(public id:number,public name:string,public adress:string,public city:string){}
}
export class ClientEntity
{
    constructor(public name:string,public adress:string,public city:string,public postalCode:string,public country:string){}
}