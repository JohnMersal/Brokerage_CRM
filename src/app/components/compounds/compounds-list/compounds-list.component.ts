import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CompoundsList, CompoundModel } from "../compounds";
import { CompoundsService } from "../compounds.service";
import { AppSettings } from "../../shared/app-settings";
import { AreasService } from '../../areas/areas.service';
import { formatDate } from '@angular/common';
declare var jQuery: any;

@Component({
  selector: 'app-compounds-list',
  templateUrl: './compounds-list.component.html',
  styleUrls: ['./compounds-list.component.scss']
})
export class CompoundsListComponent implements OnInit {
  editCompound: CompoundModel = new CompoundModel();
  compoundList: CompoundsList[] = [];
  areasLookup = [];
  dataSource;
  displayedColumns: string[] = ['select', 'name', 'area', 'created_at', 'updated_at', 'created_by', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<CompoundsList>(true, []);
  subscription: Subscription = new Subscription();
  constructor(private compoundsService: CompoundsService, private snackBar: MatSnackBar, private areasService: AreasService) {
    this.getAllCompounds();
  }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  checkboxLabel(row?: CompoundsList): string {
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
  getAreasLookup() {
    this.subscription.add(this.areasService.getAllAreas().subscribe(
      (value: any) => {
        this.areasLookup = value.data;
      }, error => {
        notify(error.error, "error");
        //this.snackBar.open("error in loading areas list.." + error.error, "", { duration: 2000, politeness: "polite" });
      }));
  }
  getAllCompounds() {
    this.subscription.add(this.compoundsService.getAllCompounds().subscribe(
      (value: any) => {
        this.compoundList = value.data;
        this.dataSource = new MatTableDataSource(this.compoundList);
        this.dataSource.sort = this.sort;
      }, error => {
        notify(error.error, "error");
        //this.snackBar.open("error in loading compounds.." + error.error, "", { duration: 2000, politeness: "polite" });
      }));
  }
  updateCompound() {
    if (this.editCompound.name != null && this.editCompound.address != null) {
      this.subscription.add(this.compoundsService.updateCompound(this.editCompound).subscribe(
        (value: any) => {
          notify("Compound updated successfully", "success");
          //this.snackBar.open("Compound updated successfully", "OK", { duration: 2000, politeness: "polite" });
          this.getAllCompounds();
          (<any>jQuery('#editCompoundModal')).modal('hide');
          this.editCompound = new CompoundModel();
        }, error => {
          notify(error.error, "error");
          //this.snackBar.open("error in saving.." + error.error, "", { duration: 2000, politeness: "polite" });
        }));
    }
  }
  openToEditCompound(compound: CompoundModel) {
    this.getAreasLookup();
    this.editCompound = {
      id: compound.id,
      area_id: compound.area_id,
      address: compound.address,
      name: compound.name
    };
    (<any>jQuery('#editCompoundModal')).modal('show');
  }
  editRecord(e: any) {
    //console.log(e.data);
    if (this.areasLookup.length < 1) this.getAreasLookup();
    this.editCompound = {
      id: e.data.id,
      area_id: e.data.area_id,
      address: e.data.address,
      name: e.data.name
    };
    (<any>jQuery('#editCompoundModal')).modal('show');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
