import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from '../shared/app-settings';
import { TodoModel } from "./todo-model";

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }

  getAllTodos() {
    const url = `${AppSettings.todo_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveTodo(todo: TodoModel) {
    const url = AppSettings.todo_URL + '/store';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(todo), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateTodo(todo: TodoModel) {
    const url = AppSettings.todo_URL + '/' + todo.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(todo));
    return this.http.post(url, JSON.stringify(todo), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    //console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
