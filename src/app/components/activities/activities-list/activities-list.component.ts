import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { AtivitiesListModel, ActivityModel } from "../ativities-model";
import { ActivitiesService } from "../activities.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { NewActivityComponent } from '../../activities/new-activity/new-activity.component';
declare var jQuery: any;

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss']
})
export class ActivitiesListComponent implements OnInit {
  @Input() filterByClient: number = null;
  @ViewChild('edit') EditComponent: NewActivityComponent;
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editActivity: ActivityModel = new ActivityModel();
  activitiesList: AtivitiesListModel[] = [];
  subscription: Subscription = new Subscription();
  constructor(private activityService: ActivitiesService) {
    this.getAllActivities();
  }
  getAllActivities() {
    this.subscription.add(this.activityService.getAllActivities().subscribe(
      (value: any) => {
        if (this.filterByClient) {
          this.activitiesList = value.data.filter(x => x.id == this.filterByClient);
        } else {
          this.activitiesList = value.data;
        }
      }, error => {
        console.log(error);
      }));
  }
  updateActivity() {
    if (this.editActivity.client_id != null && this.editActivity.activity_type != null && this.editActivity.activity_status != null && this.editActivity.feedback != null) {
      this.subscription.add(this.activityService.updateActivity(this.editActivity).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.editActivity = new ActivityModel();
        }, error => {
          notify(error.error, "error");
        }));
    }
  }
  editRecord(e: any) {
    console.log(e.data);
    this.EditComponent.singleActivity = {
      id: e.data.id,
      activity_date: e.data.activity_date,
      activity_status: e.data.activity_status,
      activity_type: e.data.activity_type,
      client_id: e.data.client_data.id,
      feedback: e.data.feedback
    };
    // this.editActivity = {
    //   id: e.data.id,
    //   activity_date: e.data.activity_date,
    //   activity_status: e.data.activity_status,
    //   activity_type: e.data.activity_type,
    //   client_id: e.data.client_id,
    //   feedback: e.data.feedback
    // };
    (<any>jQuery('#editActivityModal')).modal('show');
  }
  afterSave() {
    this.getAllActivities();
    (<any>jQuery('#editActivityModal')).modal('hide');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  ngOnInit() {
  }

}
