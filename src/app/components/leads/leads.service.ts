import { Injectable } from '@angular/core';
import { AppSettings } from "../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { LeadsModel, leadsList } from "./leads-model";

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private headers = AppSettings.headers;
  leadsList:leadsList[] = []
  constructor(public http: HttpClient) { }
  getAllLeads() {
    const url = `${AppSettings.leads_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveLead(singleLead: LeadsModel) {
    const url = AppSettings.leads_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(singleLead), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateLead(singleLead: LeadsModel) {
    const url = AppSettings.leads_URL + '/' + singleLead.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(singleLead), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  assginLead(leadId: number, assginTo: number) {
    const url = AppSettings.leads_URL + '/' + leadId + '/reassign';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify({ 'reassigned_to': assginTo }), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  deleteSingleLead(leadId) {
    const url = AppSettings.leads_URL + '/' + leadId + '/destroy';
    return this.http.post(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  file(acctualFile) {
    const url = AppSettings.API_Url + "backend/leads/importLeads";
    var formData: FormData = new FormData();
    formData.append("file", acctualFile[0]);
    return this.http.post(url, formData).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
