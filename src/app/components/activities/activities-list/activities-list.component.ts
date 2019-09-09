import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { AtivitiesListModel, ActivityModel, PrimaryAndExternalSale, InternalSale } from "../ativities-model";
import { ActivitiesService } from "../activities.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { NewActivityComponent } from '../../activities/new-activity/new-activity.component';
import { ClientsList } from '../../clients/clients-model';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { CompoundsList } from '../../compounds/compounds';
import { CompoundsService } from "../../compounds/compounds.service";
import { unitsList } from '../../units/units-model';
import { UnitsService } from "../../units/units.service";
declare var jQuery: any;

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss']
})
export class ActivitiesListComponent implements OnInit {
  @Input() filterByClient: number = null;
  @ViewChild('edit') EditComponent: NewActivityComponent;
  @ViewChild("primarySaleStatusValidator") primarySaleStatusValidator: DxValidationGroupComponent;
  @ViewChild("resaleTypeValidator") resaleTypeValidator: DxValidationGroupComponent;
  @ViewChild("externalSaleStatusValidator") externalSaleStatusValidator: DxValidationGroupComponent;
  @ViewChild("internalSaleStatusValidator") internalSaleStatusValidator: DxValidationGroupComponent;
 RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editActivity: ActivityModel = new ActivityModel();
  activitiesList: AtivitiesListModel[] = [];
  mainTabsSwitch: string = "primary";
  mainTabsName: string = "Primary";
  compoundsLookup: CompoundsList[] = []
  unitsLookup: unitsList[] = [];
  subscription: Subscription = new Subscription();
  constructor(private activityService: ActivitiesService, private compoundService: CompoundsService, private unitsService: UnitsService) {
    this.getAllActivities();
  }
  getAllActivities() {
    this.subscription.add(this.activityService.getAllActivities().subscribe(
      (value: any) => {
        if (this.filterByClient) {
          this.activitiesList = value.data.filter(x => x.client_data.id == this.filterByClient);
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
    if (e.rowType == "data" && e.column.cellTemplate != "changeStatusTemplate") {
      console.log(e.data);
      this.EditComponent.singleActivity = {
        id: e.data.id,
        activity_date: e.data.activity_date,
        activity_status: e.data.activity_status,
        activity_type: e.data.activity_type,
        client_id: e.data.client_data.id,
        feedback: e.data.feedback
      };
      (<any>jQuery('#editActivityModal')).modal('show');
    }
  }
  afterSave() {
    this.getAllActivities();
    (<any>jQuery('#editActivityModal')).modal('hide');
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
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
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
  selectedActivity: AtivitiesListModel = new AtivitiesListModel();
  submitPrimarySales() {
    if (this.primarySaleStatusValidator.instance.validate().isValid) {
      this.primarySaleStatus_OBJ.client_id = this.selectedActivity.client_data.id;
      this.primarySaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.primarySaleStatus_OBJ.activity_status = "Won";
      this.primarySaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.primarySaleStatus_OBJ.feedback = this.selectedActivity.feedback;
      this.subscription.add(this.activityService.submitPrimaryActivity(this.primarySaleStatus_OBJ).subscribe(
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
      this.externalSaleStatus_OBJ.client_id = this.selectedActivity.client_data.id;
      this.externalSaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.externalSaleStatus_OBJ.activity_status = "Won";
      this.externalSaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.externalSaleStatus_OBJ.feedback = this.selectedActivity.feedback;
      this.subscription.add(this.activityService.submitExternalActivity(this.externalSaleStatus_OBJ).subscribe(
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
      this.internalSaleStatus_OBJ.client_id = this.selectedActivity.client_data.id;
      this.internalSaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.internalSaleStatus_OBJ.activity_status = "Won";
      this.internalSaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.internalSaleStatus_OBJ.feedback = this.selectedActivity.feedback;
      this.subscription.add(this.activityService.submitInternalActivity(this.internalSaleStatus_OBJ).subscribe(
        (value: any) => {
          this.internalSaleStatus_OBJ = new InternalSale();
          (<any>jQuery('#changeStatusModal')).modal('hide');
          notify("Activity submitted successfully", "success");
        }, error => {
          notify("error in submitting.." + error.Message, "error");
        }));
    }
  }
  openChangeStatusModal(row: AtivitiesListModel) {
    this.selectedActivity = row;
    this.getCompoundsLookup();
    (<any>jQuery('#changeStatusModal')).modal('show');
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
