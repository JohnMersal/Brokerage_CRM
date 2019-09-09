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
  clientID: number;
  constructor(private clientsSrvice: ClientService, private formBuilder: FormBuilder, private areasService: AreasService, public route: ActivatedRoute, public router: Router) {
    this.creatAreaForm();
    this.getRecord();
  }
  getRecord() {
    this.subscription.add(this.route.params.subscribe(params => {
      this.clientID = +params['ID'];
      if (!this.clientID || this.clientID == 0) {
        this.clientID = 0;
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
  ngOnInit() {
  }
  reloadActivities() {
    this.activitiesListComponent.getAllActivities();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
