import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { CompoundsList, CompoundModel } from "./compounds";

@Injectable({
  providedIn: 'root'
})
export class CompoundsService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllCompounds() {
    const url = `${AppSettings.compound_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveCompound(compound: CompoundModel) {
    const url = AppSettings.compound_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(compound), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateCompound(compound: CompoundModel) {
    const url = AppSettings.compound_URL + '/' + compound.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(compound));
    return this.http.post(url, JSON.stringify(compound), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
