import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { ClientsList, ClientsModel } from "../clients-model";
import { ClientService } from "../client.service";
import { AreasService } from '../../areas/areas.service';
import notify from 'devextreme/ui/notify';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ActivitiesListComponent } from "../../activities/activities-list/activities-list.component";
import { ActivatedRoute, Router } from '@angular/router';
import { unitsList } from '../../units/units-model';
import { UnitsService } from "../../units/units.service";
import { AppSettings } from '../../shared/app-settings';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  @Output() afterSave = new EventEmitter();
  @Input() updateMode: boolean = false;
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  @ViewChild('activitiesListComponent') activitiesListComponent: ActivitiesListComponent;
  clientFormGroup: FormGroup;
  singleClient: ClientsModel = new ClientsModel();
  areasLookup = [];
  subscription: Subscription = new Subscription();
  interestedUnitsLoaded: boolean = false;
  clientID: number;
  unitsLookup: unitsList[] = [];
  _gridBoxValue: number[];
  get gridBoxValue() {
    return this._gridBoxValue;
  }

  set gridBoxValue(value: number[]) {
    //this._gridSelectedRowKeys = value || [];
    this._gridBoxValue = value;
  }

  _gridSelectedRowKeys: number[] = [];
  get gridSelectedRowKeys(): number[] {
    return this._gridSelectedRowKeys;
  }

  set gridSelectedRowKeys(value: number[]) {
    //this._gridBoxValue = value || null;
    this._gridSelectedRowKeys = value;
  }
  constructor(private clientsSrvice: ClientService, private formBuilder: FormBuilder, private areasService: AreasService, public route: ActivatedRoute, public router: Router, private unitsService: UnitsService) {
    this.creatAreaForm();
    this.getRecord();
    this.getUnitsLookup();
  }
  getRecord() {
    this.subscription.add(this.route.params.subscribe(params => {
      this.clientID = +params['ID'];
      if (!this.clientID || this.clientID == 0) {
        this.clientID = 0;
      } else if (this.clientID == -1) {
        this.clientID = 0;
        if (AppSettings.leadMovedToClient.id) {
          this.singleClient = {
            first_name: AppSettings.leadMovedToClient.first_name,
            second_name: AppSettings.leadMovedToClient.second_name,
            mobile: AppSettings.leadMovedToClient.country_code + AppSettings.leadMovedToClient.lead_phone,
            budget_from: null,
            budget_to: null,
            email: null,
            gender: null,
            request_type: null,
            id: null
          };
        } else {
          notify("error in load the data.. please back to lead and click 'move'.", "error");
        }
      } else {
        this.getClientById();
      }
    }));
  }
  getClientById() {
    this.subscription.add(this.clientsSrvice.getClientById(this.clientID).subscribe(
      (value: any) => {
        //notify("Client updated successfully", "success");
        this.singleClient = value.data;
        this.getInterestedInUnits(this.singleClient.id)
      }, error => {
        notify("error in loading.." + error.error, "error");
      }));
  }
  creatAreaForm() {
    this.clientFormGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      email: ['',],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      budget_from: ['', Validators.required],
      budget_to: ['', Validators.required],
      request_type: ['', Validators.required],
    });
  }
  saveClient() {
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode || this.clientID) {
        this.singleClient.budget_from = 700000;
        this.singleClient.budget_to = 1200000;
        this.subscription.add(this.clientsSrvice.updateClient(this.singleClient).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singleClient });
            notify("Client updated successfully", "success");
            //this.singleClient = new ClientsModel();
          }, error => {
            notify("error in saving.." + error.error, "error");
          }));
      } else {
        this.subscription.add(this.clientsSrvice.saveClient(this.singleClient).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singleClient });
            notify("Client saved successfully", "success");
            //this.singleClient = new ClientsModel();
            this.singleClient.id = value.data.row_id;
            this.clientFormGroup.reset();
          }, error => {
            notify("error in saving.." + error.error, "error");
          }));
      }
    }
  }
  getUnitsLookup() {
    this.subscription.add(this.unitsService.getAllUnits().subscribe(
      (value: any) => {
        this.unitsLookup = value.data;
      }, error => {
        notify('error in loading units list..', 'error');
      }));
  }
  getInterestedInUnits(clientId: number) {
    this.subscription.add(this.clientsSrvice.getInterestedInUnitsForClient(this.singleClient.id).subscribe(
      (value: any) => {
        this.gridBoxValue = [];
        for (let unit of value.data) {
          this.gridBoxValue.push(unit.id);
        }
        //notify("unit went to the client interested list successfully", "success");
      }, error => {
        notify('error in fetching units list..', 'error');
      }));
  }
  storeInterestedInUnits(unitId: number) {
    this.subscription.add(this.clientsSrvice.storeInterestedInUnits(this.singleClient.id, unitId).subscribe(
      (value: any) => {
        //this.unitsLookup = value.data;
        notify("unit went to the client interested list successfully", "success");
      }, error => {
        notify('error in adding unit to list..', 'error');
      }));
  }
  deleteInterestedInUnits(unitId: number) {
    this.subscription.add(this.clientsSrvice.deleteInterestedInUnitForClient(this.singleClient.id, unitId).subscribe(
      (value: any) => {
        //this.unitsLookup = value.data;
        notify("unit deleted from the client interested list successfully", "success");
      }, error => {
        notify('error in deleting unit..', 'error');
      }));
  }
  unitOnValueChanged(e) {
    //console.log(e, this.gridBoxValue);
    if (this.interestedUnitsLoaded) {
      if (e.currentSelectedRowKeys > 0) {
        this.storeInterestedInUnits(e.currentSelectedRowKeys[0]);
      } else if (e.currentDeselectedRowKeys.length > 0) {
        this.deleteInterestedInUnits(e.currentDeselectedRowKeys[0]);
      }
    }
    this.interestedUnitsLoaded = true;
  }
  ngOnInit() {
  }
  reloadActivities() {
    this.activitiesListComponent.getAllActivities();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
