export interface IPagedResult2<T>{
    totalPages: number;
    //currentPage: number;
    //currentPageSize: number;
    data: Array<T>;
    totalItems: number;
    errors:any;
    hasNextPage:number;
    hasPreviousPage:number;    
    message:string;
    pageNumber:number;
    pageSize:number;
    succeeded:boolean;
}
export interface IPagedResult<T>{
    HasNextPage : boolean;
    HasPreviousPage : boolean;
    Result : Array<T>;
    TotalPages: number;
    TotalRows: number;
}
