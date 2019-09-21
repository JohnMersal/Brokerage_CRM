import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { singleEmployee, Employee, Employees } from "../employees";
import { EmployeesService } from "../employees.service";
import notify from 'devextreme/ui/notify';
import { AppSettings } from "../../shared/app-settings";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { toDate } from '@angular/common/src/i18n/format_date';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { PositionList } from "../../positions/positions-model";
import { PositionsService } from "../../positions/positions.service";


@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  singleEmployee: singleEmployee = new singleEmployee();
  maxDate: Date = new Date();
  files: any[] = [];
  employeesLookup: Employees[] = [];
  positionLookup: PositionList[] = [];
  DateFormat = AppSettings.DateDisplayFormat;
  subscription: Subscription = new Subscription();
  constructor(private employeeService: EmployeesService, private positionsService: PositionsService) {
    this.getPositionsLookup();
    this.getEmployeesLookup();
  }
  preview(e) {
    //console.log(e);
    var reader = new FileReader();
    var e = this.files[0];
    reader.onload = (e) => {
      this.singleEmployee.profile_picture = e.target;
      this.singleEmployee.profile_picture = this.singleEmployee.profile_picture.result;
    }
    reader.readAsDataURL(e);
  }
  fileProgress(e) {
    //console.log(e, e.target.files[0]);
    //this.singleEmployee.profile_picture = e.target.files[0];
  }
  saveEmployee() {
    //console.log(this.singleEmployee);
    if (this.DataValidator.instance.validate().isValid) {
      let formatedDate = formatDate(this.singleEmployee.joining_date, this.DateFormat, 'en-US');
      this.singleEmployee.joining_date = formatedDate;
      this.subscription.add(this.employeeService.saveEmployee(this.singleEmployee).subscribe(
        (value: any) => {
          notify("Employee saved successfully", "success");
        }, error => {
          notify(error.meta.message, "error");
        }));
    }
  }
  getPositionsLookup() {
    this.subscription.add(this.positionsService.getAllPosition().subscribe(
      (value: any) => {
        this.positionLookup = value.data;
      }, error => {
        notify(error.meta.message, "error");
      }));
  }
  getEmployeesLookup() {
    this.subscription.add(this.employeeService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesLookup = value.data;
      }, error => {
        notify(error.meta.message, "error");
      }));
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
