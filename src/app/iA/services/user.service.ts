import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment.development';
import { User } from '../models/user';
import { IResponse } from 'src/app/shared/wrappers/response';
import { IPagedResult } from 'src/app/shared/wrappers/pagedResult';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  #http: HttpClient = inject(HttpClient);

  constructor() { }

  createUser(data: User): Observable<IResponse<any>> {
    const headers = new HttpHeaders().set('X-Source-Request-Type', 'createUser');
    let api = 'User';
    let url = `${environment.basePathUrl}/${api}`;
    return this.#http.post<IResponse<User>>(url, data, { headers });
  }

  updateUser(id:string, data: User): Observable<IResponse<User>> {
    let api = 'User';
    let url = `${environment.basePathUrl}/${api}/${id}`;
    return this.#http.put<IResponse<User>>(url, data);
  }

  getByUserId(Id: string): Observable<IResponse<User>> {
    let api = 'User';
    let url = `${environment.basePathUrl}/${api}/${Id}`;
    return this.#http.get<IResponse<any>>(url);
  }
  changepwd(data: any): Observable<IResponse<any>> {
    let api = 'Users/Changepwd';
    let url = `${environment.basePathUrl}/${api}`;
    return this.#http.patch<IResponse<User>>(url, data);
  }

  getUsers(PageSize: number, PageNumber: number, SearchTerm?: string, prmsFilter?: object): Observable<IPagedResult<User>> {
    let params: HttpParams = new HttpParams();
    params = params.append('PageSize', PageSize);
    params = params.append('PageNumber', PageNumber);
    if (SearchTerm) {
      params = params.append('SearchTerm', SearchTerm);
    }
    let api = 'User';
    let url = `${environment.basePathUrl}/${api}`;
    return this.#http.get<IPagedResult<User>>(url, {
      params: params,
    });
  }

   getRegisterOptions(): Observable<IResponse<any>> {
    let api = 'Auth/registration-options';
    let url = `${environment.basePathUrl}/${api}`;
    return this.#http.get<IResponse<any>>(url);
  }
 
}

