import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ClientsList, ClientsModel } from "../clients-model";
import { ClientService } from "../client.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
declare var jQuery: any;

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  editClient: ClientsModel = new ClientsModel();
  clientList: ClientsList[] = [];
  areasLookup = [];
  mainTabsSwitch: string = "primary";
  mainTabsName: string = "Primary";
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
  updateClient() {
    if (this.editClient.first_name != null && this.editClient.second_name != null) {
      this.subscription.add(this.clientsService.updateClient(this.editClient).subscribe(
        (value: any) => {
          this.snackBar.open("Client updated successfully", "OK", { duration: 2000, politeness: "polite" });
          this.getAllClients();
          (<any>jQuery('#editClientModal')).modal('hide');
          this.editClient = new ClientsModel();
        }, error => {
          this.snackBar.open("error in saving.." + error.error, "", { duration: 2000, politeness: "polite" });
        }));
    }
  }
  openToeditClient(client: ClientsModel) {
    this.editClient = {
      id: client.id,
      first_name: client.first_name,
      second_name: client.second_name,
      gender: client.gender,
      email: client.email,
      mobile: client.mobile,
      request_type: client.request_type,
      budget_from: client.budget_from,
      budget_to: client.budget_to
    };
    (<any>jQuery('#editClientModal')).modal('show');
  }
  editRecord(e: any) {
    if (e.rowType == "data" && e.column.cellTemplate != "changeStatusTemplate") {
      this.editClient = {
        id: e.data.id,
        first_name: e.data.first_name,
        second_name: e.data.second_name,
        gender: e.data.gender,
        email: e.data.email,
        mobile: e.data.mobile,
        request_type: e.data.request_type,
        budget_from: e.data.budget_from,
        budget_to: e.data.budget_to
      };
      (<any>jQuery('#editClientModal')).modal('show');
    }
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
