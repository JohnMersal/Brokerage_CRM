import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ClientsList, ClientsModel } from "../clients-model";
import { ClientService } from "../client.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { UnitsModel, unitsList } from '../../units/units-model';
import { NewClientComponent } from "../new-client/new-client.component";
declare var jQuery: any;

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  @ViewChild('editClientComponent') editClientComponent: NewClientComponent;
  editClient: ClientsModel = new ClientsModel();
  clientList: ClientsList[] = [];
  areasLookup = [];
  mainTabsSwitch: string = "primary";
  mainTabsName: string = "Primary";
  resaleTypeOption = ['External SALE ( External Broker )', 'Internal SALE (Broker from within the company)'];
  resaleTypeOptionObj = {
    type: null,
    selectedUnit: [],
  };
  dataSource;
  displayedColumns: string[] = ['select', 'first_name', 'second_name', 'gender', 'active', 'type', 'mobile', 'created_at', 'updated_at', 'created_by', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<ClientsList>(true, []);
  subscription: Subscription = new Subscription();
  constructor(private clientsService: ClientService, private snackBar: MatSnackBar) {
    this.getAllClients();
  }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "primary":
        this.mainTabsName = "Primary";
        break;
      case "resale":
        this.mainTabsName = "Resale";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  resaleTypeOptionChanged(e) {
    console.log(e, this.resaleTypeOptionObj.type);
  }
  selectedUnit(row: unitsList) {
    this.resaleTypeOptionObj.selectedUnit[0] = row;
  }
  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  checkboxLabel(row?: ClientsList): string {
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
  getAllClients() {
    this.subscription.add(this.clientsService.getAllClients().subscribe(
      (value: any) => {
        this.clientList = value.data;
        this.dataSource = new MatTableDataSource(this.clientList);
        this.dataSource.sort = this.sort;
      }, error => {
        this.snackBar.open("error in loading clients.." + error.error, "", { duration: 2000, politeness: "polite" });
      }));
  }
  editRecord(e: any) {
    if (e.rowType == "data" && e.column.cellTemplate != "changeStatusTemplate") {
      Object.assign(this.editClientComponent.singleClient, e.data);
      this.editClientComponent.singleClient.budget_from = e.data.client.budget_from;
      this.editClientComponent.singleClient.budget_to = e.data.client.budget_to;
      this.editClientComponent.singleClient.request_type = e.data.client.request_type;
      (<any>jQuery('#editClientModal')).modal('show');
    }
  }
  afterSaveClient(e) {
    this.getAllClients();
    (<any>jQuery('#editClientModal')).modal('hide');
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  openChangeStatusModal(row: ClientsList) {
    (<any>jQuery('#changeStatusModal')).modal('show');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
