import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from 'src/app/components/employee/create/create.component';
import { ListComponent } from 'src/app/components/employee/list/list.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EmployeeRoutingModule } from 'src/app/routing/employee/employee-routing.module';
import { SharedModule } from '../shared/shared/shared.module';



@NgModule({
  declarations: [
    CreateComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeeRoutingModule
  ],
  providers:[
    EmployeeService
  ]
})
export class EmployeeModule { }
