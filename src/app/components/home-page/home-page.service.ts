import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
areas: any[] = [{
  country: "New Cairo",
  area: 12
}, {
  country: "Nacer City",
  area: 7
}, {
  country: "Maadi",
  area: 7
}, {
  country: "October",
  area: 7
}, {
  country: "New DC",
  area: 6
}, {
  country: "elRehab",
  area: 5
}, {
  country: "Others",
  area: 55
  }];
  
  populationData: any[] = [{
    country: "China",
    y014: 320866959,
    y1564: 853191410,
    y65: 87774113
  }, {
    country: "India",
    y014: 340419115,
    y1564: 626520945,
    y65: 47063757
  }, {
    country: "United States",
    y014: 58554755,
    y1564: 182172625,
    y65: 34835293
  }, {
    country: "Indonesia",
    y014: 68715705,
    y1564: 146014815,
    y65: 10053690
  }, {
    country: "Brazil",
    y014: 50278034,
    y1564: 113391494,
    y65: 9190842
  }, {
    country: "Russia",
    y014: 26465156,
    y1564: 101123777,
    y65: 18412243
    }];
  population2Data: any[] = [{
    arg: 1950,
    val: 2525778669
  }, {
    arg: 1960,
    val: 3026002942
  }, {
    arg: 1970,
    val: 3691172616
  }, {
    arg: 1980,
    val: 4449048798
  }, {
    arg: 1990,
    val: 5320816667
  }, {
    arg: 2000,
    val: 6127700428
  }, {
    arg: 2010,
    val: 6916183482
  }];
  constructor() { }
  getAreas(): any[] {
    return this.areas;
  }
  getPopulationData(): any[] {
    return this.populationData;
  }
  getPopulation2Data(): any[] {
    return this.population2Data;
  }
}
