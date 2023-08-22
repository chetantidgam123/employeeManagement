import * as yup from 'yup';

export const registerEmployeeSchema=yup.object({
    firstname:yup.string().min(2).max(30).required("First name is Required"),
    middlename:yup.string().min(2).max(30).required("Middle name is Required"),
    lastname:yup.string().min(2).max(30).required("Last name is Required"),
    gender:yup.string().min(2).max(10).required("Gender is Required"),
    dob:yup.string().min(2).max(20).required("DOB is Required"),
    marital_status:yup.string().min(2).max(20).required("marital status is Required"),
    email_id:yup.string().email('Invalid Email').required("Email Id is required"),
    password:yup.string().min(6,'minimum 6 character').required("Password is Required"),
    mobilenumber:yup.string().matches(/^\+?[1-9][0-9]{5,12}$/, 'Mobile number must be a 10-digit number').required('Mobile number is required'),
    par_mobilenumber:yup.string().matches(/^\+?[1-9][0-9]{5,12}$/, 'Mobile number must be a 10-digit number').required('Mobile number is required'),
    temp_add:yup.string().min(2).max(200).required("Address is Required"),
    permanant_add:yup.string().min(2).max(200).required("Address is Required"),
    education:yup.string().min(2).max(30).required("Qualification Id is Required"),
    degree_date:yup.string().min(2).max(50).required("Date Required"),
    experiance_type:yup.string().min(2).max(30).required("Expreiance Type Required"),
    experiance_Duration:yup.string().min(2).max(2,"Enter experiance in Years"),
    pre_org_name:yup.string().min(2).max(50),
    pre_org_address:yup.string().min(2).max(200),
    pre_org_designation:yup.string().min(2).max(30),
    emp_id:yup.string().min(2).max(10).required("Employee Id is Required"),
})