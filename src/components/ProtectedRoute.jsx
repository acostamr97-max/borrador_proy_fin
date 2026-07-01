import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export const ProtectedRoute = ({ children, roles }) => {
    const { token, usuario } = useAuth()

    if (!token) {
        return <Navigate to='/login' />
    }

   
    if (roles && !roles.includes(usuario?.role)) {
        return <Navigate to='/home' />
    }

    return children
}