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

 RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editActivity: ActivityModel = new ActivityModel();
  activitiesList: AtivitiesListModel[] = [];
  compoundsLookup: CompoundsList[] = []
  unitsLookup: unitsList[] = [];
  selectedActivity: AtivitiesListModel = new AtivitiesListModel();
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
      // console.log(e.data);
      // this.EditComponent.singleActivity = {
      //   id: e.data.id,
      //   activity_date: e.data.activity_date,
      //   activity_status: e.data.activity_status,
      //   activity_type: e.data.activity_type,
      //   client_id: e.data.client_data.id,
      //   feedback: e.data.feedback
      // };
      // (<any>jQuery('#editActivityModal')).modal('show');
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

  openChangeStatusModal(row: AtivitiesListModel) {
    this.selectedActivity = row;
    this.getCompoundsLookup();
    this.getUnitsLookup();
    (<any>jQuery('#changeStatusModal')).modal('show');
  }
  afterSubmittedStatusChanges(e) {
    (<any>jQuery('#changeStatusModal')).modal('hide');
  }
  
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
