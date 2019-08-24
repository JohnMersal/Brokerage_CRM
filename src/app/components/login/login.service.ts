import { Injectable } from '@angular/core';
import { AppSettings } from "../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private headers = AppSettings.headers;
  get LoggedIn(): boolean {
    return localStorage.getItem('loggedIn') !== null;
  };
  constructor(public http: HttpClient) { }
  login(username: string, password: string) {
    const url = AppSettings.login_URL + '?email=' + username + "&password=" + password;
    return this.http.post(url, null).pipe(
      tap((res: any) => {
        let userInfo = {
          id: res.data.id,
          first_name: res.data.first_name,
          second_name: res.data.second_name,
          email: res.data.email,
          mobile: res.data.mobile
        }
        localStorage.setItem('loggedIn', JSON.stringify(userInfo));
       }),
      //map(res => res),
      catchError(this.handleError));
  }
  logout() {
    const url = AppSettings.logout_URL;
    localStorage.removeItem('loggedIn');
    return this.http.post(url, { headers: this.headers }).pipe(
      tap((res: any) => {
      }),
      //map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
