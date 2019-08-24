import { Component } from '@angular/core';
import { LoginService } from "./components/login/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular7test';
  constructor(public authService: LoginService){}
}
