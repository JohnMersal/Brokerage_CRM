import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { TodosList, TodoModel } from "../todo-model";
import { TodosService } from "../todos.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { EmployeesService } from '../../employees/employees.service';
declare var jQuery: any;

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editTodo: TodoModel = new TodoModel();
  todosList: TodosList[] = [];
  employeesLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private leadsService: TodosService, private employeesService: EmployeesService) {
    this.getAllTodos();
    this.getEmployeesLookup();
  }
  getEmployeesLookup() {
    this.subscription.add(this.employeesService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesLookup = value.data;
      }, error => {
        notify(error.error, "error");
      }));
  }
  getAllTodos() {
    this.subscription.add(this.leadsService.getAllTodos().subscribe(
      (value: any) => {
        this.todosList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  updateTodo() {
    if (this.editTodo.assigned_to != null && this.editTodo.todo_status != null && this.editTodo.start_date != null && this.editTodo.todo_date != null) {
      this.subscription.add(this.leadsService.updateTodo(this.editTodo).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.getAllTodos();
          (<any>jQuery('#editTodoModal')).modal('hide');
          this.editTodo = new TodoModel();
        }, error => {
          notify(error.error, "error");
        }));
    }
  }
  changeStatus(e) {
    console.log(e.value);
    if (e.value == "Done") {
      let todayDate = new Date();
      let todayFormated = formatDate(todayDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      this.editTodo.end_date = todayFormated;
    }
  }
  setTodo_date(value: Date) {
    let originalDate = new Date(value);
    let formated = formatDate(originalDate, 'yyyy-MM-dd', 'en-US');
    console.log(formated);
  }
  editRecord(e: any) {
    console.log(e.data);
    this.editTodo = {
      id: e.data.id,
      assigned_to: e.data.assigned_to.id,
      end_date: e.data.end_date,
      start_date: e.data.start_date,
      todo_date: e.data.todo_date,
      todo_desc: e.data.todo_desc,
      todo_status: e.data.todo_status
    };
    (<any>jQuery('#editTodoModal')).modal('show');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  ngOnInit() {
  }

}