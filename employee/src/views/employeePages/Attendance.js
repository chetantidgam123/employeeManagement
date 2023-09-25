import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { postCall } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'
import DatePicker from 'react-datepicker'
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
const Attendance = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [attendance, setAttendence] = useState([])
  const PunchIn = async () => {
    let jbody = {
      day: moment().date(),
      year: moment().year(),
      month: moment().month() + 1,
    }
    await postCall('/attendance/punchIn', jbody)
      .then((result) => {
        if (result.data.status) {
          success_toast(result.data.message)
          // navigate('/emplist')
          // setAttendence(JSON.parse(result.data.data.month_data))
          getAttendance(new Date())
        } else {
          error_toast(result.data.message)
        }
      })
      .catch((err) => {
        error_toast(err.response.data.message)
      })
  }
  const getAttendance = async (date)=>{
            setStartDate(date)
        let jbody = {
            month:moment(date).month()+1,
            year:moment(date).year()
        }
    await postCall('/attendance/getAttByMonthYear', jbody)
      .then(async (result) => {
        if (result.data.status) {
          let att = JSON.parse(result.data.data.month_data)
          let lev = result.data.leaves
          if(lev && lev.length>0){
            await lev.map((e)=>{
              let day = moment(e.leave_date).date()
              att[day-1].punch_in = 'L'
              return e
            })
          }
          setAttendence(att)
        } else {
            setAttendence([])
            error_toast(result.data.message)
        }
    })
    .catch((err) => {
          setAttendence([])
        error_toast(err.response.data.message)
      })
  }
  useEffect(()=>{
    getAttendance(new Date())
  },[])
  return (
    <div>
      <button className="btn btn-outline-primary" onClick={PunchIn}>
        Punch In
      </button>
      <div className="mt-2">
        <DatePicker
          className="form-control"
          selected={startDate}
          onChange={(date) => getAttendance(date)}
          showMonthYearPicker
          excludeDates={[1661990400000, 1664582400000, 1667260800000, 1672531200000]}
          dateFormat="MM/yyyy"
          maxDate={new Date()}
        />
        <h4>Monthly Attendance</h4>
        <div className='table-responsive'>
        <CTable bordered className="mt-2">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Days.</CTableHeaderCell>
                            {attendance &&
                            attendance.map((ele, i) => {
                                return (
                                    <CTableHeaderCell key={i} scope="col">{ele.day}</CTableHeaderCell>
                                )
                            })
                        }
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow >
                            <CTableHeaderCell  scope="row">Attendance</CTableHeaderCell>
                        {attendance &&
                            attendance.map((ele, j) => {
                                return (
                                        <CTableHeaderCell key={j} scope="row">{ele.punch_in}</CTableHeaderCell>
                                        )
                                    })}
                                    </CTableRow>
                    </CTableBody>
                </CTable>
            
        </div>
      </div>
    </div>
  )
}

export default Attendance
