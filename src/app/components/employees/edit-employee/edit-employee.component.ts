import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";
import { FormControl } from '@angular/forms';
import { Employee, Employees, singleEmployee } from "../employees";
import { EmployeesService } from "../employees.service";
import { leadsList } from "../../leads/leads-model";
import { LeadsService } from "../../leads/leads.service";
import { AtivitiesListModel } from "../../activities/ativities-model";
import { ActivitiesService } from "../../activities/activities.service";
import { levelsList, LevelModel } from "../../gamifications/levels/levels-model";
import { LevelsService } from "../../gamifications/levels/levels.service";
import notify from 'devextreme/ui/notify';

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
  leads: leadsList[] = [];
  activities: AtivitiesListModel[] = [];
  activityWon: number = 0;
  activityCalls: number = 0;
  activityOnGoing: number = 0;
  activityLost: number = 0;
  salesValue: string = "EGP not yet";
  levels: levelsList[] = [];
  currentLevel: LevelModel = new LevelModel();
  nextLevel: LevelModel = new LevelModel();

  subscription: Subscription = new Subscription();
  constructor(private router: Router, private route: ActivatedRoute, private employeesService: EmployeesService, private leadsServices: LeadsService, private activitiesService: ActivitiesService, private levelsService: LevelsService) { 
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
        this.getRelatedLeads();
        this.getRelatedActivities();
        this.getRelatedLevel();
      }));
  }
  updateEmployee() {
    var employee = new singleEmployee();
    employee = {
      first_name: this.singleEmployee.first_name,
      second_name: this.singleEmployee.second_name,
      email: this.singleEmployee.email,
      gender: this.singleEmployee.gender,
      job_title: this.singleEmployee.employee.job_title,
      joining_date: this.singleEmployee.employee.joining_date,
      mobile: this.singleEmployee.mobile,
      national_id: this.singleEmployee.employee.national_id,
      password: null,
      active: this.singleEmployee.active,
      profile_picture: this.singleEmployee.employee.profile_picture,
      id: this.singleEmployee.id
    };
    this.subscription.add(this.employeesService.updateEmployee(employee).subscribe(
      (value: any) => {
        notify("Employee updated successfully", "success");
      }));
  }
  getRelatedLeads() {
    this.subscription.add(this.leadsServices.getAllLeads().subscribe(
      (value: any) => {
        this.leads = value.data.filter(x => x.reassigned_to.id == this.singleEmployee.id);
      }));
  }
  getRelatedLevel() {
    this.subscription.add(this.levelsService.getAllLevels().subscribe(
      (value: any) => {
        this.levels = value.data;
        this.currentLevel = this.singleEmployee.employee.level;
        var findIndex = this.levels.findIndex(x => x.id == this.currentLevel.id);
        if (findIndex > -1) {
          this.nextLevel = this.levels[findIndex + 1];
        }
        //this.levels.filter(x => x.value == this.singleEmployee.employee.level.value);
      }));
  }
  getRelatedActivities() {
    this.subscription.add(this.activitiesService.getAllActivities().subscribe(
      (value: any) => {
        this.activities = value.data.filter(x => x.created_by.id == this.singleEmployee.id);
        var activityWonCalc = this.activities.filter(x => x.activity_status == "Won");
        this.activityWon = activityWonCalc.length;
        var activityCallsCalc = this.activities.filter(x => x.activity_type == "Call");
        this.activityCalls = activityCallsCalc.length;
        var activityOnGoingCalc = this.activities.filter(x => x.activity_status == "Ongoing");
        this.activityOnGoing = activityOnGoingCalc.length;
        var activityLostCalc = this.activities.filter(x => x.activity_status == "Lost");
        this.activityLost = activityLostCalc.length;
      }));
  }

  ngOnInit() {
  }

}
