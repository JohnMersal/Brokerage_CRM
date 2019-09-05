import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { unitsList, UnitsModel } from '../units-model';
import { UnitsService } from '../units.service';
import { AppSettings } from '../../shared/app-settings';
import { CompoundsList } from '../../compounds/compounds';
import { CompoundsService } from '../../compounds/compounds.service';
import { formatDate } from '@angular/common';
import { NewUnitComponent } from '../new-unit/new-unit.component';
import { BrokersList } from '../../brokers/broker-model';
import { BrokersService } from '../../brokers/brokers.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
declare var jQuery: any;

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss']
})
export class UnitsListComponent implements OnInit {
  @Input() displayMode: string = '';
  /*
   * select: to make evry row in grid selective
  */
  @Output() selectedRow = new EventEmitter();
  @ViewChild('changeStatusValidator') changeStatusValidator: DxValidationGroupComponent;
  @ViewChild('edit') EditComponent: NewUnitComponent;

  editUnit: UnitsModel = new UnitsModel();
  unitList: unitsList[] = [];
  rentUnitsList: unitsList[] = []
  saleUnitsList: unitsList[] = [];
  compoundsLookup: CompoundsList[] = [];
  brokersLookup: BrokersList[] = [];
  statusOption = [
    {
      name: "For sale",
      descr: "The unit is available for sale (will be visible in units list).",
      selected:true
    },
    {
      name: "Sold unknown",
      descr: "The unit is sold (will be moved to archive).",
      selected: false
    },
    {
      name: "Not for sale now / Maybe later",
      descr: "The owner has decided to postpone the sale for another time.",
      selected: false
    },
    {
      name: "Sold with an outside broker",
      descr: "This means the transaction complete between you and a different company.",
      selected: false
    }
  ];
  DateFormat = AppSettings.DateDisplayFormat;
  maxDate: Date = new Date();
  selectedOption = {
    name: null,
    descr: null,
    selected: false
  };
  mainTabsSwitch: string = "sales";
  mainTabsName: string = "For sale units";
  dataSource;
  displayedColumns: string[] = ['select', 'compound_id', 'unit_type', 'offering_type', 'owner_name', 'details', 'original_price', 'final_price', 'commission', 'unit_desc', 'created_at', 'updated_at', 'created_by', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<unitsList>(true, []);
  subscription: Subscription = new Subscription();
  constructor(private unitsService: UnitsService, private snackBar: MatSnackBar, private compoundService: CompoundsService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private brokersService: BrokersService) {
    iconRegistry.addSvgIcon('Apartment-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Apartment.svg'));
    iconRegistry.addSvgIcon('Standalone-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Standalone.svg'));
    iconRegistry.addSvgIcon('Townhouse-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Townhouse.svg'));
    iconRegistry.addSvgIcon('TwinVilla-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/TwinVilla.svg'));
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
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  checkboxLabel(row?: unitsList): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
        this.snackBar.open("error in loading brokers list.." + error.error, "", { duration: 2000, politeness: "polite" });
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
        //this.dataSource = new MatTableDataSource(this.unitList);
        //this.dataSource.sort = this.sort;
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
  openToeditUnit(unit: UnitsModel) {
    this.editUnit = {
      id: unit.id,
      compound_id: unit.compound_id,
      unit_type: unit.unit_type,
      offering_type: unit.offering_type,
      unit_num: unit.unit_num,
      floor_num: unit.floor_num,
      unit_view: unit.unit_view,
      market_price: unit.market_price,
      owner_name: unit.owner_name,
      owner_phone: unit.owner_phone,
      owner_email: unit.owner_email,
      owner_facebook: unit.owner_facebook,
      land_area: unit.land_area,
      building_area: unit.building_area,
      garden_area: unit.garden_area,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      original_price: unit.original_price,
      owner_price: unit.owner_price,
      over_price: unit.over_price,
      commission_percentage: unit.commission_percentage,
      commission_value: unit.commission_value,
      final_price: unit.final_price,
      original_downpayment: unit.original_downpayment,
      final_downpayment: unit.final_downpayment,
      unit_desc: unit.unit_desc,
    };
    (jQuery('#editUnitModal') as any).modal('show');
  }
  editRecord(e: any) {
    console.log(this.displayMode);
    if (e.rowType == "data" && this.displayMode !== 'select' && (e.column.cellTemplate != "changeStatusTemplate" && e.column.cellTemplate != "SelectUnitTemplate")) {
      Object.assign(this.EditComponent.singleUnit, e.data);
      (<any>jQuery('#editUnitModal')).modal('show');
    }
  }
  selectedUnits = [];
  openChangeStatusModal(row: unitsList) {
    if (this.displayMode == "select") {
      //if(!row._isSelected) row._isSelected = !row._isSelected;
      this.selectedRow.emit(row);
    } else {
      (<any>jQuery('#changeStatusModal')).modal('show');
      this.getBrokersLookup();
    }
  }
  onStatusChanged(e, option) {
    for (let opt of this.statusOption){
      if (opt.name != option.name) {
        opt.selected = false;
      } else {
        //opt.selected = e.value;
      }
    }
    this.selectedOption = option;
  }
  submitStatusChange() {
    if (this.changeStatusValidator.instance.validate().isValid) {
      /*let formatedDate = formatDate(this.singleActivity.activity_date, this.DateFormat, 'en-US');
        this.singleActivity.activity_date = formatedDate;*/
    }
  }
  openAddNewModel(name: string) {
    if (name == "broker") {
      (<any>jQuery('#addNewBrokerModal')).modal('show');
    }
  }
  afterSaveBroker(e) {
    this.getBrokersLookup();
    (<any>jQuery('#addNewBrokerModal')).modal('hide');

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

}
