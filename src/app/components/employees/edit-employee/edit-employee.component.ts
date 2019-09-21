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
import { HappyHoursModel, TargetPointsModel } from "../../gamifications/gamifications-model";
import { GamificationsService } from "../../gamifications/gamifications.service";
import notify from 'devextreme/ui/notify';
declare var jQuery: any;

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  subtitle: string;
  ID: number = 0;
  singleEmployee: Employees = new Employees();
  assignMode: boolean = false;
  toAnotherId: number;
  date = new FormControl(new Date());
  leads: leadsList[] = [];
  activities: AtivitiesListModel[] = [];
  activityWon: number = 0;
  activityCalls: number = 0;
  activityShowing: number = 0;
  activityOnGoing: number = 0;
  activityLost: number = 0;
  salesValue: string = "EGP not yet";
  levels: levelsList[] = [];
  currentLevel: LevelModel = new LevelModel();
  nextLevel: LevelModel = new LevelModel();
  HappyHoursList: HappyHoursModel[] = [];
  badgesCallClass: string;
  badgesMeetingClass: string;
  badgesShowingClass: string;
  badgesWonClass: string;
  employeesLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private router: Router, private route: ActivatedRoute, private employeesService: EmployeesService, private leadsServices: LeadsService, private activitiesService: ActivitiesService, private levelsService: LevelsService, private gamificationsService: GamificationsService) {
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
        if (this.singleEmployee.numOfActivites) {
          if (this.singleEmployee.numOfActivites.calls) {
            if (this.singleEmployee.numOfActivites.calls >= 50) {
              this.badgesCallClass = "Bronze";
            } else if (this.singleEmployee.numOfActivites.calls >= 100) {
              this.badgesCallClass = "Silver";
            } else if (this.singleEmployee.numOfActivites.calls >= 150) {
              this.badgesCallClass = "Gold";
            } else if (this.singleEmployee.numOfActivites.calls >= 200) {
              this.badgesCallClass = "Platinum";
            } else if (this.singleEmployee.numOfActivites.calls >= 300) {
              this.badgesCallClass = "Diamond";
            }
          }
          if (this.singleEmployee.numOfActivites.meetings) {
            if (this.singleEmployee.numOfActivites.meetings >= 1) {
              this.badgesCallClass = "Bronze";
            } else if (this.singleEmployee.numOfActivites.meetings >= 2) {
              this.badgesCallClass = "Silver";
            } else if (this.singleEmployee.numOfActivites.meetings >= 3) {
              this.badgesCallClass = "Gold";
            } else if (this.singleEmployee.numOfActivites.meetings >= 5) {
              this.badgesCallClass = "Platinum";
            } else if (this.singleEmployee.numOfActivites.meetings >= 7) {
              this.badgesCallClass = "Diamond";
            }
          }
          if (this.singleEmployee.numOfActivites.showings) {
            if (this.singleEmployee.numOfActivites.showings >= 1) {
              this.badgesCallClass = "Bronze";
            } else if (this.singleEmployee.numOfActivites.showings >= 2) {
              this.badgesCallClass = "Silver";
            } else if (this.singleEmployee.numOfActivites.showings >= 3) {
              this.badgesCallClass = "Gold";
            } else if (this.singleEmployee.numOfActivites.showings >= 5) {
              this.badgesCallClass = "Platinum";
            } else if (this.singleEmployee.numOfActivites.showings >= 7) {
              this.badgesCallClass = "Diamond";
            }
          }
          if (this.singleEmployee.numOfActivites.wons) {
            if (this.singleEmployee.numOfActivites.wons >= 1) {
              this.badgesCallClass = "Bronze";
            } else if (this.singleEmployee.numOfActivites.wons >= 2) {
              this.badgesCallClass = "Silver";
            } else if (this.singleEmployee.numOfActivites.wons >= 3) {
              this.badgesCallClass = "Gold";
            } else if (this.singleEmployee.numOfActivites.wons >= 4) {
              this.badgesCallClass = "Platinum";
            } else if (this.singleEmployee.numOfActivites.wons >= 5) {
              this.badgesCallClass = "Diamond";
            }
          }
        }
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
      position_id: this.singleEmployee.position_id,
      team_leader_id: this.singleEmployee.team_leader_id,
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
        if (this.singleEmployee.employee.level) {
          this.currentLevel = this.singleEmployee.employee.level;
          var findIndex = this.levels.findIndex(x => x.id == this.currentLevel.id);
          if (findIndex > -1) {
            this.nextLevel = this.levels[findIndex + 1];
          }
        }
        //this.levels.filter(x => x.value == this.singleEmployee.employee.level.value);
      }));
  }
  getRelatedActivities() {
    this.subscription.add(this.activitiesService.getAllActivities().subscribe(
      (value: any) => {
        //this.getAllHappyHourPoints();
        this.activities = value.data.filter(x => x.created_by.id == this.singleEmployee.id);
        var activityWonCalc = this.activities.filter(x => x.activity_status == "Won");
        this.activityWon = activityWonCalc.length;
        var activityCallsCalc = this.activities.filter(x => x.activity_type == "Call");
        this.activityCalls = activityCallsCalc.length;
        var activityShowingCalc = this.activities.filter(x => x.activity_type == "Showing");
        this.activityShowing = activityShowingCalc.length;
        var activityOnGoingCalc = this.activities.filter(x => x.activity_status == "Ongoing");
        this.activityOnGoing = activityOnGoingCalc.length;
        var activityLostCalc = this.activities.filter(x => x.activity_status == "Lost");
        this.activityLost = activityLostCalc.length;
      }));
  }
  getAllHappyHourPoints() {
    this.subscription.add(this.gamificationsService.getHappyHourPoints().subscribe(
      (value: any) => {
        this.HappyHoursList = value.data;
        /*for (let record of this.HappyHoursList) {
          if (record.action == "Call") {
            this.badgesCall = record.happy_points * this.activityCalls;
          } else if (record.action == "Meeting") {
            this.badgesMeeting = record.happy_points * this.activityWon;
          } else if (record.action == "Won") {
            this.badgesWon = record.happy_points * this.activityWon;
          } else if (record.action == "Showing") {
            this.badgesShowing = record.happy_points * this.activityShowing;
          }
        }*/
      }, error => {
        console.log(error);
      }));
  }
  openReassignWorkModal() {
    if (!this.employeesLookup || this.employeesLookup.length == 0) this.getEmployeesLookup();
    (<any>jQuery('#reassignModal')).modal('show');
  }
  getEmployeesLookup() {
    this.subscription.add(this.employeesService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesLookup = value.data;
      }, error => {
        console.log(error);
      }));
  }
  assignworkToAnother() {
    this.subscription.add(this.employeesService.reassignWork(this.singleEmployee.id, this.toAnotherId).subscribe(
      (value: any) => {
        (<any>jQuery('#reassignModal')).modal('hide');
        notify("works assigned to another employee successfully", "success");
      }));
  }

  ngOnInit() {
  }

}
