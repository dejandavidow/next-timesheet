export class PaginationModel
{
    constructor(public TotalCount:number,public PageSize:number,public CurrentPage:number,public TotalPages:number,public HasNext:boolean,public HasPrevious:boolean){}
}