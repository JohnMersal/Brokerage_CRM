import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { unitsList, UnitsModel, UnitStatusEnum } from '../units-model';
import { UnitsService } from '../units.service';
import { AppSettings } from '../../shared/app-settings';
import { CompoundsList } from '../../compounds/compounds';
import { CompoundsService } from '../../compounds/compounds.service';
import { formatDate } from '@angular/common';
import { NewUnitComponent } from '../new-unit/new-unit.component';
import {BrokerModel, BrokersList} from '../../brokers/broker-model';
import { BrokersService } from '../../brokers/brokers.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
declare var jQuery: any;

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss']
})
export class UnitsListComponent implements OnInit, OnDestroy {
  @Input() displayMode = '';
  /*
   * select: to make evry row in grid selective
  */
  @Output() selectedRow = new EventEmitter();
  @ViewChild('changeStatusValidator') changeStatusValidator: DxValidationGroupComponent;
  @ViewChild('edit') EditComponent: NewUnitComponent;
  @Output() SaveBrokerEvent = new EventEmitter();


  selectedUnits = [];
  editUnit: UnitsModel = new UnitsModel();
  unitList: unitsList[] = [];
  rentUnitsList: unitsList[] = [];
  saleUnitsList: unitsList[] = [];
  compoundsLookup: CompoundsList[] = [];
  brokersLookup: BrokersList[] = [];
  // No need for all brokers list
  singleBroker: BrokerModel = new BrokerModel();

  unitStatusEnum = UnitStatusEnum;
  statusOption = [
    {
      id: this.unitStatusEnum.For_sale,
      name: 'For sale',
      descr: 'The unit is available for sale (will be visible in units list).',
      selected: false
    },
    {
      id: this.unitStatusEnum.Sold_unknown,
      name: 'Sold unknown',
      descr: 'The unit is sold (will be moved to archive).',
      selected: false
    },
    {
      id: this.unitStatusEnum.Not_for_sale,
      name: 'Not for sale now / Maybe later',
      descr: 'The owner has decided to postpone the sale for another time.',
      selected: false
    },
    {
      id: this.unitStatusEnum.Sold_outside_broker,
      name: 'Sold with an outside broker',
      descr: 'This means the transaction complete between you and a different company.',
      selected: false
    }
  ];
  DateFormat = AppSettings.DateDisplayFormat;
  maxDate: Date = new Date();
  SelectedUnitToChangeStatus = {
    selectedUnits: [],
    id: null,
    name: null,
    descr: null,
    selected: false,
    isReminderSet: false,
    selectedBrokerId: null
  };
  mainTabsSwitch = 'sales';
  mainTabsName = 'For sale units';
  subscription: Subscription = new Subscription();
  constructor(private unitsService: UnitsService,
              private snackBar: MatSnackBar,
              private compoundService: CompoundsService,
              private brokersService: BrokersService) {
    this.getAllUnits();
    this.getCompoundsLookup();
  }

  ngOnInit() {
  }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case 'rent':
        this.mainTabsName = 'For rent units';
        break;
      case 'sales':
        this.mainTabsName = 'For sale units';
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  getCompoundsLookup() {
    this.subscription.add(this.compoundService.getAllCompounds().subscribe(
      (value: any) => {
        this.compoundsLookup = value.data;
      }, error => {
        this.snackBar.open('error in loading areas list..' + error.error, '', { duration: 2000, politeness: 'polite' });
      }));
  }
  getBrokersLookup() {
    this.subscription.add(this.brokersService.getAllBroker().subscribe(
      (value: any) => {
        this.brokersLookup = value.data;
      }, error => {
        this.snackBar.open('error in loading brokers list..' + error.error, '', { duration: 2000, politeness: 'polite' });
      }));
  }
  getAllUnits() {
    this.subscription.add(this.unitsService.getAllUnits().subscribe(
      (value: any) => {
        this.unitList = value.data;
        this.rentUnitsList = [];
        this.saleUnitsList = [];
        for (const unit of value.data){
          if (unit.offering_type == 'Rent') {
            this.rentUnitsList.push(unit);
          } else {
            this.saleUnitsList.push(unit);
          }
        }
      }, error => {
        this.snackBar.open('error in loading compounds..' + error.error, '', { duration: 2000, politeness: 'polite' });
      }));
  }
  updateUnit() {
    if (this.editUnit.compound_id != null && this.editUnit.unit_type != null) {
      this.subscription.add(this.unitsService.updateUnit(this.editUnit).subscribe(
        (value: any) => {
          this.snackBar.open('Compound updated successfully', 'OK', { duration: 2000, politeness: 'polite' });
          this.getAllUnits();
          (jQuery('#editUnitModal') as any).modal('hide');
          this.editUnit = new UnitsModel();
        }, error => {
          this.snackBar.open('error in saving..' + error.error, '', { duration: 2000, politeness: 'polite' });
        }));
    }
  }
  editRecord(e: any) {
    console.log(this.displayMode);
    if (e.rowType == 'data' && this.displayMode !== 'select' && (e.column.cellTemplate != 'changeStatusTemplate' && e.column.cellTemplate != 'SelectUnitTemplate')) {
      Object.assign(this.EditComponent.singleUnit, e.data);
      (jQuery('#editUnitModal') as any).modal('show');
    }
  }
  openChangeStatusModal(row: unitsList) {
    if (this.displayMode == 'select') {
      //if(!row._isSelected) row._isSelected = !row._isSelected;
      this.selectedRow.emit(row);
    } else {
      (jQuery('#changeStatusModal') as any).modal('show');
      this.SelectedUnitToChangeStatus.selectedUnits.push(row);
      this.getBrokersLookup();
    }
  }
  onStatusChanged(e, option) {
    for (const opt of this.statusOption){
      if (opt.name != option.name) {
        opt.selected = false;
      } else {
        //opt.selected = e.value;
      }
    }
    this.SelectedUnitToChangeStatus.id = option.id;
    this.SelectedUnitToChangeStatus.name = option.name;
    this.SelectedUnitToChangeStatus.descr = option.descr;
    this.SelectedUnitToChangeStatus.selected = option.selected;
  }
  changeUnitStatus() {
    if (this.SelectedUnitToChangeStatus.selectedUnits[0].id && this.SelectedUnitToChangeStatus.id) {
    this.subscription.add(this.unitsService.changeUnitStatus(this.SelectedUnitToChangeStatus.selectedUnits[0].id, this.SelectedUnitToChangeStatus.id, this.SelectedUnitToChangeStatus.selectedBrokerId).subscribe(
        (value: any) => {
          this.snackBar.open('Data updated successfully', 'OK', { duration: 2000, politeness: 'polite' });
          (jQuery('#changeStatusModal') as any).modal('hide');
        }, error => {
          this.snackBar.open('error in saving..' + error.error, '', { duration: 2000, politeness: 'polite' });
        }));
    }
  }
  submitStatusChange() {
    if (this.SelectedUnitToChangeStatus) {
      if (this.SelectedUnitToChangeStatus.id == this.unitStatusEnum.For_sale
        || this.SelectedUnitToChangeStatus.id == this.unitStatusEnum.Not_for_sale
        || this.SelectedUnitToChangeStatus.id == this.unitStatusEnum.Sold_unknown) {
        this.SelectedUnitToChangeStatus.selectedBrokerId = null;
        this.changeUnitStatus();
      } else if (this.SelectedUnitToChangeStatus.id == this.unitStatusEnum.Not_for_sale) {
        if (this.SelectedUnitToChangeStatus.isReminderSet) {
          this.changeUnitStatus();
        } else {
          this.snackBar.open('Please set reminder to follow up', '', { duration: 2000, politeness: 'polite' });
        }
      } else if (this.SelectedUnitToChangeStatus.id == this.unitStatusEnum.Sold_outside_broker) {
        if (this.changeStatusValidator.instance.validate().isValid) {
          this.changeUnitStatus();
        }
      }

    }
  }
  openAddNewModel(name: string) {
    if (name == 'broker') {
      (jQuery('#addNewBrokerModal') as any).modal('show');
    }
  }
  afterSaveBroker(e) {
    this.getBrokersLookup();
    (jQuery('#addNewBrokerModal') as any).modal('hide');

  }
  afterSave() {
    this.getAllUnits();
    (jQuery('#editUnitModal') as any).modal('hide');
  }
  getDateFormated(x) {
    const date = x.value;
    const formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  traceCompoundName(id) {
    if (this.compoundsLookup.length > 0 && id) {
      const findIndex = this.compoundsLookup.findIndex(x => x.id == id);
      if (findIndex > -1) {
        return this.compoundsLookup[findIndex].name + ' - ' + this.compoundsLookup[findIndex].area.name;
      }
    }
    return '';
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  // saveBroker(e) {
  //   this.subscription.add(this.brokersService.saveBroker(this.singleBroker).subscribe(
  //     (value: any) => {
  //       this.SaveBrokerEvent.emit({ id: value, data: this.singleBroker });
  //       notify('Activity saved successfully', 'success');
  //       this.singleBroker = new BrokerModel();
  //     }, error => {
  //       notify('error in saving..' + error.meta.message, 'error');
  //     }));
  // }

}
