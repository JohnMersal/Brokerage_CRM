import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { PositionList, PositionModel } from '../positions-model';
import { PositionsService } from '../positions.service';
import { AppSettings } from '../../shared/app-settings';
import { CompoundsList } from '../../compounds/compounds';
import { CompoundsService } from '../../compounds/compounds.service';
import { formatDate } from '@angular/common';
import { EditPositionComponent } from '../edit-position/edit-position.component';
import { BrokerModel, BrokersList } from '../../brokers/broker-model';
import { BrokersService } from '../../brokers/brokers.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
declare var jQuery: any;

@Component({
  selector: 'app-positions-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.scss']
})
export class PositionsListComponent implements OnInit {
  @ViewChild('edit') EditComponent: EditPositionComponent;
  positionsList: PositionList[] = [];
  DateFormat = AppSettings.DateDisplayFormat;
  subscription: Subscription = new Subscription();
  constructor(private positionsService: PositionsService) { 
    this.getAllPositions();
  }
  getAllPositions() {
    this.subscription.add(this.positionsService.getAllPosition().subscribe(
      (value: any) => {
        this.positionsList = value.data;
      }, error => {
        notify(error.meta.message, "error");
      }));
  }
  editRecord(e: any) {
    if (e.rowType == 'data') {
      Object.assign(this.EditComponent.singlePosition, e.data);
      (jQuery('#editUnitModal') as any).modal('show');
    }
  }
  afterSave() {
    this.getAllPositions();
    (jQuery('#editUnitModal') as any).modal('hide');
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
