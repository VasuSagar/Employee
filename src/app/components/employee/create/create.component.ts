import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  employee:Employee; //to push
  
  //error messages
  formErrors = {
    'fullName': '',
    "bday":'',
    'email': '',
    'phone': '',
    'confirmEmail': '',
    'emailGroup': ''
  };

  validationMessages = {
    'fullName': {
      'required': 'Full name is required',
      'minlength': 'Full name must be greater than 2 char',
      'maxlength': "Full name must be less than 10 char"
    },
    'email': {
      'required': 'Email is required',
      'emailDomain': 'Type Email Coorectly with@docsvault.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required',
    },
    'emailGroup': {
      'emailMisMatch': "Mails should be same"
    },
    'phone': {
      'required': 'Phone is required',
      'phoneNotValid': 'Enter 10 digits of phone number'
    },
    'bday':{
      'required':'Enter birthday',
      'dateNotValid':'Enter Correct year'
    }
  };


  employeeForm = this.fb.group({
 
    age:[''],
    fullName: ['',[Validators.required,Validators.minLength(2)]],
    bday:['',[dateValidator,Validators.required]],
   
    contactPreference: ['email'],
    emailGroup: this.fb.group({
      email: ['', [emailDomainparam('docsvault.com'), Validators.required]],
      confirmEmail: ['',Validators.required],
    },{validators: matchEmail}),


    phone: ['',phoneValidator],
    address: this.fb.array([
      this.addAdressFormGroup()
    ]),

  });


  constructor(private fb: FormBuilder, private employeeService: EmployeeService,
              private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.controls.contactPreference.valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    //subscribe to param to get emp id from Edit

    this.route.paramMap.subscribe(params=>{
      const empId:number=+params.get('id');
      if(empId)
      {
        this.getEmployeeToEdit(empId);
      }
      else{
        this.employee={
          id:null,
          fullName:'',
          age:null,
          email:'',
          bday:'',
          phno:null,
          address:[]
        };
      }
    });

    

}

getEmployeeToEdit(empId:number)
{ 
  // this.employee=this.employeeService.getSingleEmployee(empId);
  
  // this.editEmployee(this.employee);

  this.employeeService.getSingleEmployee(empId).subscribe((emp:Employee)=>{
    this.editEmployee(emp);
    this.employee=emp;
  },
  (err)=>{console.log(err)}
  );
}

editEmployee(emp:Employee)
{
  this.employeeForm.patchValue({
    fullName:emp.fullName,
    bday:emp.bday,
    age:emp.age,
    emailGroup:{
      email:emp.email,
      confirmEmail:emp.email
    },
    phone:emp.phno,
  });

  //to bind existing data into formArray we use setControl
  this.employeeForm.setControl('address',this.setExistingAddress(emp.address));
}
setExistingAddress(address: { street: string; city: string; zip: number; }[]): FormArray {
  const newFormArray=new FormArray([]);

  address.forEach(addr=>{
   newFormArray.push(this.fb.group({
      street:addr.street,
      city:addr.city,
      zip:addr.zip
    }));
  });

  return newFormArray;

}



onContactPreferenceChange(selectedValue: string) {
  const phoneControl = this.employeeForm.controls.phone;
  const emailControl=this.employeeForm.controls.emailGroup.get('email');
  const confirmEmailControl=this.employeeForm.controls.emailGroup.get('confirmEmail');

  if (selectedValue === 'phone') {
    phoneControl.setValidators([Validators.required,phoneValidator]);
    //remove existing email validators
   
    emailControl.clearValidators();
    confirmEmailControl.clearValidators();
  }
  else {
    //remove phone validator of required
    phoneControl.clearValidators();
    //assign 10 digit validator
    phoneControl.setValidators(phoneValidator);

    //assing validator to emailgroup
    emailControl.setValidators([Validators.required,emailDomainparam('docsvault.com')]);
    confirmEmailControl.setValidators(Validators.required);
  }

  phoneControl.updateValueAndValidity();
  emailControl.updateValueAndValidity();
  confirmEmailControl.updateValueAndValidity();

}

addAdressFormGroup():FormGroup
{
  return this.fb.group({
    street:['',Validators.required],
    city:['',Validators.required],
    zip:['',[Validators.required]]
  });
  // return this.fb.group({
  //   street:[''],
  //   city:[''],
  //   zip:['']
  // });
}

onSubmit()
{ console.log(this.employeeForm.value);

  //map value of form to employee object
  this.mapFormValueToEmpObject();

  if(this.employee.id){
    this.employeeService.updateEmployee(this.employee);
    this.router.navigate(['employees/list']);
  }

  else
  { console.log(this.employee);
    this.employeeService.saveEmployee(this.employee).subscribe((data)=>{
      console.log(data);
      this.router.navigate(['employees/list']),
      (err)=>{console.log(err)}
    });

    
  }
  
}
mapFormValueToEmpObject() 
{ console.log(this.employeeForm.value);
  console.log(this.employee);
  this.employee.fullName=this.employeeForm.value.fullName;
  //this.employee.id=this.employeeForm.value.id;
  this.employee.age=this.employeeForm.value.age;
  this.employee.email=this.employeeForm.value.emailGroup.email; 
  this.employee.bday=this.employeeForm.value.bday; 
  this.employee.phno=this.employeeForm.value.phone;
  this.employee.address=this.employeeForm.value.address;
}
addNewAddress()
  { 
    (<FormArray>this.employeeForm.get('address')).push(this.addAdressFormGroup()); 
  }

  removeAddressButton(adressindex: number)
  {
    const addressFormArray=<FormArray>this.employeeForm.get('address');
    addressFormArray.removeAt(adressindex);

    //we will mark dity and touched since user will be interacting with delete adress
    addressFormArray.markAsDirty();
    addressFormArray.markAsTouched();

  }
  





  //helper methods
  logValidationErrors(group: FormGroup = this.employeeForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.dirty || abstractControl.touched
          || abstractControl.value!=='')) {
        const message = this.validationMessages[key];
        // console.log(message);
        // console.log(abstractControl.errors);
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += message[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

    });

  }


  //below functions are for testing
  matchEmail(group: AbstractControl): { [key: string]: any } | null {
    const emailControl = group.get('email');
    const confirmEmailControl = group.get('confirmEmail');
    if (emailControl.value == confirmEmailControl.value
      || (confirmEmailControl.pristine && confirmEmailControl.value==='')) {
      return null;
    }
    else {
      return { 'emailMisMatch': true };
    }
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    let i;
  //  const fullDate:string=control.value;
  const fullDate:string=control.value;
  
  
   // console.log(fullDate);
  
    const date=fullDate.substring(fullDate.lastIndexOf('-')+1);
    const month=fullDate.substring(5,7);
  
  
    const year:string=fullDate.substring(0,4);
  
    if(fullDate==='')
    {
      return null;
    }
  
    else if(year<"1900" || year>"2020")
    {
      return {'dateNotValid':true};
    }
  
    else
    {
      return null;
    }
  }

  phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const phno:string=control.value;
    if(phno.length==10 || phno==='')
    {
      return null;
    }
    else
    {
      return {'phoneNotValid':true};
    }
  
  }

  emailDomainparam(domainName: string) 
  {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
  
      if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      }
      else {
        return { 'emailDomain': true };
      };
    }
  
  
  
  }


}


function emailDomainparam(domainName: string) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);

    if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
      return null;
    }
    else {
      return { 'emailDomain': true };
    };
  }



}


function phoneValidator(control: AbstractControl): { [key: string]: any } | null {
  const phno:string=control.value;
  if(phno.length==10 || phno==='')
  {
    return null;
  }
  else
  {
    return {'phoneNotValid':true};
  }

}


function dateValidator(control: AbstractControl): { [key: string]: any } | null {
  let i;
//  const fullDate:string=control.value;
const fullDate:string=control.value;


 // console.log(fullDate);

  const date=fullDate.substring(fullDate.lastIndexOf('-')+1);
  const month=fullDate.substring(5,7);


  const year:string=fullDate.substring(0,4);

  if(fullDate==='')
  {
    return null;
  }

  else if(year<"1900" || year>"2020")
  {
    return {'dateNotValid':true};
  }

  else
  {
    return null;
  }


   

}


function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value == confirmEmailControl.value
    || (confirmEmailControl.pristine && confirmEmailControl.value==='')) {
    return null;
  }
  else {
    return { 'emailMisMatch': true };
  }
}

//for testing purpose we are also including this helper fucntions in the class so that we can perform
//tests on them 






