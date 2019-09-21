import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { AtivitiesListModel, ActivityModel, ActivityClient, PrimaryAndExternalSale, InternalSale } from "./ativities-model";

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
  submitPrimaryActivity(activity: PrimaryAndExternalSale) {
    //const url = AppSettings.activities_URL + '/store/won';
    const url = AppSettings.API_Url + '/backend/sales/primary';
    return this.http.post(url, JSON.stringify(activity), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  submitExternalActivity(activity: PrimaryAndExternalSale) {
    //const url = AppSettings.activities_URL + '/store/won';
    const url = AppSettings.API_Url + '/backend/sales/resaleExternally';
    return this.http.post(url, JSON.stringify(activity), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  submitInternalActivity(activity: InternalSale) {
    //const url = AppSettings.activities_URL + '/store/won';
    const url = AppSettings.API_Url + '/backend/sales/resaleInternally';
    return this.http.post(url, JSON.stringify(activity), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  getTempRequestApproval() {
    const url = `${AppSettings.API_Url}/backend/sales/getAllTempRequests`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  approveDisapproveRequest(id, satatus) {
    const url = `${AppSettings.API_Url}/backend/sales/approveDisapproveOperation?id=` + id + "&satatus=" + satatus;
    return this.http.post(url, null, { headers: this.headers }).pipe(
      map(res => res), catchError(this.handleError));
  }
  getWonActivities() {
    const url = `${AppSettings.activities_URL}/getAllWonStatuses`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
