import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthState } from '../Context/AuthProvider'

const PrivateRouter = ({ children }) => {
    const { user } = AuthState()
    if (!user && !localStorage.getItem('token')) {
        return <Navigate to="/" />
    }
    return children
}

export default PrivateRouter
