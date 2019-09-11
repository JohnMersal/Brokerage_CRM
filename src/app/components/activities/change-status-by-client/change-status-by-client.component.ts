import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { CompoundsList } from '../../compounds/compounds';
import { unitsList } from '../../units/units-model';
import { Subscription } from 'rxjs';
import { PrimaryAndExternalSale, InternalSale, AtivitiesListModel, ActivityModel } from '../ativities-model';
import { ActivitiesService } from "../activities.service";
import { ConcatSource } from 'webpack-sources';
declare var jQuery: any;


@Component({
  selector: 'app-change-status-by-client',
  templateUrl: './change-status-by-client.component.html',
  styleUrls: ['./change-status-by-client.component.scss']
})
export class ChangeStatusByClientComponent implements OnInit {
  @ViewChild("primarySaleStatusValidator") primarySaleStatusValidator: DxValidationGroupComponent;
  @ViewChild("resaleTypeValidator") resaleTypeValidator: DxValidationGroupComponent;
  @ViewChild("externalSaleStatusValidator") externalSaleStatusValidator: DxValidationGroupComponent;
  @ViewChild("internalSaleStatusValidator") internalSaleStatusValidator: DxValidationGroupComponent;
  mainTabsSwitch: string = "primary";
  mainTabsName: string = "Primary";
  @Input() compoundsLookup: CompoundsList[] = []
  @Input() unitsLookup: unitsList[] = [];
  @Input() selectedActivity: ActivityModel = new ActivityModel();
  @Output() afterSubmitted = new EventEmitter();
  _gridBoxValue: unitsList;
  get gridBoxValue(): unitsList {
    return this._gridBoxValue;
  }

  set gridBoxValue(value: unitsList) {
    this._gridSelectedRowKeys = value && [value] || [];
    this.internalSaleStatus_OBJ.unit_id = value.id;
    this._gridBoxValue = value;
  }

  _gridSelectedRowKeys: unitsList[] = [];
  get gridSelectedRowKeys(): unitsList[] {
    return this._gridSelectedRowKeys;
  }

  set gridSelectedRowKeys(value: unitsList[]) {
    this._gridBoxValue = value.length && value[0] || null;
    this._gridSelectedRowKeys = value;
  }
  displayExpr() {
    if (this.gridBoxValue) {
      var result;
      if (this.gridBoxValue.unit_type) {
        result += this.gridBoxValue.unit_type;
      }
      if (this.gridBoxValue.unit_code) {
        result += this.gridBoxValue.unit_code;
      }
      return result;
    }
  }
  primarySaleStatus_OBJ: PrimaryAndExternalSale = new PrimaryAndExternalSale();
  externalSaleStatus_OBJ: PrimaryAndExternalSale = new PrimaryAndExternalSale();
  internalSaleStatus_OBJ: InternalSale = new InternalSale();
  subscription: Subscription = new Subscription();
  constructor(private activityService: ActivitiesService) { }
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
  saveOnly() {
    this.subscription.add(this.activityService.saveActivity(this.selectedActivity).subscribe(
      (value: any) => {
        notify("Activity saved successfully", "success");
      }, error => {
        notify("error in saving.." + error.meta.message, "error");
      }));
  }
  submitPrimarySales() {
    if (this.primarySaleStatusValidator.instance.validate().isValid) {
      this.primarySaleStatus_OBJ.client_id = this.selectedActivity.client_id;
      this.primarySaleStatus_OBJ.activity_type = this.selectedActivity.activity_type;
      this.primarySaleStatus_OBJ.activity_status = "Won";
      this.primarySaleStatus_OBJ.activity_date = this.selectedActivity.activity_date;
      this.primarySaleStatus_OBJ.feedback = this.selectedActivity.feedback;

      this.saveOnly();
      this.subscription.add(this.activityService.submitPrimaryActivity(this.primarySaleStatus_OBJ).subscribe(
        (value: any) => {
          this.primarySaleStatus_OBJ = new PrimaryAndExternalSale();
          this.afterSubmitted.emit({ type: "Primary", obj: this.primarySaleStatus_OBJ });
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

      this.saveOnly();
      this.subscription.add(this.activityService.submitExternalActivity(this.externalSaleStatus_OBJ).subscribe(
        (value: any) => {
          this.externalSaleStatus_OBJ = new PrimaryAndExternalSale();
          this.afterSubmitted.emit({ type: "External", obj: this.externalSaleStatus_OBJ });
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

      this.saveOnly();
      this.subscription.add(this.activityService.submitInternalActivity(this.internalSaleStatus_OBJ).subscribe(
        (value: any) => {
          this.internalSaleStatus_OBJ = new InternalSale();
          this.afterSubmitted.emit({ type: "Internal", obj: this.internalSaleStatus_OBJ });
          notify("Activity submitted successfully", "success");
        }, error => {
          notify("error in submitting.." + error.Message, "error");
        }));
    }
  }
  step: number = 1;
  goToStep(stepNum: number) {
    if (stepNum == 2) {
      if (this.resaleTypeValidator.instance.validate().isValid) {
        this.step = stepNum;
        //(<any>jQuery('#collapseThree')).collapse();
      }
    } else if (stepNum == 1) {
      this.step = stepNum;
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
    //console.log(e, this.resaleTypeOptionObj.type);
    if (this.resaleTypeOptionObj.type == this.resaleTypeOption[1]) {
    }
  }
  selectingUnit(row: unitsList) {
    this.internalSaleStatus_OBJ.unit_id = row.id;
    notify("You select owned by: " + row.owner_name, "success");
  }
  unitOnValueChanged(e) {
    //console.log("unitOnValueChanged", this.gridBoxValue, this.gridSelectedRowKeys, this.internalSaleStatus_OBJ.unit_id);
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
