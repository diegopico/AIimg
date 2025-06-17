export interface IAuthResponse {
    AccessToken: string;
    Extras: {id_user: string, date: string};
    Message: string;
    Role: string;
    Successful: boolean;
}