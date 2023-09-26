import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { holidaySchema } from '../Validations'
import { getCall, postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

const AddHoliday = () => {
    const navigate = useNavigate()
    const params = useParams()
    const formik = useFormik({
        initialValues: {
            date: '',
            color: "#ffffff",
            title: '',
            description: '',
        },
        validationSchema: holidaySchema,
        onSubmit: (values) => {
            addHolidays(values)
        },
    })
    const addHolidays = async (values) => {
        await postCall('/holiday/addholiday', values).then((result) => {
            if (result.data.status) {
                formik.resetForm()
                success_toast(result.data.message)
                navigate('/holidaylist')
            } else {
                error_toast(result.data.message)
            }
        })
            .catch((err) => {
                error_toast(err)
            })
    }
    useEffect(()=>{
        if(params.id && params.id>0){
            getHolidayById(params.id)
        }
    },[])
    const getHolidayById = async (id) => {
        await getCall('holiday/getHolidayById/' + id, {})
          .then((result) => {
            if (result.data.status) {
                result.data.data.date=moment(result.data.data.date).format('YYYY-MM-DD')
                formik.setValues(result.data.data)
            } else {
                error_toast(result.data.message)
            }
          })
          .catch((err) => {
            error_toast(err.message)
          })
      }
    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4>{params.id && params.id>0?'Edit Holiday':'Add Holiday'}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={formik.handleSubmit} action="" method='' className='w-50 m-auto'>
                        <label htmlFor="title">Title</label>
                        <input type="text" className='form-control' name="title" id="title" value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.errors.title && formik.touched.title ? (
                            <p className="text-danger">{formik.errors.title}</p>
                        ) : null}
                        <label htmlFor="date" className='form-label mt-2'>Date</label>
                        <input type="date" className='form-control' name="date" id="date" value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.errors.start && formik.touched.start ? (
                            <p className="text-danger">{formik.errors.start}</p>
                        ) : null}
                        <label htmlFor="color" className='form-label mt-2'>Select Color</label>
                        <input type="color" className='form-control' name="color" id="color" value={formik.values.color}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.errors.color && formik.touched.color ? (
                            <p className="text-danger">{formik.errors.color}</p>
                        ) : null}
                        <label htmlFor="description" className='form-label mt-2'>Discription</label>
                        <input type="text" className='form-control' name="description" id="description" value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.errors.resource && formik.touched.resource ? (
                            <p className="text-danger">{formik.errors.resource}</p>
                        ) : null}
                        <div className='mt-2'>
                            <button type='submit' className="btn btn-outline-info">{params.id && params.id>0?'Edit Holiday':'Add Holiday'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddHoliday