import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ClientService } from "../../clients/client.service";
import { AtivitiesListModel, ActivityModel, PrimaryAndExternalSale, InternalSale } from "../ativities-model";
import { ActivitiesService } from "../activities.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { CompoundsList } from '../../compounds/compounds';
import { CompoundsService } from "../../compounds/compounds.service";
import { unitsList } from '../../units/units-model';
import { UnitsService } from "../../units/units.service";
declare var jQuery: any;

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
    this.singleActivity.client_id = value;
    this._clientId = value;
  };
  get clientId() {
    return this._clientId;
  }
  @Output() afterSave = new EventEmitter();
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  @ViewChild("primarySaleStatusValidator") primarySaleStatusValidator: DxValidationGroupComponent;
  @ViewChild("resaleTypeValidator") resaleTypeValidator: DxValidationGroupComponent;
  @ViewChild("externalSaleStatusValidator") externalSaleStatusValidator: DxValidationGroupComponent;
  @ViewChild("internalSaleStatusValidator") internalSaleStatusValidator: DxValidationGroupComponent;
  singleActivity: ActivityModel = new ActivityModel();
  clientsLookup = [];
  DateFormat = AppSettings.DateDisplayFormat;
  maxDate: Date = new Date();
  mainTabsSwitch: string = "primary";
  mainTabsName: string = "Primary";
  compoundsLookup: CompoundsList[] = []
  unitsLookup: unitsList[] = [];
  subscription: Subscription = new Subscription();
  constructor(private clientsService: ClientService, private activitiesService: ActivitiesService, private compoundService: CompoundsService, private unitsService: UnitsService) {
    //if (!this.clientId) this.getClientsLookup();
    this.singleActivity.activity_status = "Ongoing";
    this.singleActivity.activity_date = this.maxDate;
    if (this.clientId) {
      this.singleActivity.client_id = this.clientId;
    }
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
            this.afterSave.emit({ id: value, data: this.singleActivity });
            notify("Activity updated successfully", "success");
            this.singleActivity = new ActivityModel();
          }, error => {
            notify(error.meta.message, "error");
          }));
      } else {
        if (this.singleActivity.activity_status == "Won") {
          this.openChangeStatusModal(this.singleActivity);
        } else {
          this.saveOnly();
        }
      }
    }
  }
  saveOnly() {
    this.subscription.add(this.activitiesService.saveActivity(this.singleActivity).subscribe(
      (value: any) => {
        this.afterSave.emit({ id: value, data: this.singleActivity });
        notify("Activity saved successfully", "success");
        this.singleActivity = new ActivityModel();
      }, error => {
        notify("error in saving.." + error.meta.message, "error");
      }));
  }
  getCompoundsLookup() {
    this.subscription.add(this.compoundService.getAllCompounds().subscribe(
      (value: any) => {
        this.compoundsLookup = value.data;
      }, error => {
        notify('error in loading compounds list..', 'error');
      }));
  }
  getUnitsLookup() {
    this.subscription.add(this.unitsService.getAllUnits().subscribe(
      (value: any) => {
        this.unitsLookup = value.data;
      }, error => {
        notify('error in loading units list..', 'error');
      }));

  }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "primary":
        //this.activitysubmit.type_of_sale = "primary";
        this.mainTabsName = "Primary";
        break;
      case "resale":
        //this.activitysubmit.type_of_sale = "";
        this.mainTabsName = "Resale";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  primarySaleStatus_OBJ: PrimaryAndExternalSale = new PrimaryAndExternalSale();
  externalSaleStatus_OBJ: PrimaryAndExternalSale = new PrimaryAndExternalSale();
  internalSaleStatus_OBJ: InternalSale = new InternalSale();
  selectedActivity: ActivityModel = new ActivityModel();
  submitPrimarySales() {
    if (this.primarySaleStatusValidator.instance.validate().isValid) {
      this.primarySaleStatus_OBJ.client_id = this.selectedActivity.client_id;
      this.primarySaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.primarySaleStatus_OBJ.activity_status = "Won";
      this.primarySaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.primarySaleStatus_OBJ.feedback = this.selectedActivity.feedback;
      this.subscription.add(this.activitiesService.submitPrimaryActivity(this.primarySaleStatus_OBJ).subscribe(
        (value: any) => {
          this.primarySaleStatus_OBJ = new PrimaryAndExternalSale();
          (<any>jQuery('#changeStatusModal')).modal('hide');
          notify("Activity submitted successfully", "success");
        }, error => {
          notify("error in submitting.." + error.Message, "error");
        }));
    }
  }
  submitExternalSales() {
    if (this.externalSaleStatusValidator.instance.validate().isValid) {
      this.externalSaleStatus_OBJ.client_id = this.selectedActivity.client_id;
      this.externalSaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.externalSaleStatus_OBJ.activity_status = "Won";
      this.externalSaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.externalSaleStatus_OBJ.feedback = this.selectedActivity.feedback;
      this.subscription.add(this.activitiesService.submitExternalActivity(this.externalSaleStatus_OBJ).subscribe(
        (value: any) => {
          this.externalSaleStatus_OBJ = new PrimaryAndExternalSale();
          (<any>jQuery('#changeStatusModal')).modal('hide');
          notify("Activity submitted successfully", "success");
        }, error => {
          notify("error in submitting.." + error.Message, "error");
        }));
    }
  }
  submitinternalSales() {
    if (this.internalSaleStatusValidator.instance.validate().isValid) {
      this.internalSaleStatus_OBJ.client_id = this.selectedActivity.client_id;
      this.internalSaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.internalSaleStatus_OBJ.activity_status = "Won";
      this.internalSaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.internalSaleStatus_OBJ.feedback = this.selectedActivity.feedback;
      this.subscription.add(this.activitiesService.submitInternalActivity(this.internalSaleStatus_OBJ).subscribe(
        (value: any) => {
          this.internalSaleStatus_OBJ = new InternalSale();
          (<any>jQuery('#changeStatusModal')).modal('hide');
          notify("Activity submitted successfully", "success");
        }, error => {
          notify("error in submitting.." + error.Message, "error");
        }));
    }
  }
  openChangeStatusModal(row: ActivityModel) {
    this.selectedActivity = row;
    this.getCompoundsLookup();
    this.getUnitsLookup();
    (<any>jQuery('#changeStatusModal')).modal('show');
  }
  afterSubmittedStatusChanges(e) {
    (<any>jQuery('#changeStatusModal')).modal('hide');
  }
  goToStep(stepNum: number) {
    if (stepNum == 2) {
      if (this.resaleTypeValidator.instance.validate().isValid) {
        (<any>jQuery('#collapseThree')).collapse();
      }
    }
  }
  resaleTypeOption = ['External SALE ( External Broker )', 'Internal SALE (Broker from within the company)'];
  resaleTypeOptionObj = {
    type: null,
    selectedUnit: [],
    selectedClient: null,
    activity_type: "",
    activity_status: "",
    feedback: "",
  };
  resaleTypeOptionChanged(e) {
    console.log(e, this.resaleTypeOptionObj.type);
    if (this.resaleTypeOptionObj.type == this.resaleTypeOption[1]) {
      this.getUnitsLookup();
    }
  }
  selectedUnit: unitsList = new unitsList();
  selectingUnit(row: unitsList) {
    this.internalSaleStatus_OBJ.unit_id = row.id;
    notify("You select owned by: " + row.owner_name, "success");
  }
  ngOnInit() {
  }

}
