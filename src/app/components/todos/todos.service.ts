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

data = [{
  text: "Helen",
  employeeID: 2,
  startDate: new Date(2019, 9, 2, 9, 30),
  endDate: new Date(2019, 9, 2, 11, 30)
}, {
  text: "Helen",
  employeeID: 2,
  startDate: new Date(2019, 9, 11, 9, 30),
  endDate: new Date(2019, 9, 12, 11, 30)
}, {
  text: "Alex",
  employeeID: 1,
  startDate: new Date(2019, 9, 3, 9, 30),
  endDate: new Date(2019, 9, 3, 11, 30)
}, {
  text: "Alex",
  employeeID: 1,
  startDate: new Date(2019, 9, 12, 12, 0),
  endDate: new Date(2019, 9, 12, 13, 0)
}, {
  text: "Alex",
  employeeID: 2,
  startDate: new Date(2019, 9, 17, 9, 30),
  endDate: new Date(2019, 9, 17, 11, 30)
}, {
  text: "Stan",
  employeeID: 1,
  startDate: new Date(2019, 9, 8, 9, 30),
  endDate: new Date(2019, 9, 8, 11, 30)
}, {
  text: "Stan",
  employeeID: 1,
  startDate: new Date(2019, 9, 29, 9, 30),
  endDate: new Date(2019, 9, 29, 11, 30)
}, {
  text: "Stan",
  employeeID: 1,
  startDate: new Date(2019, 9, 31, 9, 30),
  endDate: new Date(2019, 9, 31, 11, 30)
},
{
  text: "Rachel",
  employeeID: 2,
  startDate: new Date(2019, 9, 5, 9, 30),
  endDate: new Date(2019, 9, 5, 11, 30)
}, {
  text: "Rachel",
  employeeID: 2,
  startDate: new Date(2019, 9, 8, 9, 30),
  endDate: new Date(2019, 9, 8, 11, 30)
}, {
  text: "Rachel",
  employeeID: 1,
  startDate: new Date(2019, 9, 22, 9, 30),
  endDate: new Date(2019, 9, 22, 11, 30)
}, {
  text: "Kelly",
  employeeID: 2,
  startDate: new Date(2019, 9, 16, 9, 30),
  endDate: new Date(2019, 9, 16, 11, 30)
}, {
  text: "Kelly",
  employeeID: 2,
  startDate: new Date(2019, 9, 30, 9, 30),
  endDate: new Date(2019, 9, 30, 11, 30)
  }];
  getData() {
    return this.data;
  }
}
