import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { AtivitiesListModel, ActivityModel } from "./ativities-model";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllActivities() {
    const url = `${AppSettings.activities_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveActivity(activity: ActivityModel) {
    const url = AppSettings.activities_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(activity));
    return this.http.post(url, JSON.stringify(activity), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateActivity(activity: ActivityModel) {
    const url = AppSettings.activities_URL + '/' + activity.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(activity));
    return this.http.post(url, JSON.stringify(activity), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
