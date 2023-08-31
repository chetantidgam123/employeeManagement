/* eslint-disable react/prop-types */
import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthState } from '../Context/AuthProvider'

const AdminRouter = ({ children }) => {
    const { user } = AuthState()
    if (user && user?.role == 'admin') {
        return children
    } else
        return <Navigate to="/login" />
}

export default AdminRouter
