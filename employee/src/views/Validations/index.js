import * as yup from 'yup'

export const registerEmployeeSchema = yup.object({
  firstname: yup.string().min(2).max(30).required('First name is Required'),
  middlename: yup.string().min(2).max(30).required('Middle name is Required'),
  lastname: yup.string().min(2).max(30).required('Last name is Required'),
  gender: yup.string().min(2).max(10).required('Gender is Required'),
  dob: yup.date().required('DOB is Required'),
  marital_status: yup.string().min(2).max(20).required('marital status is Required'),
  email_id: yup.string().matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}$/, 'Enter valid email address.').required('Email Id is required'),
  password: yup.string().min(6, 'minimum 6 character').required('Password is Required'),
  mobilenumber: yup.string().matches(/^[6-9]{1}[0-9]{9}$/, 'Enter valid mobile number.').min(10, 'Phone Number should not be less than 10 digit.').required('Mobile number is required'),
  par_mobilenumber: yup.string().matches(/^[6-9]{1}[0-9]{9}$/, 'Enter valid mobile number.').min(10, 'Phone Number should not be less than 10 digit.').required('Mobile number is required'),
  temp_add: yup.string().min(2).max(200).required('Address is Required'),
  permanant_add: yup.string().min(2).max(200).required('Address is Required'),
  education: yup.string().min(2).max(30).required('Qualification is Required'),
  degree_date: yup.string().min(2).max(50).required('Date Required'),
  degrre_cert: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }),
  // .test('fileType', 'Unsupported file type', (value) => {
  // if(!value) return true; 
  //   return value && ['image/jpeg', 'image/png','.pdf'].includes(value.type);
  // }),
  experiance_type: yup.string().min(2).max(30).required('Expreiance Type Required'),
  experiance_Duration: yup.string().min(2).max(2, 'Enter experiance in Years'),
  pre_org_name: yup.string().min(2).max(50),
  pre_org_address: yup.string().min(2).max(200),
  pre_org_designation: yup.string().min(2).max(30),
  emp_id: yup.string().min(2).max(10).required('Employee Id is Required'),
})

export const uploadEmployeeDocSchema = yup.object({
  profile_photo: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760
    // 10MB
  }).nullable(),
  aadhar_number: yup.string().matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,'Enter a valid aadharcard number').required('Aadhar Number is Required'),
  aadhar_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
  pan_number: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter valid pan card number.').required('Aadhar Number is Required'),
  pan_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
  resident_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
  education_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
  bank_acc_number: yup.string()
  .matches(/^\d{9,18}$/, 'Invalid bank account number.').required('Bank account number is Required'),
  ifsc_code: yup.string().matches(/^[A-Z]{4}[0]{1}[0-9]{6}$/, 'Invalid IFSC code.').required('IFSC code is Required'),
  bank_branch: yup.string().min(2).max(30).required('Bank branch is Required'),
  bank_name: yup.string().min(2).max(30).required('Bank name is Required'),
  bank_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
  exp_cer_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
  sal_slip_doc: yup.mixed().test('fileSize', 'File size is too large', (value) => {
    if (!value) return true;
    return value && value.size <= 10485760 // 10MB
  }).nullable(),
})

export const updateEmpProfileSchema = yup.object({
  doj: yup.string().min(2).max(30).required('Date of Joining Required'),
  salary: yup.string().min(2).max(10).required('Current Salary is Required'),
  increse_sal: yup.string().min(2).max(10).required('Incresed Salary is Required'),
  date_of_app: yup.string().min(2).max(30).required('Date of Appraisal is Required'),
  designation: yup.string().min(2).max(30).required('Current designation is Required'),
  prometed_desig: yup.string().min(2).max(30).required('Promoted Designation is Required'),
})

export const applyLeaveSchema = yup.object({
  start: yup.date().required('Start Date is Required'),
  end: yup.date().required('End  Date is Required').min(yup.ref('start'), 'End date must be later than start date'),
  color: yup.string().required('Select the Color for Leave'),
  title: yup.string().min(2).max(50).required('Reason Of Leave'),
  resource: yup.string().min(2).max(200, 'Max 200 Character allowed'),
  leave_type: yup.string().required('Select Leave Type'),
})
export const holidaySchema = yup.object({
  date: yup.date().required('Date is Required'),
  color: yup.string().required('Select the Color for Holiday'),
  title: yup.string().min(2).max(50).required('Holiday Title Required'),
  description: yup.string().min(2).max(200, 'Max 200 Character allowed'),
})