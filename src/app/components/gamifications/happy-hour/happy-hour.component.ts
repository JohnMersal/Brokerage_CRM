import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { HappyHoursModel, HappyHourUpdateModel, FixedPointsModel } from "../gamifications-model";
import { GamificationsService } from "../gamifications.service";
//import { NewLevelComponent } from "../new-level/new-level.component";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { DxValidationGroupComponent } from 'devextreme-angular';
declare var jQuery: any;

@Component({
  selector: 'app-happy-hour',
  templateUrl: './happy-hour.component.html',
  styleUrls: ['./happy-hour.component.scss']
})
export class HappyHourComponent implements OnInit {
  //@ViewChild('edit') EditComponent: NewLevelComponent;
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editHappyHour: HappyHourUpdateModel = new HappyHourUpdateModel();
  HappyHoursList: HappyHoursModel[] = [];
  fixedPointsList: FixedPointsModel[] = [];
  callFixedPoint: number = 0;
  meetingFixedPoint: number = 0;
  wonFixedPoint: number = 0;
  showingFixedPoint: number = 0;
  choosenPoint: string = "2X";
  calculateChoosenPoint: number;
  choosenDate: string = "24 Hour";
  calculateChoosenDate: number = 0;
  assginToEmployee: number = null;
  DateTimeFormat = AppSettings.DateTimeDisplayFormat;
  maxDate: Date = new Date();
  subscription: Subscription = new Subscription();
  constructor(private gamificationsService: GamificationsService) {
    this.getAllHappyHourPoints();
    this.getAllFixedPoints();
  }
  getAllHappyHourPoints() {
    this.subscription.add(this.gamificationsService.getHappyHourPoints().subscribe(
      (value: any) => {
        this.HappyHoursList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  getAllFixedPoints() {
    this.subscription.add(this.gamificationsService.getFixedPoints().subscribe(
      (value: any) => {
        this.fixedPointsList = value.data;
        for (let item of this.fixedPointsList) {
          if (item.action == "Call") {
            this.callFixedPoint = item.fixed_points;
          } else if (item.action == "Meeting") {
            this.meetingFixedPoint = item.fixed_points;
          } else if (item.action == "Won") {
            this.wonFixedPoint = item.fixed_points;
          } else if (item.action == "Showing") {
            this.showingFixedPoint = item.fixed_points;
          }
        }
        this.calculateTargetPoiint();
        this.calculateTargetDate();
      }, error => {
        console.log(error);
      }));
  }
  calculateTargetPoiint() {
    if (this.choosenPoint == "2X") {
      this.calculateChoosenPoint = 2;
    } else if (this.choosenPoint == "3X") {
      this.calculateChoosenPoint = 3;
    } else if (this.choosenPoint == "4X") {
      this.calculateChoosenPoint = 4;
    } else if (this.choosenPoint == "5X") {
      this.calculateChoosenPoint = 5;
    }
    this.editHappyHour.call_HappyHour_points = this.calculateChoosenPoint * this.callFixedPoint;
    this.editHappyHour.meeting_HappyHour_points = this.calculateChoosenPoint * this.meetingFixedPoint;
    this.editHappyHour.showing_HappyHour_points = this.calculateChoosenPoint * this.showingFixedPoint;
    this.editHappyHour.won_HappyHour_points = this.calculateChoosenPoint * this.wonFixedPoint;
  }
  calculateTargetDate() {
    if (this.choosenDate == "1 Hour") {
      this.calculateChoosenDate = 1;
    } else if (this.choosenDate == "2 Hour") {
      this.calculateChoosenDate = 2;
    } else if (this.choosenDate == "3 Hour") {
      this.calculateChoosenDate = 3;
    } else if (this.choosenDate == "24 Hour") {
      this.calculateChoosenDate = 24;
    }
    this.editHappyHour.happy_start = new Date(Date.now());
    var date = new Date();
    var dateWithTime = this.editHappyHour.happy_start.getHours();
    var calDate = date.setHours(dateWithTime + this.calculateChoosenDate);
    this.editHappyHour.happy_end = new Date(calDate);

    console.log("calculateTargetDate", this.editHappyHour.happy_end);
  }
  updateHappyHourPoints() {
    if (this.DataValidator.instance.validate().isValid) {
      let formatedStartDate = formatDate(this.editHappyHour.happy_start, this.DateTimeFormat, 'en-US');
      this.editHappyHour.happy_start = formatedStartDate;
      let formatedEndDate = formatDate(this.editHappyHour.happy_end, this.DateTimeFormat, 'en-US');
      this.editHappyHour.happy_end = formatedEndDate;
      this.subscription.add(this.gamificationsService.updateHappyHourPoints(this.editHappyHour).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.getAllHappyHourPoints();
          //(<any>jQuery('#editLevelModal')).modal('hide');
          //this.editHappyHour = new HappyHourUpdateModel();

        }, error => {
          notify(error.meta.message, "error");
        }));
    }
  }
  editRecord(e: any) {
    //if (e.rowType == "data") {
    let call_HappyHour_points, meeting_HappyHour_points, won_HappyHour_points, Showing_HappyHour_points;
    for (let record of this.HappyHoursList) {
      if (record.action == "Call") {
        call_HappyHour_points = record.happy_points;
      } else if (record.action == "Meeting") {
        meeting_HappyHour_points = record.happy_points;
      } else if (record.action == "Won") {
        won_HappyHour_points = record.happy_points;
      } else if (record.action == "Showing") {
        Showing_HappyHour_points = record.happy_points
      }
    }
    this.editHappyHour = {
      id: e.data.id,
      call_HappyHour_points: call_HappyHour_points,
      meeting_HappyHour_points: meeting_HappyHour_points,
      won_HappyHour_points: won_HappyHour_points,
      showing_HappyHour_points: Showing_HappyHour_points,
      happy_start: e.data.happy_start,
      happy_end: e.data.happy_end,

    };
    (<any>jQuery('#editLevelModal')).modal('show');
    //}
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  afterSave() {
    this.getAllHappyHourPoints();
    (<any>jQuery('#editLevelModal')).modal('hide');
  }
  ngOnInit() {
  }

}
