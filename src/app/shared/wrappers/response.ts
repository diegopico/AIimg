export interface IResponse<T> {
    succeeded: boolean;
    message: string;
    errors: Array<string>;
    data?: T;
}
export interface IResponse3<T> {
    succeeded: boolean;
    message: string;
    errors: Array<string>;
    Data?: T;
}

export interface IResponse2<T> {
    succeeded: boolean;
    message: string;
    errors: Array<string>;
    data?: T;
}