import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { HappyHoursModel, HappyHourUpdateModel } from "../gamifications-model";
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
  assginToEmployee: number = null;
  DateTimeFormat = AppSettings.DateTimeDisplayFormat;
  maxDate: Date = new Date();
  subscription: Subscription = new Subscription();
  constructor(private gamificationsService: GamificationsService) {
    this.getAllHappyHourPoints();
  }
  getAllHappyHourPoints() {
    this.subscription.add(this.gamificationsService.getHappyHourPoints().subscribe(
      (value: any) => {
        this.HappyHoursList = value.data;
      }, error => {
        console.log(error);
      }));
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
          (<any>jQuery('#editLevelModal')).modal('hide');
          this.editHappyHour = new HappyHourUpdateModel();
        }, error => {
          notify(error.meta.message, "error");
        }));
    }
  }
  editRecord(e: any) {
    //if (e.rowType == "data") {
    let call_HappyHour_points, meeting_HappyHour_points, won_HappyHour_points;
    for (let record of this.HappyHoursList){
      if (record.action == "Call") {
        call_HappyHour_points = record.happy_points;
      } else if (record.action == "Meeting") {
        meeting_HappyHour_points = record.happy_points;
      } else if (record.action == "Won") {
        won_HappyHour_points = record.happy_points;
      }
    }
      this.editHappyHour = {
        id: e.data.id,
        call_HappyHour_points: call_HappyHour_points,
        meeting_HappyHour_points: meeting_HappyHour_points,
        won_HappyHour_points: won_HappyHour_points,
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
