import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionModel } from "../positions-model";
import { PositionsService } from "../positions.service";
import notify from 'devextreme/ui/notify';
import { AppSettings } from "../../shared/app-settings";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { toDate } from '@angular/common/src/i18n/format_date';
import { DxValidationGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit {
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  @Output() afterSave = new EventEmitter();
  @Input() updateMode = false;
  singlePosition: PositionModel = new PositionModel();
  subscription: Subscription = new Subscription();
  constructor(private positionsService: PositionsService) { }
  savePosition() {
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode) {
        this.subscription.add(this.positionsService.updatePosition(this.singlePosition).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singlePosition });
            notify('Position updated successfully', 'success');
          }, error => {
            notify('error in saving..' + error.message, 'error');
          }));

      } else {
        this.subscription.add(this.positionsService.savePosition(this.singlePosition).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singlePosition });
            notify("Position saved successfully", "success");
          }, error => {
            notify(error.meta.message, "error");
          }));

      }
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
