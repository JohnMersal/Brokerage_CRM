import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { LeadsModel, leadsList } from "../leads-model";
import { LeadsService } from "../leads.service";
import { EmployeesService } from "../../employees/employees.service";
import { Subscription, Observable } from "rxjs";
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import notify from 'devextreme/ui/notify';
import { MatStepper } from "@angular/material/stepper";
import { AppSettings } from "../../shared/app-settings";
import { DxValidationGroupComponent } from 'devextreme-angular';
declare var jQuery: any;

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html',
  styleUrls: ['./new-leads.component.scss']
})
export class NewLeadsComponent implements OnInit {
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  @Input() updateMode: boolean = false;
  @Output() afterSave = new EventEmitter();
  isLinear = false;
  leadFormGroup: FormGroup;
  editFormGroup: FormGroup;
  singleLead: LeadsModel = {
    id: null,
    first_name: "",
    second_name: "",
    project_name: "",
    country_code: null,
    lead_phone: null
  };
  editLead: LeadsModel = new LeadsModel();
  leadsList: leadsList[] = [];
  employeesLookup = [];
  displayedColumns: string[] = ['select', 'lead_name', 'project_name', 'lead_status', 'lead_phone', 'edit'];
  assginToEmployee: number;
  dataSource;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<leadsList>(true, []);
  subscription: Subscription = new Subscription();
  constructor(private leadsService: LeadsService, private formBuilder: FormBuilder, private employeesService: EmployeesService) {
    //this.getAllLeads();
    //this.creatLeadForm();
  }
  ngOnInit() {
  }
  creatLeadForm() {
    this.leadFormGroup = this.formBuilder.group({
      lead_name: ['', Validators.required],
      project_name: ['', Validators.required],
      country_code: ['', Validators.required],
      lead_phone: ['', Validators.required]
    });
    this.editFormGroup = this.formBuilder.group({
      lead_name: ['', Validators.required],
      project_name: ['', Validators.required],
      country_code: ['', Validators.required],
      lead_phone: ['', Validators.required]
    });
  }
  goNext(stepper: MatStepper) {
    stepper.next();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  checkboxLabel(row?: leadsList): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  getAllLeads() {
    this.subscription.add(this.leadsService.getAllLeads().subscribe(
      (value: any) => {
        this.leadsList = value.data;
        this.dataSource = new MatTableDataSource(this.leadsList);
        this.dataSource.sort = this.sort;
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
  saveLead() {
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode) {
        this.subscription.add(this.leadsService.updateLead(this.singleLead).subscribe(
          (value: any) => {
            notify("Lead updated successfully", "success");
            this.afterSave.emit({ id: value, data: this.singleLead });
            (<any>jQuery('#exampleModal')).modal('hide');
            this.singleLead = new LeadsModel();
          }, error => {
            notify("error in saving.." + error.message, "error");
          }));
      } else {
        this.subscription.add(this.leadsService.saveLead(this.singleLead).subscribe(
          (value: any) => {
            //this.goNext(this.stepper);
            this.afterSave.emit({ id: value, data: this.singleLead });
            notify("Lead saved successfully", "success");
            //this.getEmployeesLookup();
            //this.singleLead = new LeadsModel();
          }, error => {
            notify("error in saving.." + error.message, "error");
          }));
      }
    }
  }
  updateLead() {
    // if (this.editLead.first_name != null && this.editLead.project_name != null && this.editLead.country_code != null && this.editLead.lead_phone != null) {
    //   this.subscription.add(this.leadsService.updateLead(this.editLead).subscribe(
    //     (value: any) => {
    //       notify("Lead updated successfully", "success");
    //       this.getAllLeads();
    //       (<any>jQuery('#exampleModal')).modal('hide');
    //       this.editLead = new LeadsModel();
    //     }, error => {
    //       notify("error in saving.." + error.message, "error");
    //     }));
    // }
  }
  assginLead() {
    this.subscription.add(this.leadsService.assginLead(this.editLead.id, this.assginToEmployee).subscribe(
      (value: any) => {
        notify("Lead assgined successfully", "success");
        this.getAllLeads();
        (<any>jQuery('#exampleModal')).modal('hide');
        this.editLead = new LeadsModel();
      }, error => {
        notify("error in assgining.." + error.message, "error");
      }));
  }
  openToEditLead(lead: LeadsModel) {
    this.editLead = {
      id: lead.id,
      first_name: lead.first_name,
      second_name: lead.second_name,
      project_name: lead.project_name,
      country_code: lead.country_code,
      lead_phone: lead.lead_phone
    };
    (<any>jQuery('#exampleModal')).modal('show');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
