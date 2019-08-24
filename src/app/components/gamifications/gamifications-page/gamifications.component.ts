import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gamifications',
  templateUrl: './gamifications.component.html',
  styleUrls: ['./gamifications.component.scss']
})
export class GamificationsComponent implements OnInit {
  mainTabsName: string = "";
  mainTabsSwitch: string = "FixedPoints";
  constructor() { }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "FixedPoints":
        this.mainTabsName = "Fixed points";
        break;
      case "HappyHours":
        this.mainTabsName = "Happy hours";
        break;
      case "TargetPoints":
        this.mainTabsName = "Target points";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  ngOnInit() {
  }

}
