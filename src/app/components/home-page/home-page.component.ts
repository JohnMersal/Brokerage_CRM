import { Component, OnInit } from '@angular/core';
import { HomePageService } from "./home-page.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [HomePageService]
})
export class HomePageComponent implements OnInit {
  population2Data: any[];
  areas: any[];
  populationData: any[];
  types: string[] = ["area", "stackedarea", "fullstackedarea"];
  constructor(service: HomePageService) {
    this.areas = service.getAreas();
    this.populationData = service.getPopulationData();
    this.population2Data = service.getPopulation2Data();
    // Progressbar configurations
  }

  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  legendClickHandler(e) {
    let arg = e.target,
      item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    if (item.isVisible()) {
      item.hide();
    } else {
      item.show();
    }
  }
  customizeTooltip(arg) {
    return {
      text: "Current t&#176: " + arg.value + "&#176C<br>" + "Average t&#176: " + arg.target + "&#176C"
    };
  }
  ngOnInit() {
  }

}
