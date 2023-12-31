import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
    CCard, CCardBody, CCardHeader, CButton,
    CFormSwitch,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTooltip,
    CBadge,
} from '@coreui/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { deleteCall, getCall, postCall } from 'src/Services/service'
import { confirm_toast, error_toast, success_toast } from 'src/Services/swalService'
const LeavesDetails = () => {
    const [leaves, setLeaves] = useState([])
    const [leavesDetails, setLeavesDetails] = useState({
        total_leaves: '',
        applied_leaves: '',
        pending_leaves: ''
      })
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    useEffect(() => {
        getLeaves()
        getLeavesData()
    }, [])

    const getLeaves = async () => {
        let jbody = {
            startDate: (!startDate || startDate == '') ? moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD') : moment(startDate).subtract(1, 'days').format('YYYY-MM-DD'),
            endDate: (!endDate || endDate == '') ? moment().endOf('month').add(1, 'days').format('YYYY-MM-DD') : moment(endDate).add(1, 'days').format('YYYY-MM-DD'),

        }
        await postCall('leaves/getleaveslist', jbody)
            .then((result) => {
                if (result.data.code == 200) {
                    setLeaves(result.data.data)
                } else {
                    setLeaves([])
                }
            })
            .catch((err) => {
                setLeaves([])
                // error_toast(err.response.data.message)
            })
    }
    const getLeavesData = async () => {
        await postCall('leaves/getTotalLeavesData',{end_Date:moment()})
            .then((result) => {
                if (result.data.code == 200) {
                    let {total_leaves,applied_leaves,pending_leaves} = result.data.data
                    setLeavesDetails({...leavesDetails,pending_leaves,total_leaves,applied_leaves})
                } else {
                    setLeavesDetails({pending_leaves:0,total_leaves:0,applied_leaves:0})
                    error_toast(result.data.message)
                }
            })
            .catch((err) => {
                setLeaves([])
                // error_toast(err.response.data.message)
            })
    }

    const delete_leave =  (leave)=>{
        console.log(leave);
        let callback =  async (confirm)=>{
            if(confirm.isConfirmed){
                 await deleteCall('leaves/delete_leave/'+leave.leave_id)
                .then((result)=>{
                    if(result.data.status){
                        success_toast(result.data.message)
                        getLeaves()
                    }else{
                        error_toast(result.data.message)
                    }
                }).catch((err)=>{
                    error_toast(err.response.data.message)
                })
            }
        }
        confirm_toast(callback)
    }
    return (
        <CCard>
            <CCardHeader className='row'>
                <h4 className='col-12'> Leave Details</h4>
                <h5 className='col-3'> Total Leaves <br />{leavesDetails.total_leaves}</h5>
                <h5 className='col-3'> Leaves Applied <br />{leavesDetails.applied_leaves}</h5>
                <h5 className='col-3'> Available Leaves <br />{leavesDetails.pending_leaves}</h5>
            </CCardHeader>
            <CCardBody>
                <div className='d-flex justify-content-between'>
                    <h5>Leaves List</h5>
                    <div className="col-6 row">
                        <div className="col text-center">
                            <DatePicker
                                className="form-control"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                dateFormat="dd/MM/yyyy"
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
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                    <div className="col-1">
                        <button className="btn btn-outline-info" onClick={getLeaves}>Search</button>
                    </div>
                </div>
                <CTable bordered className="mt-2">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Sr No.</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Emp. Id</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Full Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Leave Date</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Apply Date</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Leave Type</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Leave Status</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {leaves.length==0 && <CTableRow><CTableDataCell colSpan={7} className='my-5'><p className='text-center'>No data Found</p></CTableDataCell></CTableRow>}
                        {leaves &&
                            leaves.map((ele, i) => {
                                return (
                                    <CTableRow key={i}>
                                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                                        <CTableHeaderCell scope="row">{ele.emp_id}</CTableHeaderCell>
                                        <CTableDataCell>{ele.firstname + ' ' + ele.lastname}</CTableDataCell>
                                        <CTableDataCell>{moment(ele.leave_date).format('DD-MM-YYYY')}</CTableDataCell>
                                        <CTableDataCell>{moment(ele.apply_date).format('DD-MM-YYYY')}</CTableDataCell>
                                        <CTableDataCell>{ele.leave_type}</CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <CBadge color={ele.status == 'approved' ? 'success' : ele.status == 'pending' ? 'warning' : 'danger'} shape="rounded-pill">
                                                {ele.status}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className=''>
                                            <CTooltip content='Remove' placement='top'>
                                                <button disabled={ele.status==='approved'} className="btn btn-danger" onClick={()=>{delete_leave(ele)}}>
                                                    <i className='fa fa-trash text-light'></i>
                                                </button>
                                            </CTooltip>
                                        </CTableDataCell>
                                    </CTableRow>
                                )
                            })}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    )
}

export default LeavesDetails