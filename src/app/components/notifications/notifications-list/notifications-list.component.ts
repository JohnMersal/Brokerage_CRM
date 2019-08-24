import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { NotificationsList, NotificationModel } from "../notifications-model";
import { NotificationsService } from "../notifications.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { NewActivityComponent } from '../../activities/new-activity/new-activity.component';
declare var jQuery: any;

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  @ViewChild('edit') EditComponent: NewActivityComponent;
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editnotification: NotificationModel = new NotificationModel();
  notificationsList: NotificationsList[] = [];
  subscription: Subscription = new Subscription();
  constructor(private notificationsService: NotificationsService) {
    this.getAllNotifications();
  }
  getAllNotifications() {
    this.subscription.add(this.notificationsService.getAllNotifications().subscribe(
      (value: any) => {
        this.notificationsList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  updateNotification() {
    if (this.editnotification.rem_date != null && this.editnotification.rem_desc != null) {
      this.subscription.add(this.notificationsService.updateNotification(this.editnotification).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.editnotification = new NotificationModel();
        }, error => {
          notify(error.error, "error");
        }));
    }
  }
  editRecord(e: any) {
    console.log(e.data);
    /*this.EditComponent.singleActivity = {
      id: e.data.id,
      activity_date: e.data.activity_date,
      activity_status: e.data.activity_status,
      activity_type: e.data.activity_type,
      client_id: e.data.client_data.id,
      feedback: e.data.feedback
    };*/
    //(<any>jQuery('#editnotificationModal')).modal('show');
  }
  afterSave() {
    this.getAllNotifications();
    //(<any>jQuery('#editnotificationModal')).modal('hide');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  ngOnInit() {
  }

}
