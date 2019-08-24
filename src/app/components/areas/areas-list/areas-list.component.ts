import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AreasList, AreasModel } from "../areas-model";
import { AreasService } from "../areas.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
declare var jQuery: any;

@Component({
  selector: 'app-areas-list',
  templateUrl: './areas-list.component.html',
  styleUrls: ['./areas-list.component.scss']
})
export class AreasListComponent implements OnInit {
  editArea: AreasModel = new AreasModel();
  areasList: AreasList[] = [];
  dataSource;
  displayedColumns: string[] = ['select', 'name', 'address', 'created_at', 'updated_at', 'created_by', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<AreasList>(true, []);
  subscription: Subscription = new Subscription();
  constructor(private areasService: AreasService, private snackBar: MatSnackBar) {
    this.getAllLeads();
   }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  checkboxLabel(row?: AreasList): string {
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
  getAllLeads() {
    this.subscription.add(this.areasService.getAllAreas().subscribe(
      (value: any) => {
        this.areasList = value.data;
        //this.dataSource = new MatTableDataSource(this.areasList);
        //this.dataSource.sort = this.sort;
      }, error => {
        console.log(error);
      }));
  }
  updateArea() {
    if (this.editArea.name != null && this.editArea.address != null) {
      this.subscription.add(this.areasService.updateArea(this.editArea).subscribe(
        (value: any) => {
          this.snackBar.open("Lead updated successfully", "OK", { duration: 2000, politeness: "polite" });
          this.getAllLeads();
          (<any>jQuery('#editAreaModal')).modal('hide');
          this.editArea = new AreasModel();
        }, error => {
          this.snackBar.open("error in saving.." + error.error, "", { duration: 2000, politeness: "polite" });
        }));
    }
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  editRecord(e: any) {
    //if (e.rowType == "data" && e.column.cellTemplate != "assginTemplate") {
      //console.log(e.data);
      this.editArea = {
        id: e.data.id,
        address: e.data.address,
        name: e.data.name
      };
      (<any>jQuery('#editAreaModal')).modal('show');
    //}
  }
  openToEditArea(area: AreasModel) {
    this.editArea = {
      id: area.id,
      address: area.address,
      name: area.name
    };
    (<any>jQuery('#editAreaModal')).modal('show');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
