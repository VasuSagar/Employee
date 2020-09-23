import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  Employees: Employee[];
  filteredEmploye: Employee[] = [];
  nameEmailQuery = new FormControl('');
  constructor(private employeeService: EmployeeService,
    private router: Router) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((data: Employee[]) => {
      this.Employees = data;
      this.filteredEmploye = data;
    }, (er) => {
      console.log(er);
    });

    //name and email query
    this.nameEmailQuery.valueChanges.subscribe((data) => { this.filter() });


  }


  filter()
  {
    if(this.nameEmailQuery.value)
    {
      this.filteredEmploye=[];
        this.Employees.filter((emp:Employee)=>{
        if( emp.email.includes(this.nameEmailQuery.value) ||
            (emp.fullName.includes(this.nameEmailQuery.value)))
        {
          //console.log(emp);

         
          this.filteredEmploye.push(emp);
        }
      });


      //console.log(this.filteredEmploye);
    }
    else
    {
        this.filteredEmploye=this.Employees;
    }
  }





  //ACtions
  editButtonClick(empId) {
    this.router.navigate(['/employees/edit', empId]);
  }
  deleteButtonClick(id: number, arrayId: number) {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      //now to display the refreshed data instantly we can either fetch data again from service
      //OR
      //we can splice the removed object from the local data like below
      this.Employees.splice(arrayId);
    },
      (err) => { console.log(err); }
    );
  }

}
