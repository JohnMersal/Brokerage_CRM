import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  mainTabsSwitch: string = "approval";
  mainTabsName: string = "Approval";

  constructor() { }
  changeMainTabs(targetMainTab: string) {
    switch (targetMainTab) {
      case "conflicts":
        this.mainTabsName = "Conflicts";
        break;
      case "CILRequest":
        this.mainTabsName = "CIL Requests";
        break;
      case "approval":
        this.mainTabsName = "Approval";
        break;
      case "TCR":
        this.mainTabsName = "TCR";
        break;
    }
    this.mainTabsSwitch = targetMainTab;
  }
  ngOnInit() {
  }

}
