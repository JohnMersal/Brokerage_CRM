import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";
import { FormControl } from '@angular/forms';
import { Employee, Employees } from "../employees";
import { EmployeesService } from "../employees.service";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  subtitle: string;
  ID: number = 0;
  singleEmployee: Employees = new Employees();
  date = new FormControl(new Date());
  subscription: Subscription = new Subscription();
  constructor(private router: Router, private route: ActivatedRoute, private employeesService: EmployeesService) { 
    this.getRecord();
  }
  getRecord() {
    this.subscription.add(this.route.params.subscribe(params => {
      this.ID = params['ID'];
      this.getEmployeeByID(this.ID);
    }));
  }
  getEmployeeByID(ID) {
    this.subscription.add(this.employeesService.getEmployeeById(ID).subscribe(
      (value: any) => {
        this.singleEmployee = value.data;
      }));
  }
  ngOnInit() {
  }

}
