import { Injectable } from '@angular/core';
import { AppSettings } from "../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry, single } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { PositionModel, PositionList } from "./positions-model";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }
  getAllPosition() {
    const url = `${AppSettings.position_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  getPositionById(ID: number) {
    const url = `${AppSettings.position_URL}/` + ID + "/edit";
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  savePosition(singlPosition: PositionModel) {
    const url = AppSettings.position_URL + '/store?' +
      'name=' + singlPosition.name +
      '&target_commission_monthly=' + singlPosition.target_commission_monthly +
      '&target_commission_quarterly=' + singlPosition.target_commission_quarterly +
      '&target_commission_yearly=' + singlPosition.target_commission_yearly +
      '&target_sales_monthly=' + singlPosition.target_sales_monthly +
      '&target_sales_quarterly=' + singlPosition.target_sales_quarterly +
      '&target_sales_yearly=' + singlPosition.target_sales_yearly 
    return this.http.post(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updatePosition(singlPosition: PositionModel) {
    const url = AppSettings.position_URL + '/' + singlPosition.id + '/update';
    return this.http.post(url, JSON.stringify(singlPosition), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
