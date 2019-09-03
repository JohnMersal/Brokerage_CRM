import { Component, OnInit, ViewChild } from '@angular/core';
import { AreasListComponent } from "../areas/areas-list/areas-list.component";
import { CompoundsListComponent } from "../compounds/compounds-list/compounds-list.component";
import { LeadsListComponent } from "../leads/leads-list/leads-list.component";
import { BrokersListComponent } from "../brokers/brokers-list/brokers-list.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  mainTabsSwitch: string = "leads";
  mainTabsName: string = "Import and assign";
  subTabsSwitchLead: string = "leads";
  subTabsNameLead: string = "Data & Leads";
  @ViewChild('areasListComponent') areasListComponent: AreasListComponent;
  @ViewChild('compoundsListComponent') compoundsListComponent: CompoundsListComponent;
  @ViewChild('LeadsListComponent') LeadsListComponent: LeadsListComponent;
  @ViewChild('BrokersListComponent') BrokersListComponent: BrokersListComponent;

  constructor() { }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "leads":
        this.mainTabsName = "Import and assign";
        break;
      case "CompanyTarget":
        this.mainTabsName = "Company target";
        break;
      case "employee":
        this.mainTabsName = "New employee";
        break;
      case "permission":
        this.mainTabsName = "New Permission";
        break;
      case "broker":
        this.mainTabsName = "New Broker";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  changeSubTabsLead(targetSubTab: string) {
    switch (targetSubTab) {
      case "leads":
        this.subTabsNameLead = "Data & Leads";
        break;
      case "Compound":
        this.subTabsNameLead = "Compound Data";
        break;
      case "area":
        this.subTabsNameLead = "New area";
        break;
      case "activities":
        this.subTabsNameLead = "New activity";
        break;
      case "todos":
        this.subTabsNameLead = "New to-do";
        break;
      case "levels":
        this.subTabsNameLead = "New level";
        break;
    }
    this.subTabsSwitchLead = targetSubTab;
  }
  ngOnInit() {
  }
  afterSaveArea(event) {
    this.areasListComponent.getAllLeads();
  }
  afterSaveCompound(event) {
    this.compoundsListComponent.getAllCompounds();
  }
  afterSaveLead(event) {
    this.LeadsListComponent.getAllLeads();
  }
  afterSaveBroker(event) {
    this.BrokersListComponent.getAllUnits();
  }
}
