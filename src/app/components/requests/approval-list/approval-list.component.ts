import { Component, OnInit, Input } from '@angular/core';
import { ActivitiesService } from "../../activities/activities.service";
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit {
  approvalList = [];
  @Input() filterRequestByStatus: string;// disapproved. new, approveed
  subscription: Subscription = new Subscription();
  constructor(private activitiesService: ActivitiesService) {
    this.getAllApprovalList();
  }
  getAllApprovalList() {
    this.subscription.add(this.activitiesService.getTempRequestApproval().subscribe(
      (value: any) => {
        if (this.filterRequestByStatus) {
          this.approvalList = value.data.filter(x => x.flag == this.filterRequestByStatus);
        } else {
          this.approvalList = value.data;
        }
      }, error => {
        console.log(error);
      }));
  }
  editRecord(e) {
    if (e.rowType == "data" && e.column.cellTemplate != "action_dataTemplate") {
      //
    }
  }
  approveRequest(e) {
    console.log(e);
    this.subscription.add(this.activitiesService.approveDisapproveRequest(e.id, 1).subscribe(
      (value: any) => {
        notify("Approved  ", "success");
      }, error => {
        notify(error.Message, 'error');
      }));
  }
  rejectRequest(e) {
    console.log(e);
    this.subscription.add(this.activitiesService.approveDisapproveRequest(e.id, 0).subscribe(
      (value: any) => {
        notify("rejected  ", "success");
      }, error => {
        notify(error.Message, 'error');
      }));
  }
  checkWitchList():boolean {
    if (this.filterRequestByStatus == 'new') {
      return true;
    }
    return false;
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
