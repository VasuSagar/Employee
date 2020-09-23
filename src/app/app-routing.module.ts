import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { PagenotfoundComponent } from './components/public/pagenotfound/pagenotfound.component';
import { EmployeeModule } from './modules/employee/employee.module';

const routes: Routes = [
{path:'home',component:HomeComponent},
{path:'',redirectTo:'home',pathMatch:'full'},
{path:'employees',loadChildren:'./modules/employee/employee.module#EmployeeModule'},
{path:'**',component:PagenotfoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
