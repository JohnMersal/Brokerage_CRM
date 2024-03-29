import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { ClientsList, ClientsModel } from "./clients-model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllClients() {
    const url = `${AppSettings.client_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  getClientById(id: number) {
    const url = `${AppSettings.client_URL}` + '/' + id + '/edit';
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveClient(client: ClientsModel) {
    const url = AppSettings.client_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(client), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateClient(client: ClientsModel) {
    const url = AppSettings.client_URL + '/' + client.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(client));
    return this.http.post(url, JSON.stringify(client), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  storeInterestedInUnits(clienId: number, UnitID: number) {
    const url = AppSettings.client_URL + '/storeInterestedInUnits?client_id=' + clienId + '&unit_id=' + UnitID;
    return this.http.post(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  getInterestedInUnitsForClient(clienId: number) {
    const url = AppSettings.client_URL + '/getInterestedInUnitsForClient/' + clienId;
    return this.http.get(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  deleteInterestedInUnitForClient(clienId: number, UnitID: number) {
    const url = AppSettings.client_URL + '/deleteInterestedInUnitForClient?client_id=' + clienId + '&unit_id=' + UnitID;
    return this.http.post(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
