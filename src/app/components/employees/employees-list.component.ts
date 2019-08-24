import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from "./employees.service";
import { Subscription, Observable } from "rxjs";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  subscription: Subscription = new Subscription();
  employeesList = [];
  constructor(private employeeService: EmployeesService, private router: Router) {
    this.getAllLeads();
   }
  ngOnInit() {
  }
  getAllLeads() {
    this.subscription.add(this.employeeService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  editRecord(e: any) {
    this.router.navigate(['employee/', e.data.id]);
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
