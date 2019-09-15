import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { leadsList, LeadsModel } from "../leads-model";
import { LeadsService } from "../leads.service";
import { AppSettings } from "../../shared/app-settings";
import { formatDate } from '@angular/common';
import { EmployeesService } from '../../employees/employees.service';
import { Router } from '@angular/router';
declare var jQuery: any;

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent implements OnInit {
  @Input() customListMode: boolean = false;
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editLead: LeadsModel = new LeadsModel();
  @Input() leadsList: leadsList[] = [];
  employeesLookup = [];
  assginToEmployee: number = null;
  subscription: Subscription = new Subscription();
  constructor(private leadsService: LeadsService, private employeesService: EmployeesService, private router: Router) { }
  getAllLeads() {
    this.subscription.add(this.leadsService.getAllLeads().subscribe(
      (value: any) => {
        this.leadsList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  getEmployeesLookup() {
    this.subscription.add(this.employeesService.getAllEmployees().subscribe(
      (value: any) => {
        this.employeesLookup = value.data;
      }, error => {
        console.log(error);
      }));
  }
  updateLead() {
    if (this.editLead.first_name != null && this.editLead.project_name != null && this.editLead.country_code != null && this.editLead.lead_phone != null) {
      this.subscription.add(this.leadsService.updateLead(this.editLead).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.getAllLeads();
          (<any>jQuery('#exampleModal')).modal('hide');
          this.editLead = new LeadsModel();
        }, error => {
          notify(error.error, "error");
        }));
    }
  }
  editRecord(e: any) {
    if (e.rowType == "data" && e.column.cellTemplate != "assginTemplate" && e.column.cellTemplate != "movingTemplate" ) {
      //console.log(e.data);
      this.editLead = {
        id: e.data.id,
        first_name: e.data.first_name,
        second_name: e.data.second_name,
        project_name: e.data.project_name,
        country_code: e.data.country_code,
        lead_phone: e.data.lead_phone
      };
      (<any>jQuery('#exampleModal')).modal('show');
    }
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  assginTo(lead: LeadsModel) {
    this.getEmployeesLookup();
    this.editLead = {
      id: lead.id,
      first_name: lead.first_name,
      second_name: lead.second_name,
      lead_phone: lead.lead_phone,
      country_code: lead.country_code,
      project_name: lead.project_name
    };
    (<any>jQuery('#assginModal')).modal('show');
  }
  assginLead() {
    this.subscription.add(this.leadsService.assginLead(this.editLead.id, this.assginToEmployee).subscribe(
      (value: any) => {
        notify("Lead assgined successfully", "success");
        this.getAllLeads();
        (<any>jQuery('#assginModal')).modal('hide');
        this.editLead = new LeadsModel();
      }, error => {
        notify("error in assgining.." + error.message, "error");
      }));
  }
  movingToClient(lead: LeadsModel) {
    AppSettings.leadMovedToClient.first_name = lead.first_name;
    AppSettings.leadMovedToClient.second_name = lead.second_name;
    AppSettings.leadMovedToClient.id = lead.id;
    AppSettings.leadMovedToClient.country_code = lead.country_code;
    AppSettings.leadMovedToClient.lead_phone = lead.lead_phone;
    this.router.navigate(['/client/-1']);
  }
  ngOnInit() {
    if (!this.customListMode) {
      this.getAllLeads();
    }
  }

}
