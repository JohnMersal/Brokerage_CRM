import { Injectable } from '@angular/core';
import { AppSettings } from "../../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { LeadConflictModel } from "./lead-conflict-model";

@Injectable({
  providedIn: 'root'
})
export class LeadConflictService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }
  getDuplicatedLeads() {
    const url = `${AppSettings.API_Url}/backend/getDuplicates`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  getLeadsByPhone(phone: number) {
    const url = `${AppSettings.API_Url}/backend/getLeadsByPhone/` + phone;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  /*saveLead(singleLead: any) {
    const url = AppSettings.leads_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(singleLead), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateLead(singleLead: any) {
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
  }*/
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
