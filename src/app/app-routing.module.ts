import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { NewLeadsComponent } from "./components/leads/new-leads/new-leads.component";
import { NewUnitComponent } from './components/units/new-unit/new-unit.component';
import { EmployeesListComponent } from './components/employees/employees-list.component';
import { NewEmployeeComponent } from './components/employees/new-employee/new-employee.component';
import { EditEmployeeComponent } from "./components/employees/edit-employee/edit-employee.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ClientListComponent } from "./components/clients/client-list/client-list.component";
import { NewClientComponent } from "./components/clients/new-client/new-client.component";
import { UnitsListComponent } from './components/units/units-list/units-list.component';
import { TodosListComponent } from './components/todos/todos-list/todos-list.component';
import { NewTodoComponent } from "./components/todos/new-todo/new-todo.component";
import { GamificationsComponent } from "./components/gamifications/gamifications-page/gamifications.component";
import { LoginComponent } from "./components/login/login/login.component";
import { AdminGuard } from './admin.guard';
import { PermissionListComponent } from './components/permission/permission-list/permission-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AdminGuard] },
  { path: 'addLead', component: NewLeadsComponent, canActivate: [AdminGuard] },
  { path: 'addUnit', component: NewUnitComponent, canActivate: [AdminGuard] },
  { path: 'units', component: UnitsListComponent, canActivate: [AdminGuard] },
  { path: 'employees', component: EmployeesListComponent, canActivate: [AdminGuard] },
  { path: 'addEmployee', component: NewEmployeeComponent, canActivate: [AdminGuard] },
  { path: 'employee/:ID', component: EditEmployeeComponent, canActivate: [AdminGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'toDo', component: TodosListComponent, canActivate: [AdminGuard] },
  { path: 'clients', component: ClientListComponent, canActivate: [AdminGuard] },
  { path: 'addClient', component: NewClientComponent, canActivate: [AdminGuard] },
  { path: 'addTodo', component: NewTodoComponent, canActivate: [AdminGuard] },
  { path: 'gamifications', component: GamificationsComponent, canActivate: [AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'permission', component: PermissionListComponent },
  
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
