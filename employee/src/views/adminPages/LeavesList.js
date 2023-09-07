import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTooltip,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CButton,
    CAccordionButton,
} from '@coreui/react'
import moment from 'moment'
import React, { useState } from 'react'
import { useEffect } from 'react'
import ReactDatePicker from 'react-datepicker'
import { getCall, postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'
import DatePicker from 'react-datepicker'
import './scss/leavs.scss'
const LeavesList = () => {
    const [emplist, setEmpList] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [status, setStatus] = useState('')
    const [employee, setEmployee] = useState('')
    const [leavesList, setleavesList] = useState([])
    const [empleaveListData, setEmpleaveListData] = useState([])
    const [visible, setVisible] = useState(false)
    const [reject_remark, setRejectRemark] = useState('')
    const [rejectData, setRejectData] = useState({})

    useEffect(() => {
        getAllEmployeeList()
        getEmpWhoAplLeave()
    }, [])

    useEffect(() => {

    }, [leavesList])

    const getAllEmployeeList = async () => {
        await getCall('users/getAllEmployee', {})
            .then((result) => {
                if (result.data.code == 200) {
                    setEmpList(result.data.data)
                } else {
                    setEmpList([])
                }
            })
            .catch((err) => {
                error_toast(err)
            })
    }
    const getEmpWhoAplLeave = async () => {
        setleavesList([])
        let body = {
            start_date: (!startDate || startDate == '') ? moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD') : moment(startDate).subtract(1, 'days').format('YYYY-MM-DD'),
            end_date: (!endDate || endDate == '') ? moment().endOf('month').add(1, 'days').format('YYYY-MM-DD') : moment(endDate).add(1, 'days').format('YYYY-MM-DD'),
            status: status,
            emp_id: employee,
        }
        await postCall('leaves/getEmpWhoAplLeave', body)
            .then(async (result) => {
                if (result.data.code == 200) {
                    let a = await result.data.data.map((e) => {
                        e.isOpen = false
                        return e
                    })
                    setleavesList(a)
                } else {
                    setleavesList([])
                    error_toast(result.data.message)
                }
            })
            .catch((err) => {
                setleavesList([])
                error_toast(err.response.data.message)
            })
    }
    const handleOpenAcordian = (value, index) => {
        if (!value.isOpen) {
            leavesList[index].isOpen = true
            setleavesList(leavesList)
            getEmp_leave(value)
        } else {
            leavesList[index].isOpen = false
            setleavesList(leavesList)
        }
    }
    const getEmp_leave = async (values) => {
        let jbody = {
            start_date: (!startDate || startDate == '') ? moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD') : moment(startDate).subtract(1, 'days').format('YYYY-MM-DD'),
            end_date: (!endDate || endDate == '') ? moment().endOf('month').add(1, 'days').format('YYYY-MM-DD') : moment(endDate).add(1, 'days').format('YYYY-MM-DD'),
            status: '',
            emp_id: values.emp_id,
        }
        await postCall('leaves/getEmpLeaveDateRange', jbody)
            .then(async (result) => {
                if (result.data.code == 200) {
                    setEmpleaveListData(result.data.data)
                } else {
                    setEmpleaveListData([])
                }
            })
            .catch((err) => {
                error_toast(err)
            })

    }
    const updateStatus = async (status, values) => {
        let jbody = {
            leave_id: values.leave_id,
            status: status,
            reject_remark: status === 'approved' ? 'Approved Succesufully' : reject_remark
        }
        await postCall('leaves/updateEmpLeave', jbody)
            .then(async (result) => {
                if (result.data.code == 200) {
                    getEmp_leave(values)
                    success_toast(result.data.message)
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
            <CCard>
                <CCardHeader>
                    <h5>Employee Leave Details</h5>
                </CCardHeader>
                <CCardBody>
                    <div className="row">
                        <div className="col-3">
                            <select
                                value={employee}
                                name="employeeList"
                                id=""
                                className="form-select"
                                onChange={(e) => { setEmployee(e.target.value) }}
                            >
                                <option value="">Select Employee</option>
                                {emplist &&
                                    emplist.map((e) => (
                                        <option key={e.emp_id} value={e.emp_id}>
                                            {e.firstname + ' ' + e.lastname}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="col text-center">
                            <DatePicker
                                className="form-control"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                            />
                        </div>
                        <div className="col">
                            <DatePicker
                                className="form-control"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                            />
                        </div>
                        <div className="col-3">
                            <select name="" id="" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="col-1">
                            <button className='btn btn-outline-info' onClick={getEmpWhoAplLeave}>Search</button>
                        </div>
                    </div>
                    <div className='mt-3'>
                        {
                            leavesList.length == 0 ? (<div className='text-center notFoundData'><h5>Data Not Found</h5></div>) : (
                                <CAccordion>
                                    {leavesList &&
                                        leavesList.map((e, i) => {
                                            return (
                                                <CAccordionItem key={i} itemKey={i}>
                                                    <CAccordionHeader className='py-1' style={{ 'padding': '0 !important' }} onClick={() => { handleOpenAcordian(e, i) }}>
                                                        <div className='row col-12'>
                                                            <div className='col-1'><p>{i + 1}</p></div>
                                                            <div className='col-2'><p>{e.firstname}</p></div>
                                                            <div className='col-2'><p>{e.lastname}</p></div>
                                                            <div className='col-2'><p>{e.emp_id}</p></div>
                                                        </div>
                                                    </CAccordionHeader>
                                                    <CAccordionBody>
                                                        <CTable bordered>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell scope="col">Sr. No</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Leave Date</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Apply Date</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Leave Title</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                {
                                                                    empleaveListData && empleaveListData.map((leave, j) => {
                                                                        return (
                                                                            <CTableRow key={leave.leave_id}>
                                                                                <CTableHeaderCell scope="row">{j + 1}</CTableHeaderCell>
                                                                                <CTableDataCell>{moment(leave.leave_date).format('DD-MM-YYYY')}</CTableDataCell>
                                                                                <CTableDataCell>{moment(leave.apply_date).format('DD-MM-YYYY')}</CTableDataCell>
                                                                                <CTableDataCell>{leave.title}</CTableDataCell>
                                                                                <CTableDataCell>{leave.resource}</CTableDataCell>
                                                                                <CTableDataCell className='d-flex justify-content-between'>
                                                                                    <CTooltip content='Approved' placement="top" >
                                                                                        <button className="btn btn-success" disabled={leave.status != 'pending'} onClick={() => { updateStatus('approved', leave) }} >
                                                                                            <i className="fa fa-check text-white" aria-hidden="true"></i>
                                                                                        </button>
                                                                                    </CTooltip>
                                                                                    <CTooltip content='Reject' placement="top" >
                                                                                        <button className="btn btn-danger ms-2" disabled={leave.status != 'pending'} onClick={() => { setVisible(true); setRejectData(leave) }} >
                                                                                            <i className="fa fa-trash text-white" aria-hidden="true"></i>
                                                                                        </button>
                                                                                    </CTooltip>
                                                                                </CTableDataCell>
                                                                            </CTableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </CTableBody>
                                                        </CTable>
                                                    </CAccordionBody>
                                                </CAccordionItem>
                                            )
                                        })}
                                </CAccordion>)
                        }

                    </div>
                </CCardBody>
            </CCard>
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Leaves Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <textarea className='form-control' name='reamrk' value={reject_remark} onChange={(e) => { setRejectRemark(e.target.value) }}>

                    </textarea>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="danger" variant='outline' onClick={() => { updateStatus('reject', rejectData) }}>Reject Leave</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default LeavesList
