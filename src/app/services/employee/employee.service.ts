import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Employee } from 'src/app/models/employee';
@Injectable()
export class EmployeeService {
  url:string='http://localhost:3000/employees';
  constructor(private http:HttpClient) { }

  //error handle variable
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
        console.error(error);

    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  getAllEmployees():Observable<Employee[]>
  { 
    return this.http.get<Employee[]>(this.url)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getSingleEmployee(empId:Number):Observable<Employee>
  {
    return this.http.get<Employee>(this.url+`/${empId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  updateEmployee(employee:Employee):Observable<Employee>
  {
    return this.http.put<Employee>(this.url+`/${employee.id}`,employee,{
        //we can specify headers here if we want to like below
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEmployee(empId:Number)
  {
    return this.http.delete(this.url+`/${empId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  saveEmployee(employee:Employee):Observable<Employee>
  {
    return this.http.post<Employee>(this.url,employee)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

}
