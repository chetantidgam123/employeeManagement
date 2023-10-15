import { useFormik } from 'formik'
import React from 'react'
import { applyLeaveSchema } from '../Validations'
import { postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'
import DatePicker from 'react-datepicker'
import moment from 'moment'
const ApplyLeave = () => {
    const formik = useFormik({
        initialValues: {
            start: new Date(),
            end: new Date(),
            color: "#ffffff",
            title: '',
            resource: '',
            leave_type: '',
        },
        validationSchema: applyLeaveSchema,
        onSubmit: (values) => {
            applyLeave(values)
        },
    })
    const applyLeave = async (values) => {
        values.start = moment(values.start).format('YYYY-MM-DD')
        values.end = moment(values.end).format('YYYY-MM-DD')
        await postCall('/leaves/apply_leave', values).then((result) => {
            if (result.data.code == 200) {
                formik.resetForm()
                if(result.data.rejected && result.data.rejected.length>0 ){
                    error_toast(result.data.rejected)
                }else{
                    success_toast(result.data.message)
                }
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
        <div>
            <form onSubmit={formik.handleSubmit} action="" method='' className='w-50 m-auto'>
                <label htmlFor="title">Title</label>
                <input type="text" className='form-control' name="title" id="" value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.errors.title && formik.touched.title ? (
                    <p className="text-danger">{formik.errors.title}</p>
                ) : null}
                <div className="dflex row applyleaveDatepicker">
                         <div className="col-6">
                            <div htmlFor="title">Start Date</div>
                            <DatePicker
                                style={{display:'block'}}
                                selected={formik.values.start}
                                dateFormat={'dd-MM-yyyy'}
                                name='start'
                                id='start'
                                className="form-control"
                                placeholderText="Start Date"
                                onBlur={formik.handleBlur}
                                onChange={(date)=>{formik.setFieldValue('start',date)}}
                            />
                        {formik.errors.start && formik.touched.start ? (
                    <p className="text-danger">{formik.errors.start}</p>
                ) : null}
                        </div>
                        <div className="col-6">
                        <div htmlFor="title">End Date</div>
                            <DatePicker
                                selected={formik.values.end}
                                dateFormat={'dd-MM-yyyy'}
                                className="form-control"
                                id='end'
                                name="end"
                                onBlur={formik.handleBlur}
                                onChange={(date)=>{formik.setFieldValue('end',date)}}
                                minDate={formik.values.start}
                                placeholderText="End Date"
                            />
                              {formik.errors.end && formik.touched.end ? (
                    <p className="text-danger">{formik.errors.end}</p>
                ) : null}
                        </div>
                </div>
                <label htmlFor="title">Leave Type</label>
                <select name="leave_type" id="" className="form-select" value={formik.values.leave_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}>
                    <option value="">Select leave type</option>
                    <option value="HL1">1st Half Day</option>
                    <option value="HL2">2nd Half Day</option>
                    <option value="FL">Full Day</option>
                </select>
                {formik.errors.leave_type && formik.touched.leave_type ? (
                    <p className="text-danger">{formik.errors.leave_type}</p>
                ) : null}
                <label htmlFor="title">Select Color</label>
                <input type="color" className='form-control' name="color" id="" value={formik.values.color}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.errors.color && formik.touched.color ? (
                    <p className="text-danger">{formik.errors.color}</p>
                ) : null}
                <label htmlFor="title">Discription</label>
                <input type="text" className='form-control' name="resource" id="" value={formik.values.resource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.errors.resource && formik.touched.resource ? (
                    <p className="text-danger">{formik.errors.resource}</p>
                ) : null}
                <div className='mt-2'>
                    <button type='submit' className="btn btn-outline-info">Apply Leave</button>
                </div>
            </form>
        </div>
    )
}

export default ApplyLeave