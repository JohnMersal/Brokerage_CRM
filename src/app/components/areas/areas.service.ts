import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { AreasList, AreasModel } from "./areas-model";

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllAreas() {
    const url = `${AppSettings.areas_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveArea(singleArea: AreasModel) {
    const url = AppSettings.areas_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(singleArea), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateArea(singleArea: AreasModel) {
    const url = AppSettings.areas_URL + '/' + singleArea.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleArea));
    return this.http.post(url, JSON.stringify(singleArea), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
