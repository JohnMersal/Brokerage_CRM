import { Injectable } from '@angular/core';
import { AppSettings } from "../shared/app-settings";
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, retry, single } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Employee, singleEmployee, Employees } from "./employees";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private headers = AppSettings.headers;
  constructor(public http: HttpClient) { }
  getAllEmployees() {
    const url = `${AppSettings.employees_URL}`;
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  getEmployeeById(ID: number) {
    const url = `${AppSettings.employees_URL}/` + ID + "/edit";
    return this.http.get(url).pipe(
      map(res => res), catchError(this.handleError));
  }
  saveEmployee(singleEmployee: singleEmployee) {
    const url = AppSettings.employees_URL + '/store?' +
      'first_name=' + singleEmployee.first_name +
      '&second_name=' + singleEmployee.second_name +
      '&gender=' + singleEmployee.gender +
      '&active=' + singleEmployee.active +
      '&email=' + singleEmployee.email +
      '&job_title=' + singleEmployee.job_title +
      '&mobile=' + singleEmployee.mobile +
      '&national_id=' + singleEmployee.national_id +
      '&password=' + singleEmployee.password +
      '&joining_date=' + singleEmployee.joining_date +
      '&position_id=' + singleEmployee.position_id +
      '&team_leader_id=' +singleEmployee.team_leader_id;
    const formData = new FormData();
    // formData.append('active', singleEmployee.active.toString());
    // formData.append('email', singleEmployee.email);
    // formData.append('first_name', singleEmployee.first_name);
    // formData.append('second_name', singleEmployee.second_name);
    // formData.append('gender', singleEmployee.gender);
    // formData.append('job_title', singleEmployee.job_title);
    // formData.append('joining_date', singleEmployee.joining_date.toDateString());
    // formData.append('mobile', singleEmployee.mobile.toString());
    // formData.append('national_id', singleEmployee.national_id);
    // formData.append('password', singleEmployee.password);
    // formData.append('', JSON.stringify(singleEmployee));
    formData.append('profile_picture', singleEmployee.profile_picture );
    return this.http.post(url, formData, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  updateEmployee(singleEmployee: singleEmployee) {
    const url = AppSettings.employees_URL + '/' + singleEmployee.id + '/update';
    //const formData = new FormData();
    //formData.append('', JSON.stringify(singleLead));
    return this.http.post(url, JSON.stringify(singleEmployee), { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  reassignWork(from_id: number, to_id: number) {
    const url = AppSettings.employees_URL + '/reassignEmployeeWork?from_emp_id=' + from_id + "&to_emp_id=" + to_id;
    return this.http.post(url, { headers: this.headers }).pipe(
      map(res => res),
      catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    console.error(JSON.stringify(error));
    return observableThrowError(error.error);
  }
}
