import React, { useEffect, useState } from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getAllEmployee } from 'src/Services/service'
import CIcon from '@coreui/icons-react'
import {cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
const EmployeeList = () => {
  const navigate = useNavigate()
  const [empList, setempList] = useState([])
  useEffect(()=>{
    getAllEmployeeList()
  },[])

  const getAllEmployeeList = async ()=>{
    await getAllEmployee().then((result)=>{
      if(result.data.code==200){
        setempList(result.data.data)
      }else{
        setempList([])
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h4>Employee List</h4>
            <CButton  color='info'className="me-2" 
                        variant="outline" onClick={()=>{navigate('/addEmployee')}}  >
                      Add Employee
                    </CButton>
      </div>
         <CTable bordered className='mt-2'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sr No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Emp. Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Full Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  { empList && empList.map((ele,i)=>{
                 return (
                 <CTableRow key={i}>
                    <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                    <CTableHeaderCell scope="row">{ele.emp_id}</CTableHeaderCell>
                    <CTableDataCell>{ele.firstname+" "+ele.lastname}</CTableDataCell>
                    <CTableDataCell>{ele.email_id}</CTableDataCell>
                    <CTableDataCell>{ele.mobilenumber}</CTableDataCell>
                    <CTableDataCell>
                        <CButton  color='info'className="me-2" 
                        variant="outline">
                      <CIcon icon={cilPencil} />
                    </CButton>
                        <CButton  color='info'className="me-2" 
                        variant="outline">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </CButton>
                    </CTableDataCell>
                  </CTableRow>
                  )
                  })
                  }
                </CTableBody>
              </CTable>
    </div>
  )
}

export default EmployeeList