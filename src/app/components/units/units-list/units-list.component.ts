import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { unitsList, UnitsModel } from "../units-model";
import { UnitsService } from "../units.service";
import { AppSettings } from "../../shared/app-settings";
import { CompoundsList } from "../../compounds/compounds";
import { CompoundsService } from '../../compounds/compounds.service';
import { formatDate } from '@angular/common';
import { NewUnitComponent } from "../new-unit/new-unit.component";
declare var jQuery: any;

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss']
})
export class UnitsListComponent implements OnInit {
  @ViewChild('edit') EditComponent: NewUnitComponent;
  editUnit: UnitsModel = new UnitsModel();
  unitList: unitsList[] = [];
  rentUnitsList: unitsList[] = []
  saleUnitsList: unitsList[] = []
  compoundsLookup: CompoundsList[] = [];
  mainTabsSwitch: string = "sales";
  mainTabsName: string = "For sale units";
  dataSource;
  displayedColumns: string[] = ['select', 'compound_id', 'unit_type', 'offering_type', 'owner_name', 'details', 'original_price', 'final_price', 'commission', 'unit_desc', 'created_at', 'updated_at', 'created_by', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<unitsList>(true, []);
  subscription: Subscription = new Subscription();
  constructor(private unitsService: UnitsService, private snackBar: MatSnackBar, private compoundService: CompoundsService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,) {
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
      case "rent":
        this.mainTabsName = "For rent units";
        break;
      case "sales":
        this.mainTabsName = "For sale units";
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
        this.snackBar.open("error in loading areas list.." + error.error, "", { duration: 2000, politeness: "polite" });
      }));
  }
  getAllUnits() {
    this.subscription.add(this.unitsService.getAllUnits().subscribe(
      (value: any) => {
        this.unitList = value.data;
        this.rentUnitsList = [];
        this.saleUnitsList = [];
        for (let unit of value.data){
          if (unit.offering_type == "Rent") {
            this.rentUnitsList.push(unit);
          } else {
            this.saleUnitsList.push(unit);
          }
        }
        //this.dataSource = new MatTableDataSource(this.unitList);
        //this.dataSource.sort = this.sort;
      }, error => {
        this.snackBar.open("error in loading compounds.." + error.error, "", { duration: 2000, politeness: "polite" });
      }));
  }
  updateUnit() {
    if (this.editUnit.compound_id != null && this.editUnit.unit_type != null) {
      this.subscription.add(this.unitsService.updateUnit(this.editUnit).subscribe(
        (value: any) => {
          this.snackBar.open("Compound updated successfully", "OK", { duration: 2000, politeness: "polite" });
          this.getAllUnits();
          (<any>jQuery('#editUnitModal')).modal('hide');
          this.editUnit = new UnitsModel();
        }, error => {
          this.snackBar.open("error in saving.." + error.error, "", { duration: 2000, politeness: "polite" });
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
    (<any>jQuery('#editUnitModal')).modal('show');
  }
  editRecord(e: any) {
    //console.log(e.data);
    Object.assign(this.EditComponent.singleUnit, e.data);
    /*this.EditComponent.singleUnit = {
      id: e.data.id,
      compound_id: e.data.compound_id,
      unit_type: e.data.unit_type,
      offering_type: e.data.offering_type,
      unit_num: e.data.unit_num,
      floor_num: e.data.floor_num,
      unit_view: e.data.unit_view,
      land_area: e.data.land_area,
      building_area: e.data.building_area,
      garden_area: e.data.garden_area,
      bedrooms: e.data.bedrooms,
      bathrooms: e.data.bathrooms,
      owner_name: e.data.owner_name,
      owner_phone: e.data.owner_phone,
      owner_email: e.data.owner_email,
      owner_facebook: e.data.owner_facebook,
      original_price: e.data.original_price,
      market_price: e.data.market_price,
      owner_price: e.data.owner_price,
      over_price: e.data.over_price,
      commission_percentage: e.data.commission_percentage,
      commission_value: e.data.commission_value,
      final_price: e.data.final_price,
      original_downpayment: e.data.original_downpayment,
      final_downpayment: e.data.final_downpayment,
      unit_desc: e.data.unit_desc,
    };*/
    (<any>jQuery('#editUnitModal')).modal('show');
  }
  afterSave() {
    this.getAllUnits();
    (<any>jQuery('#editUnitModal')).modal('hide');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  traceCompoundName(id) {
    if (this.compoundsLookup.length > 0 && id) {
      let findIndex = this.compoundsLookup.findIndex(x => x.id == id);
      if (findIndex > -1) {
        return this.compoundsLookup[findIndex].name + " - " + this.compoundsLookup[findIndex].area.name;
      }
    }
    return "";
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
