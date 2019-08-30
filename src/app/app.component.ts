import { Component, OnInit } from '@angular/core';
import { LoginService } from "./components/login/login.service";
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'angular7test';
  constructor(public authService: LoginService,
              private sanitizer: DomSanitizer,
              private router: Router,
              private iconRegistry: MatIconRegistry){
  }
  ngOnInit(): void {
    this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl(
      `/assets/icons/symbol-defsmat.svg`));
  }
}
