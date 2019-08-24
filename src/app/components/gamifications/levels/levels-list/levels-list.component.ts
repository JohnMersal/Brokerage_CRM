import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { levelsList, LevelModel } from "../levels-model";
import { LevelsService } from "../levels.service";
import { NewLevelComponent } from "../new-level/new-level.component";
import { AppSettings } from "../../../shared/app-settings";
import { formatDate } from '@angular/common';
declare var jQuery: any;

@Component({
  selector: 'app-levels-list',
  templateUrl: './levels-list.component.html',
  styleUrls: ['./levels-list.component.scss']
})
export class LevelsListComponent implements OnInit {
  @ViewChild('edit') EditComponent: NewLevelComponent;
  RowFilter: boolean = false;
  GroupFilter: boolean = false;
  editLevel: LevelModel = new LevelModel();
  levelsList: levelsList[] = [];
  assginToEmployee: number = null;
  subscription: Subscription = new Subscription();
  constructor(private levelsService: LevelsService) {
    this.getAllLevels();
  }
  getAllLevels() {
    this.subscription.add(this.levelsService.getAllLevels().subscribe(
      (value: any) => {
        this.levelsList = value.data;
      }, error => {
        console.log(error);
      }));
  }
  updateLevel() {
    if (this.editLevel.name != null && this.editLevel.value != null) {
      this.subscription.add(this.levelsService.updateLevel(this.editLevel).subscribe(
        (value: any) => {
          notify("Lead updated successfully", "success");
          this.getAllLevels();
          (<any>jQuery('#editLevelModal')).modal('hide');
          this.editLevel = new LevelModel();
        }, error => {
          notify(error.error, "error");
        }));
    }
  }
  editRecord(e: any) {
    if (e.rowType == "data") {
      this.EditComponent.singleLevel = {
        id: e.data.id,
        name: e.data.name,
        value: e.data.value
      };
      (<any>jQuery('#editLevelModal')).modal('show');
    }
  }
  getDateFormated(x) {
    let date = x.value;
    let formatedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatedDate;
  }
  afterSave() {
    this.getAllLevels();
    (<any>jQuery('#editLevelModal')).modal('hide');
  }
  ngOnInit() {
  }

}
