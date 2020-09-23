import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from 'src/app/components/employee/create/create.component';
import { ListComponent } from 'src/app/components/employee/list/list.component';
const routes: Routes = [

            { path: 'create', component: CreateComponent },
            { path: 'list', component: ListComponent },
            { path: 'edit/:id', component: CreateComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmployeeRoutingModule
{

}