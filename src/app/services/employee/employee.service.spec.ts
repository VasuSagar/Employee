import { HttpClient, HttpHandler } from '@angular/common/http';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Employee } from 'src/app/models/employee';

import { EmployeeService } from './employee.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('EmployeeServicee Initilization', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService],
      imports: [HttpClientTestingModule]
    });

  });

  it('should be created', () => {
    service = TestBed.inject(EmployeeService);
    expect(service).toBeTruthy();
  });
});

describe('EmployeeService', () => {
  let injector;
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });

    injector = getTestBed();
    service = injector.get(EmployeeService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('#getEmployees', () => {
    it('should return an Observable of Employees[]', () => {
      const dummyEmployees: Employee[] = [
        {
          "id": 1,
          "fullName": "Dhruv patel",
          "email": "dhruv@docsvault.com",
          "age": 21,
          "phno": 9712925224,
          "bday": "1/1/98",
          "address": [
            {
              "street": "vrund res",
              "city": "baroda",
              "zip": 390016
            },
            {
              "street": "gorwa road",
              "city": "bharuch",
              "zip": 390023
            }
          ]
        },
        {
          "id": 2,
          "fullName": "Yash patel",
          "email": "yash@gmail.com",
          "age": 22,
          "phno": 98225523221,
          "bday": "2/2/12",
          "address": [
            {
              "street": "hokahe sociey",
              "city": "kalol",
              "zip": 322122
            }
          ]
        }
      ];


      service.getAllEmployees().subscribe((employee: Employee[]) => {
        expect(employee.length).toBe(2);
        expect(employee).toEqual(dummyEmployees);
      });

      const req = httpMock.expectOne(`${service.url}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyEmployees);


    });


    it('should return an Observable of Employee', () => {
      const dummyEmployee: Employee = {
        "id": 1,
        "fullName": "Dhruv patel",
        "email": "dhruv@docsvault.com",
        "age": 21,
        "phno": 9712925224,
        "bday": "1/1/98",
        "address": [
          {
            "street": "vrund res",
            "city": "baroda",
            "zip": 390016
          }
        ]
      }


      service.getSingleEmployee(dummyEmployee.id).subscribe((employee: Employee) => {
        
        expect(employee).toEqual(dummyEmployee);
      });

      const req = httpMock.expectOne(`${service.url}/${dummyEmployee.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyEmployee);

    });

    it('should make POST request',()=>{
      
      const dummyEmployee: Employee = {
        "id": 1,
        "fullName": "Dhruv patel",
        "email": "dhruv@docsvault.com",
        "age": 21,
        "phno": 9712925224,
        "bday": "1/1/98",
        "address": [
          {
            "street": "vrund res",
            "city": "baroda",
            "zip": 390016
          }
        ]
      }

      service.saveEmployee(dummyEmployee).subscribe((res)=>{
        expect(res).toEqual(dummyEmployee);

      });

      const req = httpMock.expectOne(`${service.url}`);
      expect(req.request.method).toBe('POST');
      req.flush(dummyEmployee);


    });

    it('should update existing #employee with #editedEmoployee',()=>{
      const originalEmployee: Employee = {
        "id": 1,
        "fullName": "Dhruv patel",
        "email": "dhruv@docsvault.com",
        "age": 21,
        "phno": 9712925224,
        "bday": "1/1/98",
        "address": [
          {
            "street": "vrund res",
            "city": "baroda",
            "zip": 390016
          }
        ]
      }
      const updatedEmployee: Employee = {
        "id": 1,
        "fullName": "Vasu",
        "email": "vasu@docsvault.com",
        "age": 21,
        "phno": 9712925224,
        "bday": "1/1/98",
        "address": [
          {
            "street": "vrund res",
            "city": "baroda",
            "zip": 390016
          }
        ]
      }

      service.updateEmployee(updatedEmployee).subscribe((res)=>{
        expect(res).toEqual(updatedEmployee);

      });

      const req = httpMock.expectOne(`${service.url}/${updatedEmployee.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedEmployee);


      
    });

    it('should delete the employee',()=>{
      const empId:Number=4;
      service.deleteEmployee(empId).subscribe((res)=>{
        expect(res).toEqual({response:'OK'});

      });

      const req = httpMock.expectOne(`${service.url}/${empId}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({response:'OK'});
    });






  });



});