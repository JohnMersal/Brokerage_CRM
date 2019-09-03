import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { BrokerModel, BrokersList } from "../broker-model";
import { BrokersService } from "../brokers.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { NewBrokerComponent } from "../new-broker/new-broker.component";
import { DxValidationGroupComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
declare var jQuery: any;

@Component({
  selector: 'app-brokers-list',
  templateUrl: './brokers-list.component.html',
  styleUrls: ['./brokers-list.component.scss']
})
export class BrokersListComponent implements OnInit {
  brokerList: BrokersList[] = [];
  subscription: Subscription = new Subscription();
  constructor(private brokersService: BrokersService) {
    this.getAllUnits();
  }

  ngOnInit() {
  }
  getAllUnits() {
    this.subscription.add(this.brokersService.getAllBroker().subscribe(
      (value: any) => {
        this.brokerList = value.data;
        //notify(" successfully", "success");
      }, error => {
        notify("error in loading compounds.." + error.meta.message, "error");
      }));
  }
}
