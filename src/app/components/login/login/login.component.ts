import { Component, OnInit, ViewChild } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from "../login.service";
import notify from 'devextreme/ui/notify';
import { AppSettings } from '../../shared/app-settings';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = "info@mail.com";
  password: string = "123456789";
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  subscription: Subscription = new Subscription();
  constructor(private loginService: LoginService, private router: Router) {

  }
  login() {
    if (this.DataValidator.instance.validate().isValid) {
      this.subscription.add(this.loginService.login(this.username, this.password).subscribe(
        (value: any) => {
          if (value.meta.code == 200) {
            notify(value.meta.message, "success");
            this.router.navigate(['home']);
          } else if (value.meta.code == 401) {
            notify(value.meta.message, "success");
          }
        }, error => {
          notify(error, "error");//.meta.message
        }));
    }
  }
  ngOnInit() {
    // If user is Logged in, he cannot see this page, he is redirected to home!
    if (this.loginService.LoggedIn){
      this.router.navigate(['home']);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
