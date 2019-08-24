import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from "rxjs";
import { MatSnackBar } from '@angular/material';
import { EmployeesService } from '../../employees/employees.service';
import { TodoModel } from "../todo-model";
import { TodosService } from "../todos.service";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { toDate } from '@angular/common/src/i18n/format_date';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
//import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
//import {default as _rollupMoment } from 'moment';
//const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NewTodoComponent implements OnInit {
  maxDate = new Date();
  //date = new FormControl(moment());
  @Output() afterSave = new EventEmitter();
  todoFormGroup: FormGroup;
  singleTodo: TodoModel = new TodoModel();
  employeesLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private todoSrvice: TodosService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private employeesService: EmployeesService) {
    this.creatTodoForm();
    this.getEmployeesLookup();
  }
  creatTodoForm() {
    this.todoFormGroup = this.formBuilder.group({
      todo_date: ['', Validators.required],
      todo_desc: ['', Validators.required],
      todo_status: ['', Validators.required],
      assigned_to: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }
  getEmployeesLookup() {
    this.subscription.add(this.employeesService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesLookup = value.data;
      }, error => {
        this.snackBar.open("error in loading areas list.." + error.error, "", { duration: 2000, politeness: "polite" });
      }));
  }
  saveTodo() {
    if (this.todoFormGroup.valid) {
      this.subscription.add(this.todoSrvice.saveTodo(this.singleTodo).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleTodo });
          this.snackBar.open("Lead saved successfully", "OK", { duration: 2000, politeness: "polite" });
          this.singleTodo = new TodoModel();
          this.todoFormGroup.reset();
        }, error => {
          this.snackBar.open("error in saving.." + error.error, "", { duration: 2000, politeness: "polite" });
        }));
    }
  }
  setTodo_date(value: Date) {
    let originalDate = new Date(value);
    let formated = formatDate(originalDate, 'yyyy-MM-dd', 'en-US');
    console.log(formated);
  }
  changeStatus(e) {
    console.log(e.value);
    if (e.value == "Done") {
      let todayDate = new Date();
      let todayFormated = formatDate(todayDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      this.singleTodo.end_date = todayFormated;
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
