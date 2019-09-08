import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerComponent } from './components/shared/spinner.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule, MatSelectModule, MatSidenavModule, MatToolbarModule, MatExpansionModule, MatMenuModule, MatProgressSpinnerModule, MatDialogModule, MatSliderModule, MatSnackBarModule, MatTabsModule, MatInputModule, MatTableModule, MatCheckboxModule, MatButtonToggleModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatRadioModule } from '@angular/material';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AppRoutingModule } from './app-routing.module';
import { DevExtremeModule, DxValidatorModule, DxValidationSummaryModule, DxDataGridModule } from 'devextreme-angular';
import { DxFormModule } from 'devextreme-angular';
import { DxSwitchModule } from 'devextreme-angular';
import { DxAccordionModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule, NotifierOptions } from 'angular-notifier'; // https://www.npmjs.com/package/angular-notifier
import { TimeagoModule } from 'ngx-timeago'; // https://www.npmjs.com/package/ngx-timeago

import { NumbersOnlyDirective } from '../app/components/shared/numbers-only-directive';
import { MobileSidebarToggleDirective, RightSidebarToggleDirective } from '../app/components/shared/sidebar.directive';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/shared/header-navigation/navigation.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NewLeadsComponent } from './components/leads/new-leads/new-leads.component';
import { LeadsListComponent } from './components/leads/leads-list/leads-list.component';
import { EmployeesListComponent } from './components/employees/employees-list.component';
import { NewEmployeeComponent } from './components/employees/new-employee/new-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { Interceptor } from './Interceptor';
import { AdminComponent } from './components/admin/admin.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { AreasListComponent } from './components/areas/areas-list/areas-list.component';
import { NewAreasComponent } from './components/areas/new-areas/new-areas.component';
import { TabsComponent } from './components/shared/tabs/tabs.component';
import { CompoundsListComponent } from './components/compounds/compounds-list/compounds-list.component';
import { NewCompoundsComponent } from './components/compounds/new-compounds/new-compounds.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { NewClientComponent } from './components/clients/new-client/new-client.component';
import { NewUnitComponent } from './components/units/new-unit/new-unit.component';
import { UnitsListComponent } from './components/units/units-list/units-list.component';
import { TodosListComponent } from './components/todos/todos-list/todos-list.component';
import { NewTodoComponent } from './components/todos/new-todo/new-todo.component';
import { ActivitiesListComponent } from './components/activities/activities-list/activities-list.component';
import { NewActivityComponent } from './components/activities/new-activity/new-activity.component';
import { NotificationsListComponent } from './components/notifications/notifications-list/notifications-list.component';
import { NewLevelComponent } from './components/gamifications/levels/new-level/new-level.component';
import { LevelsListComponent } from './components/gamifications/levels/levels-list/levels-list.component';
import { CompitationComponent } from './components/gamifications/compitation/compitation.component';
import { HappyHourComponent } from './components/gamifications/happy-hour/happy-hour.component';
import { GamificationsComponent } from './components/gamifications/gamifications-page/gamifications.component';
import { TargetPointsComponent } from './components/gamifications/target-points/target-points.component';
import { LoginComponent } from './components/login/login/login.component';
import { PermissionListComponent } from './components/permission/permission-list/permission-list.component';
import { NewBrokerComponent } from './components/brokers/new-broker/new-broker.component';
import { BrokersListComponent } from './components/brokers/brokers-list/brokers-list.component';
import { CheckConflictComponent } from './components/requests/conflicts/check-conflict/check-conflict.component';
import { SolveconflictsComponent } from './components/requests/conflicts/solveconflicts/solveconflicts.component';
import { RequestsComponent } from './components/requests/requests.component';

// Overriding Notifier Options
const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right'
    }
  },
  theme: 'material',
  behaviour: {
    stacking: 5
  },
};

@NgModule({
  declarations: [AppComponent
    , SpinnerComponent
    , NavigationComponent
    , SidebarComponent
    , HomePageComponent
    , NewLeadsComponent
    , NumbersOnlyDirective
    , MobileSidebarToggleDirective
    , RightSidebarToggleDirective
    , NewUnitComponent
    , EmployeesListComponent
    , NewEmployeeComponent
    , EditEmployeeComponent, AdminComponent,
    ToastComponent, AreasListComponent,
    NewAreasComponent, TabsComponent,
    CompoundsListComponent, NewCompoundsComponent,
    ClientListComponent, NewClientComponent,
    UnitsListComponent, TodosListComponent,
    NewTodoComponent, LeadsListComponent,
    ActivitiesListComponent, NewActivityComponent,
    NotificationsListComponent, NewLevelComponent,
    LevelsListComponent, CompitationComponent,
    HappyHourComponent, GamificationsComponent,
    TargetPointsComponent, LoginComponent,
    PermissionListComponent, NewBrokerComponent,
    BrokersListComponent, CheckConflictComponent,
    SolveconflictsComponent, RequestsComponent
  ],
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN'
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DxSwitchModule,
    NgbModule,
    TimeagoModule.forRoot(),
    DxAccordionModule,
    DxFormModule,
    DevExtremeModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NotifierModule.withConfig( notifierDefaultOptions ),
    MatFileUploadModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule, MatSliderModule,
    MatSnackBarModule, MatTabsModule,
    MatInputModule, MatTableModule,
    MatCheckboxModule, MatButtonToggleModule,
    MatDatepickerModule, MatNativeDateModule,
    MatStepperModule, MatRadioModule
  ],
  providers: [
    FormBuilder,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
    // ,{ provide: CookieOptions, useClass: BaseCookieOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
