import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
//import { environment } from './../../../environments/environment.development';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';
import { IResponse } from 'src/app/shared/wrappers/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http: HttpClient = inject(HttpClient);
  constructor() { }
  createUser(data: User): Observable<IResponse<any>> {
    const headers = new HttpHeaders().set('X-Source-Request-Type', 'createUser');
    return this.#http.post<IResponse<User>>(`${environment.basePathUrl}/Auth/register`, data, { headers });
  }
  updateUser(data: User): Observable<IResponse<User>> {
    return this.#http.patch<IResponse<User>>(`${environment.basePathUrl}/v1/Users`, data);
  }
}

