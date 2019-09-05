import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeadConflictModel } from "../lead-conflict-model";
import { LeadConflictService } from "../lead-conflict.service";
import { LeadsListComponent } from "../../../leads/leads-list/leads-list.component";

@Component({
  selector: 'app-check-conflict',
  templateUrl: './check-conflict.component.html',
  styleUrls: ['./check-conflict.component.scss']
})
export class CheckConflictComponent implements OnInit {
  @ViewChild(LeadsListComponent) leadListComponent: LeadsListComponent;
  beforeCheck: boolean = true;
  isLeadsConflicts: boolean = false;
  leadsConflictCount: LeadConflictModel[] = [];
  subscription: Subscription = new Subscription();
  constructor(private leadConflictService: LeadConflictService) { }

  ngOnInit() {
  }
  checkForLeadsConflicts() {
    this.subscription.add(this.leadConflictService.getDuplicatedLeads().subscribe(
      (value: any) => {
        this.leadsConflictCount = value.data;
        this.isLeadsConflicts = true;
        this.beforeCheck = false;
      }, error => {
        console.log(error);
      }));
  }
  openList(phoneNum: number, index) {
    this.subscription.add(this.leadConflictService.getLeadsByPhone(phoneNum).subscribe(
      (value: any) => {
        this.leadsConflictCount[index]._leadsConflictList = value.data;
        this.leadsConflictCount[index]._isOpened = true;
        this.leadListComponent.leadsList = value.data;
      }, error => {
        console.log(error);
      }));
    //
  }
}
