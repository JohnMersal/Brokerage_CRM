import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { LevelModel } from "../levels-model";
import { LevelsService } from "../levels.service";
import { AppSettings } from "../../../shared/app-settings";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-level',
  templateUrl: './new-level.component.html',
  styleUrls: ['./new-level.component.scss']
})
export class NewLevelComponent implements OnInit {
  @Input() updateMode: boolean = false;
  @Output() afterSave = new EventEmitter();
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  singleLevel: LevelModel = new LevelModel();
  subscription: Subscription = new Subscription();
  constructor(private levelsService: LevelsService) {
  }
  saveLevel() {
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode) {
        this.subscription.add(this.levelsService.updateLevel(this.singleLevel).subscribe(
          (value: any) => {
            notify("Level updated successfully", "success");
            this.afterSave.emit({ id: value, data: this.singleLevel });
            this.singleLevel = new LevelModel();
          }, error => {
            notify(error.meta.message, "error");
          }));
      } else {
        this.subscription.add(this.levelsService.saveLevel(this.singleLevel).subscribe(
          (value: any) => {
            this.afterSave.emit({ id: value, data: this.singleLevel });
            notify("Level saved successfully", "success");
            this.singleLevel = new LevelModel();
          }, error => {
            notify("error in saving.." + error.meta.message, "error");
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
