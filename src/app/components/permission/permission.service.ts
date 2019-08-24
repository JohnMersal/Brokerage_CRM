import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  // getAllPermission() {
  //   const url = `${AppSettings.permissions_URL}`;
  //   return this.http.get(url).pipe(
  //     map(res => res), catchError(this.handleError));
  // }
  // savePermission(compound: any) {
  //   const url = AppSettings.permissions_URL + '/store';
  //   //const formData = new FormData();
  //   //formData.append('', JSON.stringify(singleLead));
  //   return this.http.post(url, JSON.stringify(compound), { headers: this.headers }).pipe(
  //     map(res => res),
  //     catchError(this.handleError));
  // }
  editPermission(permissionn: any) {
    const url = AppSettings.permissions_URL + '/' + permissionn.id + '/edit';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(permissionn));
    return this.http.post(url, JSON.stringify(permissionn), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  uppdatePermission(permissionn: any) {
    const url = AppSettings.permissions_URL + '/' + permissionn.id;
    //const formData = new FormData();
    //formData.append('', JSON.stringify(permissionn));
    return this.http.post(url, JSON.stringify(permissionn), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
