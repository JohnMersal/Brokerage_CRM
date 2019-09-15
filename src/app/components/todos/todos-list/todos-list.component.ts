import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { TodosList, TodoModel, Calendar } from "../todo-model";
import { TodosService } from "../todos.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { EmployeesService } from '../../employees/employees.service';
declare var jQuery: any;
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {
  dataSource: any;
  currentDate: Date = new Date(2016, 7, 2, 11, 30);
  now: Date = new Date();
  resourcesDataSource = [];
  calendar: Calendar[] = [];
  sortData: any;
  
  // get sortData() {
  //   return this.todosList.sort((a, b) => {
  //     return new Date(b.created_at) as any - <any> new Date(a.created_at);
  //   });
  // }

  mainTabsSwitch: string = "todo";
  mainTabsName: string = "For sale units";
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editTodo: TodoModel = new TodoModel();
  todosList: TodosList[] = [];
  employeesLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private leadsService: TodosService, private employeesService: EmployeesService) {
    this.getAllTodos();
    this.getEmployeesLookup();

    this.dataSource = new DataSource({
      store: this.todosList
    });
  }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "todo":
        this.mainTabsName = "For rent units";
        break;
      case "calendar":
        this.mainTabsName = "For sale units";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
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
        for (var n = 0; n < this.todosList.length; n++) {
          this.calendar[n] = {
            startDate : this.todosList[n].start_date,
            endDate : this.todosList[n].end_date,
            text : this.todosList[n].todo_desc,
            assigned_to : this.todosList[n].assigned_to.id,
            todo_status : this.todosList[n].todo_status,
            employeeID: null,
            todo_desc:null
          }
        }
        this.sortData = new DataSource({
          store: this.calendar,
          pageSize: 0
        });
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



  markWeekEnd(cellData) {
    function isWeekEnd(date) {
      var day = date.getDay();
      return day === 0 || day === 6;
    }
    var classObject = {};
    //classObject["employee-" + cellData.groups.employeeID] = true;
    //classObject['employee-weekend-' + cellData.groups.employeeID] = isWeekEnd(cellData.startDate)
    return classObject;
  }

  markTraining(cellData) {
    var classObject = {
      "day-cell": true
    }
    //classObject[this.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
    return classObject;
  }

   getCurrentTraining(date, employeeID) {
    //var result = (date + employeeID) % 3, currentTraining = "training-background-" + result;
    //return currentTraining;
  }
}
