import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  host: {
    '(document:click)': 'closeTabsElement($event)',
  }
})
export class TabsComponent implements OnInit {
  @Input() currentTabName = '';
  @ViewChild('tabsElement') tabsElement: ElementRef;
  @ViewChild('navbar_button_toggle') navbar_button_toggle: ElementRef;
  @ViewChild('navbar_collapse') navbar_collapse: ElementRef;
  constructor() { }
  closeTabsElement(e) {
    if (this.tabsElement && this.navbar_button_toggle) {
      let container = $(this.tabsElement.nativeElement);
      let buttonToggle = $(this.navbar_button_toggle.nativeElement);
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.find('.navbar-collapse').removeClass('in');
        container.find('.navbar-collapse').attr('aria-expanded', false);
        buttonToggle.attr('aria-expanded', false);
        //console.log("closetabsElement", container);
      }
    }
  }
  ngOnInit() {
    if (this.tabsElement && this.navbar_button_toggle && this.navbar_collapse) {
      let menuElement = $(this.tabsElement.nativeElement).find('#HeaderTabs li');
      //console.log("menuElement", menuElement);
      let menuCollapse = $(this.navbar_collapse.nativeElement);
      let buttonToggle = $(this.navbar_button_toggle.nativeElement);
      menuElement.click(function() {
        menuCollapse.removeClass('in');
        menuCollapse.attr('aria-expanded', false);
        buttonToggle.attr('aria-expanded', false);
      });
    }
  }

}
