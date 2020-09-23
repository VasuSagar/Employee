import { HttpClient, HttpHandler } from '@angular/common/http';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Employee } from 'src/app/models/employee';

import { EmployeeService } from './employee.service';
import {
    HttpClientTestingModule,
    HttpTestingController
  } from '@angular/common/http/testing';

describe('EmployeeServicee', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers:[EmployeeService],
        imports:[HttpClientTestingModule]
    });

  });

  it('should be created', () => {
    service= TestBed.inject(EmployeeService);
    expect(service).toBeTruthy();
  });
});

describe('EmployeeService',()=>{
    let injector;
    let service: EmployeeService;
    let httpMock: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [EmployeeService]
  });

    injector = getTestBed();
    service = injector.get(EmployeeService);
    httpMock = injector.get(HttpTestingController);
});

describe('#getEmployees',()=>{
    it('should return an Observable of Employees[]',()=>{
        const dummyEmployees:Employee[]=[
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


        service.getAllEmployees().subscribe((employee:Employee[])=>{
            expect(employee.length).toBe(2);
            expect(employee).toEqual(dummyEmployees);
        });

        const req = httpMock.expectOne(`${service.url}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyEmployees);


    });
});
});