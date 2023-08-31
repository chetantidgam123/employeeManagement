import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { login } from 'src/Services/service'
import { error_toast, success_toast } from 'src/Services/swalService'

const Login = () => {
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({ email_id: '', password: '' })


  const submitHandler = async () => {

    // if (!data.email || !data.password) {
    //     toast({
    //         title: "Please Fill all the feilds",
    //         status: "warning",
    //         duration: 5000,
    //         isClosable: true,
    //         position: "top-right"
    //     })
    //     setloader(false);
    //     return
    // }

    await login(loginData)
      .then((result) => {
        if (result.data.code == 200) {
          localStorage.setItem('token', JSON.stringify(result.data.token))
          localStorage.setItem('role', JSON.stringify(result.data.data.role))
          navigate('/dashboard')
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
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" name='email_id' autoComplete="username" value={loginData?.email_id} onChange={(e) => { setLoginData({ ...loginData, email_id: e.target.value }) }} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name='password'
                        placeholder="Password"
                        autoComplete="current-password"
                        value={loginData?.password} onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={submitHandler}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
