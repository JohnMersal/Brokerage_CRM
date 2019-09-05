import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
//import { Permissions, SinglePermission, SystemModule, UserPermissions } from "../permission-model";
import { PermissionService } from "../permission.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { EmployeesService } from '../../employees/employees.service';
declare var jQuery: any;

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editTodo: any = { id: 1};
  todosList: any = [];
  employeesLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private permissionService: PermissionService, private employeesService: EmployeesService) {
    this.editpermission();
    //this.getEmployeesLookup();
  }
  getEmployeesLookup() {
    this.subscription.add(this.employeesService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesLookup = value.data;
      }, error => {
        notify(error.error, "error");
      }));
  }
  editpermission() {
    this.subscription.add(this.permissionService.editPermission(1).subscribe(
      (value: any) => {
        this.editTodo = value.data.user_permissions;
      }, error => {
        console.log(error);
      }));
  }
  updateTodo() {
    if (this.editTodo.assigned_to != null && this.editTodo.todo_status != null && this.editTodo.start_date != null && this.editTodo.todo_date != null) {
      this.subscription.add(this.permissionService.uppdatePermission(this.editTodo).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.editpermission();
          (<any>jQuery('#editTodoModal')).modal('hide');
          this.editTodo = {};
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
