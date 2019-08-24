import { Injectable } from '@angular/core';
import { AppSettings } from "../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FixedPointsModel, HappyHoursModel, HappyHourUpdateModel, TargetPointsModel, TargetPointUpdateModel, Formula } from "./gamifications-model";

@Injectable({
  providedIn: 'root'
})
export class GamificationsService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }
  getFixedPoints() {
    const url = `${AppSettings.gamification_URL}/getFixedPoints`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  getTargetPoints() {
    const url = `${AppSettings.gamification_URL}/getTargetPoints`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  updateTargetPoints(targetPoint: TargetPointUpdateModel) {
    const url = AppSettings.gamification_URL + '/updateTargetPoints';
    return this.http.post(url, JSON.stringify(targetPoint), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  getHappyHourPoints() {
    const url = `${AppSettings.gamification_URL}/getHappyHourPoints`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  updateHappyHourPoints(happyHour: HappyHourUpdateModel) {
    const url = AppSettings.gamification_URL + '/updateHappyHourPoints';
    return this.http.post(url, JSON.stringify(happyHour), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateFormula(formula: Formula) {
    const url = AppSettings.gamification_URL + '/updateFormula';
    return this.http.post(url, JSON.stringify(formula), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  // saveLevel(singleLevel) {
  //   const url = AppSettings.gamification_URL + '/store';
  //   return this.http.post(url, JSON.stringify(singleLevel), { headers: this.headers }).pipe(
  //     map(res => res),
  //     catchError(this.handleError));
  // }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
