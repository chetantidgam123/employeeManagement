/* eslint-disable react/prop-types */
import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthState } from '../Context/AuthProvider'

const AdminRouter = ({ children }) => {
    const { user } = AuthState()
    if (!user) {
        return <Navigate to="/login" />
    } else if (user?.role == 'admin') {
        return children
    }
    return
}

export default AdminRouter
