import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ClientService } from "../../clients/client.service";
import { ActivityModel } from "../ativities-model";
import { ActivitiesService } from "../activities.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-activity',
  templateUrl: './new-activity.component.html',
  styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit {
  @Input() updateMode: boolean = false;
  _clientId: number;
  @Input()
  set clientId(value){
    this.singleActivity.id = value;
    this._clientId = value;
  };
  get clientId() {
    return this._clientId;
  }
  @Output() afterSave = new EventEmitter();
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  singleActivity: ActivityModel = new ActivityModel();
  clientsLookup = [];
  DateFormat = AppSettings.DateDisplayFormat;
  maxDate: Date = new Date();
  subscription: Subscription = new Subscription();
  constructor(private clientsService: ClientService, private activitiesService: ActivitiesService) {
    if (!this.clientId) this.getClientsLookup();
  }
  getClientsLookup() {
    this.subscription.add(this.clientsService.getAllClients().subscribe(
      (value: any) => {
        this.clientsLookup = value.data;
      }, error => {
        notify(error.meta.message, "error");
      }));
  }
  saveActivity() {
    if (this.DataValidator.instance.validate().isValid) {
      let formatedDate = formatDate(this.singleActivity.activity_date, this.DateFormat, 'en-US');
      this.singleActivity.activity_date = formatedDate;
      if (this.updateMode) {
        this.subscription.add(this.activitiesService.updateActivity(this.singleActivity).subscribe(
          (value: any) => {
            notify("Activity updated successfully", "success");
            this.afterSave.emit({ id: value, data: this.singleActivity });
            this.singleActivity = new ActivityModel();
          }, error => {
            notify(error.meta.message, "error");
          }));
      } else {
        this.subscription.add(this.activitiesService.saveActivity(this.singleActivity).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singleActivity });
            notify("Activity saved successfully", "success");
            this.singleActivity = new ActivityModel();
          }, error => {
            notify("error in saving.." + error.meta.message, "error");
          }));
      }
    }
  }
  ngOnInit() {
  }

}
