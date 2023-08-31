import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect } from 'react'
import { uploadEmployeeDocSchema } from '../Validations'
import { error_toast, success_toast } from 'src/Services/swalService'
import { useNavigate } from 'react-router-dom'
import { getCall, uploadsPost } from 'src/Services/service'

const UploadDoc = () => {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      profile_photo: null,
      aadhar_number: '',
      aadhar_doc: null,
      pan_number: '',
      pan_doc: null,
      resident_doc: null,
      education_doc: null,
      bank_acc_number: '',
      ifsc_code: '',
      bank_branch: '',
      bank_name: '',
      bank_doc: null,
      exp_cer_doc: null,
      sal_slip_doc: null,
    },
    validationSchema: uploadEmployeeDocSchema,
    onSubmit: (values) => {
      uploadDocs(values)
    },
  })

  useEffect(() => {
    getUserDocs()
  }, [])

  const getUserDocs = () => {
    getCall('users/getUserDocs').then((result) => {
      if (result.data.code == 200) {
        if (result.data.data[0]) {
          formik.setValues(result.data.data[0])
          let a = ['profile_photo', 'aadhar_doc', 'pan_doc', 'resident_doc', 'education_doc', 'bank_doc', 'exp_cer_doc', 'sal_slip_doc']
          for (let i = 0; i < a.length; i++) {
            let ip = document.getElementById(a[i])
            // ip.value = result.data.data[0]?.a[i]
            // console.log(ip);
          }

        }
      } else {
      }
    })
      .catch((err) => {
        console.log(err)
      })
  }

  const uploadDocs = async (values) => {
    const formdata = new FormData()
    for (const key in formik.values) {
      if (formik.values.hasOwnProperty(key)) {
        formdata.append(key, formik.values[key])
      }
    }
    await uploadsPost('users/uploadDocs', values)
      .then((result) => {
        if (result.data.code == 200) {
          formik.resetForm()
          let a = ['profile_photo', 'aadhar_doc', 'pan_doc', 'resident_doc', 'education_doc', 'bank_doc', 'exp_cer_doc', 'sal_slip_doc']
          for (let i = 0; i < a.length; i++) {
            let ip = document.getElementById(a[i])
            ip.value = ''
          }
          success_toast(result.data.message)
          // navigate('/emplist')
        } else {
          error_toast(result.data.message)
        }
      })
      .catch((err) => {
        error_toast(err)
      })
  }
  return (
    <>
      <h4>Upload Documents</h4>
      <form onSubmit={formik.handleSubmit} action="" method="">
        <div className="row">
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Upload Profile Photo
            </label>
            <input
              type="file"
              className="form-control"
              id="profile_photo"
              placeholder="Enter Name"
              name="profile_photo"
              onChange={(event) => {
                formik.setFieldValue('profile_photo', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            <i className='fa fa-eye'></i>
            {formik.errors.profile_photo && formik.touched.profile_photo ? (
              <p className="text-danger">{formik.errors.profile_photo}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Aadhar Card
            </label>
            <input
              type="file"
              className="form-control"
              id="aadhar_doc"
              placeholder="Enter Name"
              name="aadhar_doc"
              onChange={(event) => {
                formik.setFieldValue('aadhar_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.aadhar_doc && formik.touched.aadhar_doc ? (
              <p className="text-danger">{formik.errors.aadhar_doc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="mobile1" className="form-label">
              Aadhar Card Number
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile1"
              placeholder="Enter Mobile Number"
              name="aadhar_number"
              value={formik.values.aadhar_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.aadhar_number && formik.touched.aadhar_number ? (
              <p className="text-danger">{formik.errors.aadhar_number}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Pan Card
            </label>
            <input
              type="file"
              className="form-control"
              id="pan_doc"
              placeholder="Enter Name"
              name="pan_doc"
              onChange={(event) => {
                formik.setFieldValue('pan_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.pan_doc && formik.touched.pan_doc ? (
              <p className="text-danger">{formik.errors.pan_doc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="mobile1" className="form-label">
              Pan Card Number
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile1"
              placeholder="Enter Mobile Number"
              name="pan_number"
              value={formik.values.pan_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.pan_number && formik.touched.pan_number ? (
              <p className="text-danger">{formik.errors.pan_number}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Residentical Proof
            </label>
            <input
              type="file"
              className="form-control"
              id="resident_doc"
              placeholder="Enter Name"
              name="resident_doc"
              onChange={(event) => {
                formik.setFieldValue('resident_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.resident_doc && formik.touched.resident_doc ? (
              <p className="text-danger">{formik.errors.resident_doc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Higher Education Certificate
            </label>
            <input
              type="file"
              className="form-control"
              id="education_doc"
              placeholder="Enter Name"
              name="education_doc"
              onChange={(event) => {
                formik.setFieldValue('education_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.education_doc && formik.touched.education_doc ? (
              <p className="text-danger">{formik.errors.education_doc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Bank Passbook / Cheque
            </label>
            <input
              type="file"
              className="form-control"
              id="bank_doc"
              placeholder="Enter Name"
              name="bank_doc"
              onChange={(event) => {
                formik.setFieldValue('bank_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bank_doc && formik.touched.bank_doc ? (
              <p className="text-danger">{formik.errors.bank_doc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="mobile1" className="form-label">
              Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile1"
              placeholder="Enter Mobile Number"
              name="bank_acc_number"
              value={formik.values.bank_acc_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bank_acc_number && formik.touched.bank_acc_number ? (
              <p className="text-danger">{formik.errors.bank_acc_number}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="mobile1" className="form-label">
              Bank Name
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile1"
              placeholder="Enter Mobile Number"
              name="bank_name"
              value={formik.values.bank_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bank_name && formik.touched.bank_name ? (
              <p className="text-danger">{formik.errors.bank_name}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="mobile1" className="form-label">
              IFSC Code
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile1"
              placeholder="Enter Mobile Number"
              name="ifsc_code"
              value={formik.values.ifsc_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.ifsc_code && formik.touched.ifsc_code ? (
              <p className="text-danger">{formik.errors.ifsc_code}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="mobile1" className="form-label">
              Branch
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile1"
              placeholder="Enter Mobile Number"
              name="bank_branch"
              value={formik.values.bank_branch}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bank_branch && formik.touched.bank_branch ? (
              <p className="text-danger">{formik.errors.bank_branch}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Experiance Certificate
            </label>
            <input
              type="file"
              className="form-control"
              id="exp_cer_doc"
              placeholder="Enter Name"
              name="exp_cer_doc"
              onChange={(event) => {
                formik.setFieldValue('exp_cer_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.exp_cer_doc && formik.touched.exp_cer_doc ? (
              <p className="text-danger">{formik.errors.exp_cer_doc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Latest Salary Slip
            </label>
            <input
              type="file"
              className="form-control"
              id="sal_slip_doc"
              placeholder="Enter Name"
              name="sal_slip_doc"
              onChange={(event) => {
                formik.setFieldValue('sal_slip_doc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.sal_slip_doc && formik.touched.sal_slip_doc ? (
              <p className="text-danger">{formik.errors.sal_slip_doc}</p>
            ) : null}
          </div>
        </div>
        <div>
          <button className="btn btn-outline-info" type="submit">
            Submit
          </button>
        </div>
      </form>

    </>
  )
}

export default UploadDoc
