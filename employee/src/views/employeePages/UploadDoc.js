import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect } from 'react'
import { uploadEmployeeDocSchema } from '../Validations'
import { error_toast, success_toast } from 'src/Services/swalService'
import { useNavigate } from 'react-router-dom'
import { uploadsPost } from 'src/Services/service'

const UploadDoc = () => {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      profilePhoto: null,
      aadharNumber: '',
      aadharDoc: null,
      panNumber: '',
      panDoc: null,
      residentDoc: null,
      educationDoc: null,
      bankAccNumber: '',
      ifscCode: '',
      bankBranch: '',
      bankName: '',
      bankDoc: null,
      expCerDoc: null,
      salSlipDoc: null,
    },
    validationSchema: uploadEmployeeDocSchema,
    onSubmit: (values) => {
      uploadDocs(values)
    },
  })

  useEffect(() => {

  }, [])

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
              id="doc"
              placeholder="Enter Name"
              name="profilePhoto"
              onChange={(event) => {
                formik.setFieldValue('profilePhoto', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.profilePhoto && formik.touched.profilePhoto ? (
              <p className="text-danger">{formik.errors.profilePhoto}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Aadhar Card
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="aadharDoc"
              onChange={(event) => {
                formik.setFieldValue('aadharDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.aadharDoc && formik.touched.aadharDoc ? (
              <p className="text-danger">{formik.errors.aadharDoc}</p>
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
              name="aadharNumber"
              value={formik.values.aadharNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.aadharNumber && formik.touched.aadharNumber ? (
              <p className="text-danger">{formik.errors.aadharNumber}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Pan Card
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="panDoc"
              onChange={(event) => {
                formik.setFieldValue('panDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.panDoc && formik.touched.panDoc ? (
              <p className="text-danger">{formik.errors.panDoc}</p>
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
              name="panNumber"
              value={formik.values.panNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.panNumber && formik.touched.panNumber ? (
              <p className="text-danger">{formik.errors.panNumber}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Residentical Proof
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="residentDoc"
              onChange={(event) => {
                formik.setFieldValue('residentDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.residentDoc && formik.touched.residentDoc ? (
              <p className="text-danger">{formik.errors.residentDoc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Higher Education Certificate
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="educationDoc"
              onChange={(event) => {
                formik.setFieldValue('educationDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.educationDoc && formik.touched.educationDoc ? (
              <p className="text-danger">{formik.errors.educationDoc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Bank Passbook / Cheque
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="bankDoc"
              onChange={(event) => {
                formik.setFieldValue('bankDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bankDoc && formik.touched.bankDoc ? (
              <p className="text-danger">{formik.errors.bankDoc}</p>
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
              name="bankAccNumber"
              value={formik.values.bankAccNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bankAccNumber && formik.touched.bankAccNumber ? (
              <p className="text-danger">{formik.errors.bankAccNumber}</p>
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
              name="bankName"
              value={formik.values.bankName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bankName && formik.touched.bankName ? (
              <p className="text-danger">{formik.errors.bankName}</p>
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
              name="ifscCode"
              value={formik.values.ifscCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.ifscCode && formik.touched.ifscCode ? (
              <p className="text-danger">{formik.errors.ifscCode}</p>
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
              name="bankBranch"
              value={formik.values.bankBranch}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.bankBranch && formik.touched.bankBranch ? (
              <p className="text-danger">{formik.errors.bankBranch}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Experiance Certificate
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="expCerDoc"
              onChange={(event) => {
                formik.setFieldValue('expCerDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.expCerDoc && formik.touched.expCerDoc ? (
              <p className="text-danger">{formik.errors.expCerDoc}</p>
            ) : null}
          </div>
          <div className="mb-3 col-4">
            <label htmlFor="doc" className="form-label">
              Latest Salary Slip
            </label>
            <input
              type="file"
              className="form-control"
              id="doc"
              placeholder="Enter Name"
              name="salSlipDoc"
              onChange={(event) => {
                formik.setFieldValue('salSlipDoc', event.currentTarget.files[0])
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.salSlipDoc && formik.touched.salSlipDoc ? (
              <p className="text-danger">{formik.errors.salSlipDoc}</p>
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
