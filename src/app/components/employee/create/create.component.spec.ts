import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from 'protractor';
import { EmployeeService } from 'src/app/services/employee/employee.service';

import { CreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let de:DebugElement;
  let form:HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComponent ],
      imports:[HttpClientTestingModule,
              ReactiveFormsModule,
              RouterTestingModule],
      providers:[EmployeeService]
    })
    .compileComponents().then(()=>{
        fixture = TestBed.createComponent(CreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
       
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have #contactPreference as #email',()=>{
    expect(component.employeeForm.value.contactPreference).toEqual('email');
  });

  it('#employeeForm should be valid',()=>{
      
    const employeeForm=component.employeeForm;
    employeeForm.controls.fullName.setValue('vasu');
    employeeForm.controls.age.setValue(24);
    employeeForm.controls.emailGroup.get('email').setValue('vasu@docsvault.com');
    employeeForm.controls.emailGroup.get('confirmEmail').setValue('vasu@docsvault.com');
    employeeForm.controls.bday.setValue('2020-09-18');

    employeeForm.controls.address.setValue([{
        street:"doc",
        city:"bard",
        zip:33
    }]);

    
    expect(employeeForm.valid).toBeTruthy();
  });

  it('#employeeForm should be invalid',()=>{
      
    const employeeForm=component.employeeForm;
    employeeForm.controls.fullName.setValue('vasu');
    employeeForm.controls.age.setValue(24);
    employeeForm.controls.emailGroup.get('email').setValue('vasu@gmail.com');
    employeeForm.controls.emailGroup.get('confirmEmail').setValue('vasu@docsvault.com');
    employeeForm.controls.bday.setValue('2020-09-18');

    employeeForm.controls.address.setValue([{
        street:"doc",
        city:"bard",
        zip:33
    }]);

    
    expect(employeeForm.valid).toBeFalsy();
  });


  it('should return #emailMisMatch as #true if #email and #confirmEmail does not matches',()=>{
    let emailGroup=new FormGroup({
        email:new FormControl('vasu@docsvault.com'),
        confirmEmail:new FormControl('vasuuu@docsvault.com')
    });
    const matchFunction=component.matchEmail(emailGroup);
    expect(matchFunction).toEqual({ 'emailMisMatch': true });
  });

  it('should return #null if #email matches',()=>{
    let emailGroup=new FormGroup({
        email:new FormControl('vasu@docsvault.com'),
        confirmEmail:new FormControl('vasu@docsvault.com')
    });
    const matchEmailFunction=component.matchEmail(emailGroup);
    expect(matchEmailFunction).toEqual(null);
  });

  it('should return #dateNotValid as #true if date is NOT betwen 1900-2020',()=>{
    
       let bday=new FormControl('5000-09-18');
  

    const dateValidatorFunction=component.dateValidator(bday);
    expect(dateValidatorFunction).toEqual({ 'dateNotValid': true });

  });

  it('should return #null if date is betwen 1900-2020',()=>{
  
       let bday=new FormControl('2020-09-18');
    

    const dateValidatorFunction=component.dateValidator(bday);
    expect(dateValidatorFunction).toEqual(null);
  });

  it('should return #required validation if #email is empty',()=>{
    const employeeForm=component.employeeForm;
    let email=employeeForm.controls.emailGroup.get('email');
    email.setValue('');
    expect(email.errors['required']).toBeTruthy();
  });

  it('should return #phoneNotValid as #true if phone is not valid',()=>{
    let phone=new FormControl('971292522422');

    const phoneValidator=component.phoneValidator(phone);
    expect(phoneValidator).toEqual({'phoneNotValid':true});
  });

  it('should return #null if phone is perfectly valid',()=>{
    let phone=new FormControl('0712922254');

    const phoneValidator=component.phoneValidator(phone);
    expect(phoneValidator).toEqual(null);
  });

  it('should return #emailDomain as #true if #domaiName(parameter)!=#domain',()=>{
    const control=new FormControl('vasu@gmail.com');
    const domainValidator=component.emailDomainparam('docsvault.com');
    expect(domainValidator(control)).toEqual({'emailDomain': true});
  });

  it('should return #null if #domaiName(parameter)==#domain',()=>{
    const control=new FormControl('vasu@docsvault.com');
    const domainValidator=component.emailDomainparam('docsvault.com');
    expect(domainValidator(control)).toEqual(null);
  });
  




});
