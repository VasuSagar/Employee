export interface Employee
{   id:number;
    fullName:string;
    email:string;
    age:number;
    phno:number;
    bday:string;
    address:{
        street:string;
        city:string;
        zip:number;
    }[];

}