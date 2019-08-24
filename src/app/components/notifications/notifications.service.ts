import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { NotificationsList, NotificationModel } from "./notifications-model";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllNotifications() {
    const url = `${AppSettings.notifications_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveNotification(notification: NotificationModel) {
    const url = AppSettings.notifications_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(notification));
    return this.http.post(url, JSON.stringify(notification), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateNotification(notification: NotificationModel) {
    const url = AppSettings.notifications_URL + '/' + notification.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(notification));
    return this.http.post(url, JSON.stringify(notification), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
