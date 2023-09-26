import React, { useEffect, useState } from 'react'
import {
  CButton,
  CFormSwitch,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getCall, postCall} from 'src/Services/service'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { error_toast, success_toast } from 'src/Services/swalService'
import moment from 'moment'

const Holidays = () => {
    const navigate = useNavigate()
    const [holidaysList, setHolidayList] = useState([])
 
    const getAllHolidaysList = async () => {
      await getCall('holiday/getHolidaysList_emp', {})
        .then((result) => {
          if (result.data.status) {
            setHolidayList(result.data.data)
          } else {
            setHolidayList([])
          }
        })
        .catch((err) => {
          error_toast(err.response.data.message)
        })
    }
  
    useEffect(() => {
      getAllHolidaysList()
    }, [])
    return (
      <div>
        <div className="d-flex justify-content-between">
          <h4>Holiday List</h4>
        </div>
        <CTable bordered className="mt-2">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr No.</CTableHeaderCell>
              <CTableHeaderCell scope="col">Holiday Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Discription</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {holidaysList &&
              holidaysList.map((ele, i) => {
                return (
                  <CTableRow key={i}>
                    <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                    <CTableHeaderCell scope="row">{ele.title}</CTableHeaderCell>
                    <CTableDataCell>{moment(ele.date).format('DD-MM-YYYY')}</CTableDataCell>
                    <CTableDataCell>{ele.description}</CTableDataCell>
                  </CTableRow>
                )
              })}
          </CTableBody>
        </CTable>
      </div>
    )
  }

export default Holidays