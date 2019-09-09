import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import notify from 'devextreme/ui/notify';
import { SelectionModel } from '@angular/cdk/collections';
import { ClientsList, ClientsModel } from "../clients-model";
import { ClientService } from "../client.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { UnitsModel, unitsList } from '../../units/units-model';
import { NewClientComponent } from "../new-client/new-client.component";
import { ActivityClient } from "../../activities/ativities-model";
import { ActivitiesService } from "../../activities/activities.service";
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
declare var jQuery: any;

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  @ViewChild('editClientComponent') editClientComponent: NewClientComponent;
  @ViewChild("activityStatusValidator") activityStatusValidator: DxValidationGroupComponent;
  @ViewChild("resaleTypeValidator") resaleTypeValidator: DxValidationGroupComponent;
  editClient: ClientsModel = new ClientsModel();
  clientList: ClientsList[] = [];
  areasLookup = [];
  mainTabsSwitch: string = "primary";
  mainTabsName: string = "Primary";
  resaleTypeOption = ['External SALE ( External Broker )', 'Internal SALE (Broker from within the company)'];
  resaleTypeOptionObj = {
    type: null,
    selectedUnit: [],
    selectedClient: null,
    activity_type: "",
    activity_status: "",
    feedback: "",

  };
  activitysubmit: ActivityClient = new ActivityClient();
  dataSource;
  subscription: Subscription = new Subscription();
  constructor(private clientsService: ClientService, private activitiesService: ActivitiesService, private router: Router,) {
    this.getAllClients();
  }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "primary":
        this.activitysubmit.type_of_sale = "primary";
        this.mainTabsName = "Primary";
        break;
      case "resale":
        this.activitysubmit.type_of_sale = "";
        this.mainTabsName = "Resale";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  resaleTypeOptionChanged(e) {
    console.log(e, this.resaleTypeOptionObj.type);
    if (e.value == "Internal SALE (Broker from within the company)") {
      this.activitysubmit.type_of_sale = "internal";
    } else if (e.value == "External SALE ( External Broker )") {
      this.activitysubmit.type_of_sale = "external";
    }
  }
  selectedUnit(row: unitsList) {
    this.resaleTypeOptionObj.selectedUnit[0] = row;
    notify("You select owned by: " + row.owner_name, "success");
  }
  ngOnInit() {
  }
  getAllClients() {
    this.subscription.add(this.clientsService.getAllClients().subscribe(
      (value: any) => {
        this.clientList = value.data;
        this.dataSource = new MatTableDataSource(this.clientList);
      }, error => {
        notify("error in loading clients.." + error.error, "error");
      }));
  }
  editRecord(e: any) {
    if (e.rowType == "data" && e.column.cellTemplate != "changeStatusTemplate") {
      this.router.navigate(['client/'+e.data.id]);
      /*Object.assign(this.editClientComponent.singleClient, e.data);
      this.editClientComponent.singleClient.budget_from = e.data.client.budget_from;
      this.editClientComponent.singleClient.budget_to = e.data.client.budget_to;
      this.editClientComponent.singleClient.request_type = e.data.client.request_type;
      (<any>jQuery('#editClientModal')).modal('show');*/
    }
  }
  afterSaveClient(e) {
    this.getAllClients();
    (<any>jQuery('#editClientModal')).modal('hide');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  openChangeStatusModal(row: ClientsList) {
    this.resaleTypeOptionObj.selectedClient = row;
    (<any>jQuery('#changeStatusModal')).modal('show');
  }
  submitActivity() {
    // this.activitysubmit.unit_id = this.resaleTypeOptionObj.selectedUnit[0].id;
    // this.activitysubmit.type_of_sale = this.resaleTypeOptionObj.type;
    // this.activitysubmit.activity_date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    // this.activitysubmit.activity_status = this.resaleTypeOptionObj.activity_status;
    // this.activitysubmit.activity_type = this.resaleTypeOptionObj.activity_type;
    // this.activitysubmit.client_id = this.resaleTypeOptionObj.selectedClient.id;
    // this.activitysubmit.feedback = this.resaleTypeOptionObj.feedback;
    // this.subscription.add(this.activitiesService.submitActivity(this.activitysubmit).subscribe(
    //   (value: any) => {
    //     notify("Activity submitted successfully", "success");
    //   }, error => {
    //     notify("error in submitting.." + error.Message, "error");
    //   }));
  }
  backToStep(stepNum: number) {
    if (stepNum == 1) {
      (<any>jQuery('#collapseOne')).collapse();
    } else if (stepNum == 2) {
      (<any>jQuery('#collapseTwo')).collapse();
    }
  }
  goToStep(stepNum: number) {
    if (stepNum == 2) {
      if (this.activityStatusValidator.instance.validate().isValid) {
        (<any>jQuery('#collapseTwo')).collapse();
      }
    } else if (stepNum == 3) {
      if (this.resaleTypeValidator.instance.validate().isValid) {
        (<any>jQuery('#collapseThree')).collapse();
      }
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
