import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ClientService } from "../../clients/client.service";
import { BrokerModel } from "../broker-model";
import { BrokersService } from "../brokers.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-broker',
  templateUrl: './new-broker.component.html',
  styleUrls: ['./new-broker.component.scss']
})
export class NewBrokerComponent implements OnInit {
  @Input() updateMode: boolean = false;
  @Output() afterSave = new EventEmitter();
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  singleBroker: BrokerModel = new BrokerModel();
  DateFormat = AppSettings.DateDisplayFormat;
  maxDate: Date = new Date();
  subscription: Subscription = new Subscription();
  constructor(private clientsService: ClientService, private brokersService: BrokersService) {
  }
  saveBroker() {
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode) {
        /*this.subscription.add(this.brokersService.updateActivity(this.singleBroker).subscribe(
          (value: any) => {
            notify("Activity updated successfully", "success");
            this.afterSave.emit({ id: value, data: this.singleBroker });
            this.singleBroker = new BrokerModel();
          }, error => {
            notify(error.meta.message, "error");
          }));*/
      } else {
        this.subscription.add(this.brokersService.saveBroker(this.singleBroker).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singleBroker });
            notify("Activity saved successfully", "success");
            this.singleBroker = new BrokerModel();
          }, error => {
            notify("error in saving.." + error.meta.message, "error");
          }));
      }
    }
  }
  ngOnInit() {
  }

}
