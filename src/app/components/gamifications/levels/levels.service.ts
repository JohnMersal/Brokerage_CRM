import { Injectable } from '@angular/core';
import { AppSettings } from "../../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { levelsList, LevelModel } from "./levels-model";

@Injectable({
  providedIn: 'root'
})
export class LevelsService {
  private headers = AppSettings.headers;
  levelsList: levelsList[] = []
  constructor(public http: HttpClient) { }
  getAllLevels() {
    const url = `${AppSettings.levels_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveLevel(singleLevel: LevelModel) {
    const url = AppSettings.levels_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLevel));
    return this.http.post(url, JSON.stringify(singleLevel), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateLevel(singleLevel: LevelModel) {
    const url = AppSettings.levels_URL + '/' + singleLevel.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLevel));
    return this.http.post(url, JSON.stringify(singleLevel), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
