import { CButton } from '@coreui/react'
import { useFormik } from 'formik'
import React from 'react'
import { registerEmployeeSchema } from '../Validations'

const AddEmployee = () => {
  const Formik = useFormik({
    initialValues: {
      firstname: '',
      middlename: '',
      lastname: '',
      gender: 'Male',
      dob: '',
      marital_status: '',
      email_id: '',
      password: '',
      mobilenumber: '',
      par_mobilenumber: '',
      temp_add: '',
      permanant_add: '',
      education: '',
      degree_date: '',
      experiance_type: '',
      experiance_Duration: '',
      pre_org_name: '',
      pre_org_address: '',
      pre_org_designation: '',
      emp_id: '',
    },
    validationSchema: registerEmployeeSchema,
    onSubmit: (values) => {
      console.log(values)
      console.log(Formik.values + 'values...')
    },
  })

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">
          <h4>Employee Details</h4>
        </div>
        <div className="card-body">
          <form action="">
            <div className="row">
              <div className="col-12">
                <h6>Personal Details</h6>
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  placeholder="Enter Name"
                  name='firstname'
                  value={Formik.values.firstname} onChange={Formik.handleChange} onBlur={Formik.handleBlur}
                />
                {Formik.errors.firstname&&Formik.touched.firstname?<p className='text-danger'>{Formik.errors.firstname}</p>:null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="middle_name" className="form-label">
                  Middle Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="middle_name"
                  placeholder="Enter Name"
                  name='middlename'
                  value={Formik.values.middlename} onChange={Formik.handleChange} onBlur={Formik.handleBlur}
                />
                {Formik.errors.middlename&&Formik.touched.middlename?<p className='text-danger'>{Formik.errors.middlename}</p>:null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  placeholder="Enter Name"
                  name='lastname'    
                  value={Formik.values.lastname} onChange={Formik.handleChange} onBlur={Formik.handleBlur}
                />
                {Formik.errors.lastname&&Formik.touched.lastname?<p className='text-danger'>{Formik.errors.lastname}</p>:null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="dob" className="form-label">
                  Date of Birth
                </label>
                <input 
                type="date" 
                className="form-control" 
                id="dob" 
                placeholder="Enter Name"
                name='dob'
                value={Formik.values.dob} onChange={Formik.handleChange} onBlur={Formik.handleBlur}
                />
                {Formik.errors.dob&&Formik.touched.dob?<p className='text-danger'>{Formik.errors.dob}</p>:null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="dob" className="form-label">
                  Gender
                </label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="inlineRadio1"
                      value={Formik.values.gender} onChange={Formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Male
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="inlineRadio2"
                      value={Formik.values.gender} onChange={Formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      Female
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="inlineRadio3"
                      value={Formik.values.gender} onChange={Formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio3">
                      Other
                    </label>
                  </div>
                </div>
                {Formik.errors.gender&&Formik.touched.gender?<p className='text-danger'>{Formik.errors.gender}</p>:null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile" className="form-label">
                  Marital Status
                </label>
                <select id="inputState" className="form-select">
                  <option defaultValue>Choose...</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>widowed</option>
                  <option>Divorce</option>
                </select>
              </div>
              <div className="col-12">
                <h6>Contact Details</h6>
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="email" className="form-label">
                  Email Id
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter Email Id"
                />
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile" className="form-label">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  placeholder="Enter Mobile Number"
                />
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile1" className="form-label">
                  Parent/Gaurdian Contact
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile1"
                  placeholder="Enter Mobile Number"
                />
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="lastname" className="form-label">
                  Temporary Address
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="lastname"
                  placeholder="Enter Address"
                />
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="lastname" className="form-label">
                  Permanant Address
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="lastname"
                  placeholder="Enter Address"
                />
              </div>
              <div className="col-12">
                <h6>Education Details</h6>
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile" className="form-label">
                  Highest Qualification
                </label>
                <select id="inputState" className="form-select">
                  <option defaultValue>Choose...</option>
                  <option>12th</option>
                  <option>Graduation</option>
                  <option>PostGraduation</option>
                </select>
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="doc" className="form-label">
                  Date of Completion
                </label>
                <input type="date" className="form-control" id="doc" placeholder="Enter Name" />
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="doc" className="form-label">
                  Upload Certificate
                </label>
                <input type="file" className="form-control" id="doc" placeholder="Enter Name" />
              </div>
              <div className="col-12">
                <h6>Work Experiance</h6>
              </div>
              <div className="mb-3 col-12">
                <label htmlFor="dob" className="form-label">
                  Experiance Type
                </label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions1"
                      id="fresher"
                      value="option1"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="fresher">
                      Fresher
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions1"
                      id="intwrn"
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="intwrn">
                      Intern
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions1"
                      id="experiance"
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="experiance">
                      Experiance
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile1" className="form-label">
                  Duration <small>(No. of year)</small>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile1"
                  placeholder="Enter Duration in Year"
                />
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="preCompany" className="form-label">
                  Previous Oraganization Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="preCompany"
                  placeholder="Enter Organization Name"
                />
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="role" className="form-label">
                  Designation
                </label>
                <input type="text" className="form-control" id="role" placeholder="Enter Role" />
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="perAdd" className="form-label">
                  Organization Address
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="perAdd"
                  placeholder="Enter Address"
                />
              </div>
            </div>

            <CButton variant="outline" color="info" onClick={Formik.handleSubmit}>
              Submit
            </CButton>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddEmployee
