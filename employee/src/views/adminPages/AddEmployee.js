import { useFormik } from 'formik'
import React from 'react'
import { registerEmployeeSchema } from '../Validations'
import { EmployeeId, getUserById, registration } from 'src/Services/service'
import { useNavigate } from 'react-router-dom'
import { error_toast, success_toast } from 'src/Services/swalService'

const AddEmployee = () => {
  const navigate = useNavigate()
  const formik = useFormik({
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
      degrre_cert: null,
      experiance_type: 'Fresher',
      experiance_Duration: '',
      pre_org_name: '',
      pre_org_address: '',
      pre_org_designation: '',
      emp_id: '',
    },
    validationSchema: registerEmployeeSchema,
    onSubmit: (values) => {
      registerEmployee(values)
    },
  })
  const registerEmployee = async (values) => {
    const formdata = new FormData()
    for (const key in formik.values) {
      if (formik.values.hasOwnProperty(key)) {
        // Check if the property is an own property (not inherited)
        formdata.append(key, formik.values[key])
        // if (key === 'degrre_cert') {
        // } else {
        //   formdata.append(key, formik.values[key])
        // }
      }
    }

    await registration(values)
      .then((result) => {
        if (result.data.code == 200) {
          success_toast(result.data.message)
          navigate('/emplist')
        } else {
          error_toast(result.data.message)
        }
      })
      .catch((err) => {
        error_toast(err)
      })
  }
  const getEmployeeId = async () => {
    await EmployeeId()
      .then((result) => {
        if (result.data.code == 200) {
          formik.setFieldValue('emp_id', result.data.data)
        } else {
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">
          <h4>Employee Details</h4>
        </div>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit} action="" method="">
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
                  name="firstname"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.firstname && formik.touched.firstname ? (
                  <p className="text-danger">{formik.errors.firstname}</p>
                ) : null}
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
                  name="middlename"
                  value={formik.values.middlename}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.middlename && formik.touched.middlename ? (
                  <p className="text-danger">{formik.errors.middlename}</p>
                ) : null}
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
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.lastname && formik.touched.lastname ? (
                  <p className="text-danger">{formik.errors.lastname}</p>
                ) : null}
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
                  name="dob"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.dob && formik.touched.dob ? (
                  <p className="text-danger">{formik.errors.dob}</p>
                ) : null}
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
                      value="Male"
                      checked={formik.values.gender === 'Male'}
                      onChange={formik.handleChange}
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
                      value="Female"
                      checked={formik.values.gender === 'Female'}
                      onChange={formik.handleChange}
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
                      value="Other"
                      checked={formik.values.gender === 'Other'}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio3">
                      Other
                    </label>
                  </div>
                </div>
                {formik.errors.gender && formik.touched.gender ? (
                  <p className="text-danger">{formik.errors.gender}</p>
                ) : null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile" className="form-label">
                  Marital Status
                </label>
                <select
                  id="inputState"
                  name="marital_status"
                  value={formik.values.marital_status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-select"
                >
                  <option defaultValue value="null">
                    Choose...
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="widowed">widowed</option>
                  <option value="Divorce">Divorce</option>
                </select>
                {formik.errors.marital_status && formik.touched.marital_status ? (
                  <p className="text-danger">{formik.errors.marital_status}</p>
                ) : null}
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
                  name="email_id"
                  value={formik.values.email_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email_id && formik.touched.email_id ? (
                  <p className="text-danger">{formik.errors.email_id}</p>
                ) : null}
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
                  name="mobilenumber"
                  value={formik.values.mobilenumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.mobilenumber && formik.touched.mobilenumber ? (
                  <p className="text-danger">{formik.errors.mobilenumber}</p>
                ) : null}
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
                  name="par_mobilenumber"
                  value={formik.values.par_mobilenumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.par_mobilenumber && formik.touched.par_mobilenumber ? (
                  <p className="text-danger">{formik.errors.par_mobilenumber}</p>
                ) : null}
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
                  name="temp_add"
                  value={formik.values.temp_add}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.temp_add && formik.touched.temp_add ? (
                  <p className="text-danger">{formik.errors.temp_add}</p>
                ) : null}
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
                  name="permanant_add"
                  value={formik.values.permanant_add}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.permanant_add && formik.touched.permanant_add ? (
                  <p className="text-danger">{formik.errors.permanant_add}</p>
                ) : null}
              </div>
              <div className="col-12">
                <h6>Education Details</h6>
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="mobile" className="form-label">
                  Highest Qualification
                </label>
                <select
                  id="inputState"
                  className="form-select"
                  name="education"
                  value={formik.values.education}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option defaultValue value={null}>
                    Choose...
                  </option>
                  <option value={'12th'}>12th</option>
                  <option value={'Graduation'}>Graduation</option>
                  <option value={'PostGraduation'}>PostGraduation</option>
                </select>
                {formik.errors.education && formik.touched.education ? (
                  <p className="text-danger">{formik.errors.education}</p>
                ) : null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="doc" className="form-label">
                  Date of Completion
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="doc"
                  placeholder="Enter Name"
                  name="degree_date"
                  value={formik.values.degree_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.degree_date && formik.touched.degree_date ? (
                  <p className="text-danger">{formik.errors.degree_date}</p>
                ) : null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="doc" className="form-label">
                  Upload Certificate
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="doc"
                  placeholder="Enter Name"
                  name="degrre_cert"
                  onChange={(event) => {
                    formik.setFieldValue('degrre_cert', event.currentTarget.files[0])
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.degrre_cert && formik.touched.degrre_cert ? (
                  <p className="text-danger">{formik.errors.degrre_cert}</p>
                ) : null}
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
                      name="experiance_type"
                      id="fresher"
                      value="Fresher"
                      checked={formik.values.experiance_type === 'Fresher'}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="fresher">
                      Fresher
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="experiance_type"
                      id="intwrn"
                      value="Intern"
                      checked={formik.values.experiance_type === 'Intern'}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="intwrn">
                      Intern
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="experiance_type"
                      id="experiance"
                      value="Experiance"
                      checked={formik.values.experiance_type === 'Experiance'}
                      onChange={formik.handleChange}
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
                  name="experiance_Duration"
                  value={formik.values.experiance_Duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.experiance_Duration && formik.touched.experiance_Duration ? (
                  <p className="text-danger">{formik.errors.experiance_Duration}</p>
                ) : null}
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
                  name="pre_org_name"
                  value={formik.values.pre_org_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.pre_org_name && formik.touched.pre_org_name ? (
                  <p className="text-danger">{formik.errors.pre_org_name}</p>
                ) : null}
              </div>
              <div className="mb-3 col-4">
                <label htmlFor="role" className="form-label">
                  Designation
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  placeholder="Enter Role"
                  name="pre_org_designation"
                  value={formik.values.pre_org_designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.pre_org_designation && formik.touched.pre_org_designation ? (
                  <p className="text-danger">{formik.errors.pre_org_designation}</p>
                ) : null}
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
                  name="pre_org_address"
                  value={formik.values.pre_org_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.pre_org_address && formik.touched.pre_org_address ? (
                  <p className="text-danger">{formik.errors.pre_org_address}</p>
                ) : null}
              </div>
              <div className="col-12">
                <h6>Login Credentials</h6>
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="role" className="form-label">
                  Employee Id
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  placeholder="Enter Role"
                  name="emp_id"
                  value={formik.values.emp_id || ''}
                  disabled
                />
                {formik.errors.emp_id && formik.touched.emp_id ? (
                  <p className="text-danger">{formik.errors.emp_id}</p>
                ) : null}
              </div>
              <div className="col-2 mb-3">
                <label htmlFor="role" className="form-label text-light">
                  Employee Id
                </label>
                <button type="button" className="btn btn-outline-info" onClick={getEmployeeId}>
                  Get Id
                </button>
              </div>
              <div className="col-4 mb-3">
                <label htmlFor="role" className="form-label">
                  Password
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  placeholder="Enter Role"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className="text-danger">{formik.errors.password}</p>
                ) : null}
              </div>
            </div>

            <button className="btn btn-outline-info" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddEmployee
