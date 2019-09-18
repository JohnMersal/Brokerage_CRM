import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { FixedPointsModel, TargetPointsModel, TargetPointUpdateModel } from "../gamifications-model";
import { GamificationsService } from "../gamifications.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { DxValidationGroupComponent } from 'devextreme-angular';
declare var jQuery: any;

@Component({
  selector: 'app-compitation',
  templateUrl: './compitation.component.html',
  styleUrls: ['./compitation.component.scss']
})
export class CompitationComponent implements OnInit {
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editTarget: TargetPointUpdateModel = new TargetPointUpdateModel();
  fixedPointsList: FixedPointsModel[] = [];
  targetPointsList: TargetPointsModel[] = [];
  assginToEmployee: number = null;
  DateTimeFormat = AppSettings.DateTimeDisplayFormat;
  DateFormat = AppSettings.DateDisplayFormat;
  maxDate: Date = new Date();
  subscription: Subscription = new Subscription();
  call_target_value: number = 0;
  meeting_target_value: number = 0;
  won_target_value: number = 0;
  showing_target_value: number = 0;
  targetPoint: number = 0;
  now: Date = new Date();
  tomorrow = new Date();

  constructor(private gamificationsService: GamificationsService) {
    this.getAllCompitionsPoints();
    this.getAllTargetPoints();
  }
  getAllCompitionsPoints() {
    this.subscription.add(this.gamificationsService.getFixedPoints().subscribe(
      (value: any) => {
        this.fixedPointsList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  getAllTargetPoints() {
    this.subscription.add(this.gamificationsService.getTargetPoints().subscribe(
      (value: any) => {
        this.targetPointsList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  publishTargetPoints() {
    if (this.DataValidator.instance.validate().isValid) {
      let formatedStartDate = formatDate(this.now, this.DateTimeFormat, 'en-US');
      let formatedEndDate = formatDate(this.tomorrow, this.DateTimeFormat, 'en-US');
      this.editTarget = {
        call_target_value: this.call_target_value,
        meeting_target_value: this.meeting_target_value,
        won_target_value: this.won_target_value,
        showing_target_value: this.showing_target_value,
        target_start: formatedStartDate,
        target_end: formatedEndDate,
        target_points: this.targetPoint,
        id:null
      };
      this.subscription.add(this.gamificationsService.updateTargetPoints(this.editTarget).subscribe(
        (value: any) => {
          notify("Lead published successfully", "success");
          this.getAllTargetPoints();
        }, error => {
          notify(error.meta.message, "error");
        }));
    }
  }
  updateTargetPoints() {
    if (this.DataValidator.instance.validate().isValid) {
      let formatedStartDate = formatDate(this.editTarget.target_start, this.DateTimeFormat, 'en-US');
      this.editTarget.target_start = formatedStartDate;
      let formatedEndDate = formatDate(this.editTarget.target_end, this.DateTimeFormat, 'en-US');
      this.editTarget.target_end = formatedEndDate;
      this.subscription.add(this.gamificationsService.updateTargetPoints(this.editTarget).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.getAllTargetPoints();
          (<any>jQuery('#editLevelModal')).modal('hide');
          this.editTarget = new TargetPointUpdateModel();
        }, error => {
          notify(error.meta.message, "error");
        }));
    }
  }
  editRecord(e: any) {
    let call_target_value, meeting_target_value, won_target_value, showing_target_value;
    for (let record of this.targetPointsList) {
      if (record.action == "Call") {
        call_target_value = record.target_points;
      } else if (record.action == "Meeting") {
        meeting_target_value = record.target_points;
      } else if (record.action == "Won") {
        won_target_value = record.target_points;
      } else if (record.action == "showing") {
        showing_target_value = record.target_points;
      }
    }
    this.editTarget = {
      id: e.data.id,
      call_target_value: call_target_value,
      meeting_target_value: meeting_target_value,
      won_target_value: won_target_value,
      showing_target_value: showing_target_value,
      target_start: e.data.target_start,
      target_end: e.data.target_end,
      target_points: e.data.target_points
    };
    (<any>jQuery('#editLevelModal')).modal('show');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  afterSave() {
    this.getAllCompitionsPoints();
    (<any>jQuery('#editLevelModal')).modal('hide');
  }
  ngOnInit() {
    this.tomorrow.setDate(this.now.getDate() + 1);
    this.tomorrow.setHours(10, 0b0, 0b0, 0b0);
  }

}
