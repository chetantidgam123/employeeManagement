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
import { getAllEmployee, getUserById } from 'src/Services/service'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
const EmployeeList = () => {
  const navigate = useNavigate()
  const [empList, setempList] = useState([])
  useEffect(() => {
    getAllEmployeeList()
  }, [])

  const getAllEmployeeList = async () => {
    await getAllEmployee()
      .then((result) => {
        if (result.data.code == 200) {
          setempList(result.data.data)
        } else {
          setempList([])
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleChange = (e,ele)=>{
    let a = empList.map((x)=>{
      if(ele.id===x.id){
        x.is_active = !x.is_active
      }
      return x
    })
    setempList(a)
  }
    const getEmployeeById = async (id) => {
    await getUserById(id)
      .then((result) => {
        if (result.data.code == 200) {
         console.log(result.data.data)
        } else {
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h4>Employee List</h4>
        <CButton
          color="info"
          className="me-2"
          variant="outline"
          onClick={() => {
            navigate('/addEmployee')
          }}
        >
          Add Employee
        </CButton>
      </div>
      <CTable bordered className="mt-2">
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
          {empList &&
            empList.map((ele, i) => {
              return (
                <CTableRow key={i}>
                  <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                  <CTableHeaderCell scope="row">{ele.emp_id}</CTableHeaderCell>
                  <CTableDataCell>{ele.firstname + ' ' + ele.lastname}</CTableDataCell>
                  <CTableDataCell>{ele.email_id}</CTableDataCell>
                  <CTableDataCell>{ele.mobilenumber}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" className="" variant="outline">
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="info" className="mx-2" variant="outline" onClick={()=>{getEmployeeById(ele.id)}}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </CButton>
                    <CFormSwitch
                      className='d-inline-block'
                      label=""
                      color='info'
                      id="formSwitchCheckChecked"
                      checked={ele.is_active}
                      onChange={(e)=>{handleChange(e,ele)}}
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

export default EmployeeList
