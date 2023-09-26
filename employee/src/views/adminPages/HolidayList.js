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

const HolidayList = () => {
    const navigate = useNavigate()
    const [holidaysList, setHolidayList] = useState([])
 
    const getAllHolidaysList = async () => {
      await getCall('holiday/getHolidaysList', {})
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
    const handleChange = (e, ele) => {
    if(ele.is_active){
      toggleHoliay(false,ele.holiday_id)
    }else{
      toggleHoliay(true,ele.holiday_id)
    }
    }
    const toggleHoliay = async(is_active,holiday_id)=>{
      let jbody ={
        is_active:is_active,
        holiday_id:holiday_id
      }
      await postCall('/holiday/toggleHoliday', jbody)
      .then((result) => {
        if (result.data.status) {
            getAllHolidaysList()
            success_toast(result.data.message)
        } else {
            error_toast(result.data.message)
        }
    })
        .catch((err) => {
            error_toast(err)
        })
    }
    const getoEditPAge = (id)=>{
      navigate('/editholiday/'+id)
    }
    useEffect(() => {
      getAllHolidaysList()
    }, [])
    return (
      <div>
        <div className="d-flex justify-content-between">
          <h4>Holiday List</h4>
          <CButton
            color="info"
            className="me-2"
            variant="outline"
            onClick={() => {
              navigate('/addholiday')
            }}
          >
            Add Holiday
          </CButton>
        </div>
        <CTable bordered className="mt-2">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr No.</CTableHeaderCell>
              <CTableHeaderCell scope="col">Holiday Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Discription</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
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
                    <CTableDataCell className='d-flex align-items-center justify-content-between'>
                      <CButton color="info" className="" variant="outline" onClick={()=>{getoEditPAge(ele.holiday_id)}} >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CFormSwitch
                        className='d-inline-block'
                        label=""
                        color='info'
                        id="formSwitchCheckChecked"
                        checked={ele.is_active}
                        onChange={(e) => { handleChange(e, ele) }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
          </CTableBody>
        </CTable>
      </div>
    )
  }

export default HolidayList