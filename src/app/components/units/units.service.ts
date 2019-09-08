import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { UnitsModel } from "./units-model";

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllUnits() {
    const url = `${AppSettings.unit_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveUnit(unit: UnitsModel) {
    const url = AppSettings.unit_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(unit), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateUnit(unit: UnitsModel) {
    const url = AppSettings.unit_URL + '/' + unit.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(unit));
    return this.http.post(url, JSON.stringify(unit), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  changeUnitStatus(unit_id, status, broker_id?) {
    var url;
    if (broker_id) {
      url = AppSettings.API_Url + '/backend/sales/saleUpdateUnitStatus?unit_id=' + unit_id + "&status=" + status + "&broker_id=" + broker_id;
    } else {
      url = AppSettings.API_Url + '/backend/sales/saleUpdateUnitStatus?unit_id=' + unit_id + "&status=" + status;
    }
    //const formData = new FormData();
    //formData.append('', JSON.stringify(unit));
    return this.http.post(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
