import jwtDecode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
       
        if (!token) {
            navigate('/login')
            return
        }
        var decoded = jwtDecode(token);
        setUser(decoded)
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

const AuthState = () => {
    return useContext(AuthContext);
}

export { AuthProvider, AuthState };