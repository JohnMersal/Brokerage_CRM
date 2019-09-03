import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { BrokerModel, BrokersList } from "./broker-model";

@Injectable({
  providedIn: 'root'
})
export class BrokersService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllBroker() {
    const url = `${AppSettings.broker_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveBroker(broker: BrokerModel) {
    const url = AppSettings.broker_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(broker), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  /*updateBroker(broker: BrokerModel) {
    const url = AppSettings.broker_URL + '/' + broker.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(broker));
    return this.http.post(url, JSON.stringify(broker), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }*/
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
