import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { updateEmpProfileSchema } from '../Validations'
import { getCall, postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthState } from 'src/Context/AuthProvider'
const UpdateProfile = () => {
    const params = useParams()
    const { user } = AuthState()
    const [employee, setEmployee] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        email_id: '',
        gender: '',
        emp_id: '',
    })
    const navigate = useNavigate()
    useEffect(() => {
        getEmployeeDetailsById()
    }, [])

    const formik = useFormik({
        initialValues: {
            doj: '',
            salary: '',
            increse_sal: '',
            date_of_app: '',
            designation: '',
            prometed_desig: '',
        },
        validationSchema: updateEmpProfileSchema,
        onSubmit: (values) => {
            let obj = values
            obj.emp_id = employee.emp_id
            updateEmployee(obj)
        },
    })
    const updateEmployee = async (values) => {
        await postCall('users/updateEmployee', values)
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
    const getEmployeeDetailsById = async () => {
        await getCall('users/getupdateProfile/' + params.id)
            .then((result) => {
                if (result.data.code == 200) {
                    setEmployee(result.data.data[0])
                    let a = result.data.data[0]
                    a.date_of_app = a.date_of_app == null ? '' : a.date_of_app
                    a.designation = a.designation == null ? '' : a.designation
                    a.doj = a.doj == null ? '' : a.doj
                    a.increse_sal = a.increse_sal == null ? '' : a.increse_sal
                    a.prometed_desig = a.prometed_desig == null ? '' : a.prometed_desig
                    a.salary = a.salary == null ? '' : a.salary
                    formik.setValues(a)
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
                                    value={employee.firstname}
                                    disabled
                                />
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
                                    disabled
                                    value={employee.middlename}
                                />
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
                                    disabled
                                    value={employee.lastname}
                                />
                            </div>
                            <div className="col-4 mb-3">
                                <label htmlFor="role" className="form-label">
                                    Employee Id
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role"
                                    placeholder="Enter Role"
                                    name="emp_id"
                                    value={employee.emp_id}
                                    disabled
                                />
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
                                            checked={employee.gender === 'Male'}
                                            readOnly
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
                                            checked={employee.gender === 'Female'}
                                            readOnly
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
                                            checked={employee.gender === 'Other'}
                                            readOnly
                                        />
                                        <label className="form-check-label" htmlFor="inlineRadio3">
                                            Other
                                        </label>
                                    </div>
                                </div>
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
                                    value={employee.email_id}
                                    disabled
                                />
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="doj" className="form-label">
                                    Date of Joining
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="doj"
                                    placeholder="Enter Name"
                                    name="doj"
                                    value={formik.values.doj}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.doj && formik.touched.doj ? (
                                    <p className="text-danger">{formik.errors.doj}</p>
                                ) : null}
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="designation" className="form-label">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="designation"
                                    placeholder="Enter Designation"
                                    name="designation"
                                    value={formik.values.designation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.designation && formik.touched.designation ? (
                                    <p className="text-danger">{formik.errors.designation}</p>
                                ) : null}
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="prometed_desig" className="form-label">
                                    Promoted Designation
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="prometed_desig"
                                    placeholder="Enter Promoted Designation"
                                    name="prometed_desig"
                                    value={formik.values.prometed_desig}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.prometed_desig && formik.touched.prometed_desig ? (
                                    <p className="text-danger">{formik.errors.prometed_desig}</p>
                                ) : null}
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="salary" className="form-label">
                                    Current Salary
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="salary"
                                    placeholder="Enter Salary"
                                    name="salary"
                                    value={formik.values.salary}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.salary && formik.touched.salary ? (
                                    <p className="text-danger">{formik.errors.salary}</p>
                                ) : null}
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="increse_sal" className="form-label">
                                    Incresed Salary
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="increse_sal"
                                    placeholder="Enter Salary"
                                    name="increse_sal"
                                    value={formik.values.increse_sal}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.increse_sal && formik.touched.increse_sal ? (
                                    <p className="text-danger">{formik.errors.increse_sal}</p>
                                ) : null}
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="date_of_app" className="form-label">
                                    Date of Appraisal
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date_of_app"
                                    placeholder="Enter Date of Appraisal"
                                    name="date_of_app"
                                    value={formik.values.date_of_app}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.date_of_app && formik.touched.date_of_app ? (
                                    <p className="text-danger">{formik.errors.date_of_app}</p>
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

export default UpdateProfile
